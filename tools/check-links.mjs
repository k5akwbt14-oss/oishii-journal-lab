// Link & affiliate hygiene checker. Run AFTER `npm run build` (scans dist/).
//
//   npm run build && node tools/check-links.mjs            # full check
//   node tools/check-links.mjs --no-network                # skip external HTTP checks
//
// What it checks:
//   1. Literal href="#" anywhere in built HTML  -> FAIL (dead money click)
//   2. Internal links resolve to a file in dist -> FAIL if missing
//   3. Every page is listed in the sitemap      -> WARN if missing (404 page excluded)
//   4. External links respond                   -> GET + browser UA; 5xx/429/network = WARN
//      (Amazon serves 503/captcha to bots — warn-only by design, NEVER auto-remove)
//   5. Affiliate link density per page          -> WARN if sponsored links > H2 sections
//
// Exit code 1 only on FAIL findings; warnings never break the build.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SITE = 'https://oishiijournal.com';
const NO_NETWORK = process.argv.includes('--no-network');
const UA =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

if (!existsSync(DIST)) {
	console.error(`dist/ not found at ${DIST} — run \`npm run build\` first.`);
	process.exit(1);
}

const htmlFiles = [];
(function walk(dir) {
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		if (statSync(p).isDirectory()) walk(p);
		else if (name.endsWith('.html')) htmlFiles.push(p);
	}
})(DIST);

const fails = [];
const warns = [];
const externalLinks = new Map(); // url -> [pages]

// --- sitemap URLs ---
let sitemapUrls = new Set();
const sitemapPath = join(DIST, 'sitemap-0.xml');
if (existsSync(sitemapPath)) {
	const xml = readFileSync(sitemapPath, 'utf8');
	sitemapUrls = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
} else {
	warns.push('sitemap-0.xml missing from dist/');
}

for (const file of htmlFiles) {
	const page = '/' + relative(DIST, file).replace(/\\/g, '/');
	const html = readFileSync(file, 'utf8');

	// 1. literal "#" hrefs (money-click killers). In-page anchors like "#section" are fine.
	const deadCount = (html.match(/href="#"/g) ?? []).length;
	if (deadCount > 0) fails.push(`${page}: ${deadCount} literal href="#" link(s)`);

	// collect hrefs
	for (const m of html.matchAll(/href="([^"#][^"]*)"/g)) {
		const href = m[1];
		if (href.startsWith('http')) {
			if (!href.startsWith(SITE)) {
				if (!externalLinks.has(href)) externalLinks.set(href, []);
				externalLinks.get(href).push(page);
			}
			continue;
		}
		// 2. internal link -> must exist in dist
		if (href.startsWith('/')) {
			const clean = href.split('?')[0].split('#')[0];
			const candidates = [
				join(DIST, clean),
				join(DIST, clean, 'index.html'),
				join(DIST, clean.replace(/\/$/, '') + '.html'),
			];
			if (!candidates.some((c) => existsSync(c))) fails.push(`${page}: broken internal link ${href}`);
		}
	}

	// 3. sitemap coverage (skip 404)
	if (page.endsWith('index.html') && !page.includes('404') && sitemapUrls.size > 0) {
		const url = SITE + page.replace(/index\.html$/, '');
		if (!sitemapUrls.has(url)) warns.push(`${page}: not listed in sitemap (${url})`);
	}

	// 5. affiliate density: sponsored links vs H2 count (warn-only lint per SEO policy)
	const sponsored = (html.match(/rel="[^"]*sponsored[^"]*"/g) ?? []).length;
	const h2s = (html.match(/<h2[\s>]/g) ?? []).length;
	if (sponsored > 0 && h2s > 0 && sponsored > h2s + 3) {
		warns.push(`${page}: ${sponsored} sponsored links vs ${h2s} H2 sections — check for CTA stuffing`);
	}
}

// 4. external checks
if (!NO_NETWORK) {
	for (const [url, pages] of externalLinks) {
		try {
			const res = await fetch(url, {
				method: 'GET',
				headers: { 'user-agent': UA, accept: 'text/html' },
				redirect: 'follow',
				signal: AbortSignal.timeout(15000),
			});
			if (res.status === 404 || res.status === 410) {
				fails.push(`external ${url} -> ${res.status} (on ${pages[0]}${pages.length > 1 ? ` +${pages.length - 1}` : ''})`);
			} else if (!res.ok) {
				// Amazon & friends bot-block with 503/captcha — warn, never fail.
				warns.push(`external ${url} -> ${res.status} (bot-block likely; verify manually)`);
			}
		} catch (err) {
			warns.push(`external ${url} -> ${err.name === 'TimeoutError' ? 'timeout' : err.message}`);
		}
	}
}

console.log(`Checked ${htmlFiles.length} pages, ${externalLinks.size} unique external links.`);
if (warns.length) {
	console.log(`\nWARN (${warns.length}):`);
	for (const w of warns) console.log('  - ' + w);
}
if (fails.length) {
	console.log(`\nFAIL (${fails.length}):`);
	for (const f of fails) console.log('  - ' + f);
	process.exit(1);
}
console.log('\nAll link checks passed.');
