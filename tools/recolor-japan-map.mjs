// Deterministic recolor of the operator-supplied Japan map to the site palette.
// Cell-based: flood-fills each prefecture cell (separated by drawn outlines),
// assigns a region by cell centroid, so recolor boundaries always follow the
// artwork's own lines. Shapes stay pixel-exact.
import sharp from 'sharp';

const SRC = 'C:/Users/s2230/OneDrive - 静岡県立大学 食品栄養科学部/デスクトップ/アフィリエイト/記事参考/26年7月/東京お見上げお菓子3選/使用画像/日本地図透かし文字無し.png';
const OUT = process.argv[2];

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

const entries = [
	{ c: [240, 240, 240], k: 'bg' },
	{ c: [224, 240, 240], k: 'bg' },
	{ c: [8, 112, 140], k: 'line' },
	{ c: [60, 150, 160], k: 'line' },
	{ c: [128, 180, 195], k: 'bgAA' },
	{ c: [144, 192, 192], k: 'A' },
	{ c: [128, 200, 160], k: 'A' },
	{ c: [112, 208, 160], k: 'A' },
	{ c: [128, 192, 160], k: 'A' },
	{ c: [136, 208, 96], k: 'B' },
	{ c: [144, 224, 96], k: 'B' },
	{ c: [168, 208, 80], k: 'B' },
	{ c: [208, 224, 88], k: 'C' },
	{ c: [208, 208, 64], k: 'C' },
];

const COCOA = hex('#7c5c49');
const CREAM = hex('#fffdf8');
const MIX = COCOA.map((v, i) => Math.round((v + CREAM[i]) / 2));
const ACT = { A: hex('#f8d5c4'), B: hex('#fce4d8'), C: hex('#fdeee8') };
const SOON = { A: hex('#e2d8c3'), B: hex('#eae2d1'), C: hex('#f0eadf') };

const ACTIVE = new Set(['hokkaido', 'okinawa', 'kyushu', 'kansai', 'kanto']);
function region(x, y) {
	if (y < 290) return 'hokkaido';
	if (x < 88 && y > 815) return 'okinawa';
	if (x < 225 && y > 620) return 'kyushu';
	if (x >= 225 && x < 470 && y > 750) return 'shikoku';
	if (x >= 260 && x < 497 && y > 615 && y < 748) return 'chugoku';
	if (x < 650 && y > 615) return 'kansai';
	if (x > 765 && y < 572) return 'tohoku';
	if (x > 742 && y >= 572) return 'kanto';
	return 'chubu';
}

const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, CH = info.channels;
const cls = new Uint8Array(W * H); // 0 bg, 1 line, 2 bgAA, 3 A, 4 B, 5 C
const KMAP = { bg: 0, line: 1, bgAA: 2, A: 3, B: 4, C: 5 };
for (let p = 0; p < W * H; p++) {
	const i = p * CH;
	const r = data[i], g = data[i + 1], b = data[i + 2];
	let best = null, bd = Infinity;
	for (const e of entries) {
		const d = (r - e.c[0]) ** 2 + (g - e.c[1]) ** 2 + (b - e.c[2]) ** 2;
		if (d < bd) { bd = d; best = e; }
	}
	cls[p] = KMAP[best.k];
}

// flood-fill land cells (cls>=3), 4-connectivity
const comp = new Int32Array(W * H).fill(-1);
const comps = [];
const stack = new Int32Array(W * H);
for (let p = 0; p < W * H; p++) {
	if (cls[p] < 3 || comp[p] !== -1) continue;
	const id = comps.length;
	const c = { n: 0, sx: 0, sy: 0, shade: [0, 0, 0], px: [] };
	comps.push(c);
	let sp = 0;
	stack[sp++] = p;
	comp[p] = id;
	while (sp) {
		const q = stack[--sp];
		const x = q % W, y = (q / W) | 0;
		c.n++; c.sx += x; c.sy += y; c.shade[cls[q] - 3]++; c.px.push(q);
		const nb = [x > 0 ? q - 1 : -1, x < W - 1 ? q + 1 : -1, q - W, q + W];
		for (const r2 of nb) {
			if (r2 >= 0 && r2 < W * H && cls[r2] >= 3 && comp[r2] === -1) {
				comp[r2] = id;
				stack[sp++] = r2;
			}
		}
	}
}

const out = Buffer.alloc(W * H * 3);
const put = (p, col) => { const o = p * 3; out[o] = col[0]; out[o + 1] = col[1]; out[o + 2] = col[2]; };
for (let p = 0; p < W * H; p++) {
	if (cls[p] === 0) put(p, CREAM);
	else if (cls[p] === 1) put(p, COCOA);
	else if (cls[p] === 2) put(p, MIX);
}
for (const c of comps) {
	const cx = c.sx / c.n, cy = c.sy / c.n;
	const reg = region(cx, cy);
	const pal = ACTIVE.has(reg) ? ACT : SOON;
	const shadeIdx = c.shade.indexOf(Math.max(...c.shade));
	const col = pal[['A', 'B', 'C'][shadeIdx]];
	for (const p of c.px) put(p, col);
}
await sharp(out, { raw: { width: W, height: H, channels: 3 } }).png().toFile(OUT);
console.log('written', OUT, 'cells:', comps.length);
