# OISHII JOURNAL LAB. — Project Constitution / プロジェクト憲法

This is the my-blog Astro project. Follow the rules below on every task.
（このファイルはこのフォルダで作業するとき毎回自動で読み込まれます。以下のルールを守ること。）

## What this site is / サイトの正体
- **OISHII JOURNAL LAB.** — an affiliate blog introducing Japanese snacks & omiyage (souvenir sweets) to curious **American** readers.
- Monetization: **US Amazon Associates** (account exists) + snack-box subscriptions (**Bokksu** via Impact) + display ads.
- Live at **https://oishiijournal.com** (custom domain on Cloudflare Pages).
- NOTE: `market_research.md` still mentions an old Scandinavian-furniture niche — that pivot is dead. Ignore it; the real niche is Japanese snacks.

## Audience & voice / 読者とトーン
- Readers are **English-speaking Americans** curious about Japanese snacks. All published copy is **in English**.
- The operator (site owner) has **no English writing ability** — I (Claude) draft **all** English copy.
- Keep copy **short, scannable, and benefit-driven**. No fluff, no walls of text.

## Page & content structure / ページ構成のルール
- **Show, don't tell — use lots of images/illustrations and minimize text.** Favor photos, illustrations, Inaripo art, cards, and visual blocks over paragraphs. Every page should be visual-first; cut text wherever an image can carry the meaning.（絵・画像を多用し、文字を減らす。）
- **Every page/article starts with a summary + a table of contents.** Open with a short "what you'll get" summary, then a linked table of contents (jump links to the sections below).（ページの頭に「まとめ」と「目次」を必ず置く。）

## Mascot: Inaripo / マスコット「いなりぽ」
- **Inaripo (いなりぽ)** is the site mascot: a gluttonous ("食いしん坊") little fox, the friendly guide/taster persona.
- Name = *inari* (rice-shrine fox) + *inarizushi*.
- Components: `src/components/Inaripo.astro` (circular avatar; `expression` = happy/wink/surprise/angry/yum) and `src/components/InaripoBubble.astro` (speech bubble for MDX articles).
- Face assets live in `src/assets/inaripo/`. To add expressions, crop from the source model sheets with `sharp` and add to the `faces` map in `Inaripo.astro`.

## Design system / デザイン方針
- Direction: **"American taste"** — warm, punchy, appetizing.
- Accent colors (in `src/styles/global.css`): `--accent: #c8412c` (coral/tomato red), `--accent-dark: #9c3020`, `--accent-bright: #f2704e`, `--accent-tint: #fdeee8`. Background is warm cream. Keep this palette; do not reintroduce the default Astro blue.
- Fonts (configured in `astro.config.mjs`, Google fonts): **Playfair Display** (`--font-heading`) + **Lora** (`--font-body`).
- Logo: circular sticker-style logomark at `src/assets/logo.png`, used round in header and hero.
- Social links in Header/Footer are `#` placeholders until the owner supplies real Instagram/Pinterest URLs.

## Monetization rules / 収益化のルール
- **Affiliate links are placeholders (`href="#"`)** in every article, marked with a `{/* NOTE */}` comment. Do NOT invent real affiliate URLs. Swap them in only after **Amazon Associates** and **Bokksu (Impact)** are approved.
- Use the existing components for any affiliate content:
  - `src/components/AffiliateDisclosure.astro` — FTC disclosure; pass `amazon={true}` to add the required Amazon sentence.
  - `src/components/AffiliateButton.astro` — auto-adds `rel="sponsored noopener"` + `target="_blank"`.
- Product facts (prices, item counts) must be **verified against the live source** (e.g. bokksu.com) — do not trust stale figures. Current articles: `tokyo-souvenirs-top3`, `japanese-snacks-americans-love`, `bokksu-review`, `japanese-snack-box-comparison`.

## Dev commands / 開発コマンド
```
npm run dev       # local dev server
npm run build     # production build — MUST pass before committing
npm run preview   # preview the build
npm run gemini    # ask the external Gemini teammate (tools/ask-gemini.mjs)
```
- Always run `npm run build` and confirm it passes before committing.

## Deploy flow / デプロイ手順
- Hosting: **Cloudflare Pages**, project auto-deploys from GitHub repo `k5akwbt14-oss/oishii-journal-lab`, branch `main`. Build preset Astro (`npm run build` → `dist`), default Node.
- To publish: edit → `git add` / `git commit` / `git push` → Cloudflare rebuilds automatically. Confirm pages return HTTP 200 after deploy.
- Custom domain is `oishiijournal.com`; keep `site` in `astro.config.mjs` in sync if the domain ever changes.

## Working with Gemini / Gemini との連携
- The owner consults an external **Gemini Pro** for ideas, but **I own all implementation** — I cannot access their Gemini account directly (except via `npm run gemini`).
- Treat Gemini output as a suggestion, not truth: it has stale training data and has been wrong on current dates/prices. Verify against live sources and the actual current date.

## Astro reference
- Docs: https://docs.astro.build — consult before routing, content-collection, component, or styling work.
