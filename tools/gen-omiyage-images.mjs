#!/usr/bin/env node
// Batch-generate the omiyage card illustrations for the /regional explorer.
//
// Slugs MUST equal slugify(item.name) from src/data/omiyage.ts — the explorer
// resolves images by that slug and fails the build if one is missing.
//
// Amazon/product photos are deliberately NOT used: the Associates Operating
// Agreement only allows product images via PA-API (locked until 3 sales), and
// box-program creatives arrive with approval. Until then: original,
// trademark-safe illustrations, same policy as the article heroes.
//
// Usage: node --env-file=.env tools/gen-omiyage-images.mjs [--only slug]
// Resumable: existing webp files are skipped.

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import sharp from 'sharp';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('GEMINI_API_KEY missing — run with node --env-file=.env');
  process.exit(1);
}

const MODEL = 'gemini-2.5-flash-image';
const OUT_DIR = 'src/assets/omiyage';
const STYLE_REF = 'src/assets/illust/hokkaido-snacks.webp';
const CONCURRENCY = 3;

const STYLE =
  'Flat illustration in exactly the same warm cozy style, palette and outline weight as the reference image, single subject centered, warm cream background, appetizing. No text, no letters, no numbers, no logos, no brand packaging.';

/** slug -> what to draw */
const MANIFEST = {
  // Hokkaido
  'shiroi-koibito': 'two thin square golden butter cookies sandwiching a layer of white chocolate, one broken in half showing the clean snap, on a small plate',
  'royce-nama-chocolate': 'soft dark chocolate ganache squares dusted with cocoa powder in a neat row, one lifted on a tiny pick',
  'royce-potato-chip-chocolate': 'ridged golden potato chips half-dipped in milk chocolate, fanned out',
  'jaga-pokkuru': 'crispy skin-on potato sticks like tiny french fries standing in a small open carton',
  'yubari-melon-candy': 'a wedge of orange cantaloupe melon beside round orange hard candies and gummies',
  'marusei-butter-sand': 'a biscuit sandwich filled with pale butter cream and rum raisins, cut open to show the filling',
  // Tohoku
  'whole-apple-pie': 'a golden pie cut open revealing a whole glossy syrup-soaked apple baked inside',
  'aomori-apple-juice': 'a glass bottle of cloudy apple juice beside fresh red apples with leaves',
  'kamome-no-tamago': 'small egg-shaped cakes with pale marbled shells, one cut open showing golden bean paste',
  'nanbu-senbei': 'round rustic wheat crackers studded with peanuts and sesame seeds, thin rim around the edge',
  'hagi-no-tsuki': 'round pale yellow sponge cakes, one cut open showing creamy custard, a full moon motif behind',
  'zunda-sweets': 'bright green edamame paste spooned over soft white mochi in a small bowl, edamame pods beside',
  'inaniwa-udon': 'a tied bundle of very thin glossy white udon noodles, a few strands draped elegantly',
  'cherry-jellies': 'translucent dome-shaped jellies each holding one red cherry, cherries with stems beside',
  'milk-cake': 'pale cream-colored chewy condensed-milk candy planks, stacked, with a small milk pitcher',
  'mamador': 'small oval baked cakes, one split showing milky yellow bean filling, steaming cup of coffee behind',
  'peach-jelly': 'glossy peach halves and cups of translucent peach jelly, soft pink tones',
  // Kanto
  'tokyo-banana': 'plump banana-shaped soft sponge cakes with smooth pale-yellow skin, one cut in half showing creamy custard filling — clearly baked cakes on a plate, not real fruit',
  'sweet-potato-tamago': 'smooth golden egg-shaped baked cakes, one cut in half showing bright golden-yellow sweet-potato paste filling',
  'sugar-butter-tree': 'rectangular toasted cereal biscuits sandwiching a white chocolate layer, one leaning to show layers',
  'yoku-moku-cigare': 'thin rolled cigar-shaped butter cookies stacked in a neat pile, one broken',
  'hato-sable': 'dove-shaped flat golden butter shortbread cookies',
  'peanut-monaka': 'peanut-shaped crisp wafer shells, one opened showing peanut jam filling, raw peanuts beside',
  'soka-senbei': 'large round grilled rice crackers with glossy soy-sauce glaze and toasted spots',
  'hoshi-imo': 'chewy amber slices of dried sweet potato, slightly translucent, on rustic paper',
  'lemon-milk-sweets': 'pale yellow cream sandwich cookies and candies beside a retro glass milk bottle with a lemon',
  'gateau-rusks': 'oval baguette-slice rusks glazed with butter and crystal sugar, stacked',
  // Chubu
  'kaki-no-tane': 'small crescent-shaped orange rice crackers mixed with peanuts in a small wooden bowl',
  'sasa-dango': 'green mochi dumplings wrapped in bamboo leaves tied with string, one unwrapped',
  'shiroebi-senbei': 'thin pale pink-white crackers with tiny translucent shrimp visible inside',
  'gold-leaf-sweets': 'an elegant small square of sponge cake topped with a sheet of shimmering gold leaf',
  'habutae-mochi': 'silky flat squares of pure white mochi, soft and glossy, one draped over another',
  'shingen-mochi': 'small mochi cubes dusted with tan kinako flour, dark brown-sugar syrup pouring from a tiny pitcher',
  'obuse-chestnut-sweets': 'glossy candied chestnuts and slices of chestnut yokan on a small plate, fresh chestnuts beside',
  // Tokai
  'ebi-senbei': 'delicate pink shrimp crackers arranged like a gift assortment, a small shrimp illustration motif',
  'uiro': 'pastel steamed rice-cake bars in pink, white and green, sliced cleanly',
  'kuri-kinton': 'soft golden chestnut-paste mounds shaped like little mountain peaks on a dark plate',
  'akafuku': 'oblong mochi covered in smooth dark red-bean paste with raked wave ridges',
  'unagi-pie': 'long thin glazed puff-pastry sticks with flaky layers, fanned on a plate',
  'shizuoka-green-tea': 'a steaming cup of green tea with loose tea leaves and rolling tea fields behind',
  // Kansai
  'uji-matcha-kit-kat': 'flat rectangular matcha-green chocolate bars with breakable finger segments, one snapped showing crisp layered wafers inside, matcha powder dusted nearby',
  'yatsuhashi': 'flat triangular folded soft rice-dough parcels in pale cinnamon color with dark red-bean paste peeking from the fold, beside thin crisp curved roof-tile shaped baked cookies',
  'konpeito': 'a glass jar spilling tiny star-shaped sugar candies in pastel pink, blue and yellow',
  'uji-matcha-powder': 'vivid green matcha powder heaped in a dark bowl with a bamboo whisk',
  'hojicha-sweets': 'amber roasted tea leaves, a creamy hojicha latte and caramel-colored candies',
  'cha-no-ka': 'thin square matcha langue-de-chat cookies sandwiching white chocolate, deep green',
  'takoyaki-flavor-snacks': 'puffed corn snack sticks drizzled with dark sauce and bonito flakes, round takoyaki balls on a tray behind',
  'pocky': 'thin biscuit sticks dipped in chocolate standing in a glass cup',
  'pretz': 'plain golden savory biscuit sticks with herb flecks, bundled',
  'cream-collon': 'small rolled waffle cylinders with white cream centers, one showing the spiral end',
  'chicken-ramen': 'a golden block of instant ramen noodles beside a steaming bowl of noodle soup with a soft egg',
  '551-horai-pork-buns': 'fluffy white steamed pork buns in a round bamboo steamer, one split showing filling',
  'kobe-pudding': 'silky caramel custard pudding in a small glass jar with caramel sauce dripping',
  'carbonated-senbei': 'very thin pale round wafers, delicate and translucent, in a loose stack',
  'kuzu-sweets': 'translucent arrowroot jelly cubes with kinako dust and dark syrup on a leaf-shaped dish',
  'ume-candy': 'red-purple plum hard candies beside fresh ume plums with a leaf',
  'baumkuchen': 'a ring cake with thin visible baked layers, one slice cut out and lying flat',
  // Chugoku
  'momiji-manju': 'maple-leaf shaped small golden cakes, one cut showing red-bean paste, red maple leaves behind',
  'setouchi-lemon-sweets': 'bright lemon cakes and thin lemon cookies with fresh lemons and blossom',
  'kibi-dango': 'small round soft pale millet dumplings on a woven plate, folk-tale pennant motif without letters',
  'pear-sweets': 'a green asian pear beside cups of clear pear jelly and pale candies',
  'zenzai-sweets': 'a bowl of glossy red-bean dessert soup with a toasted mochi floating, steam rising',
  'fugu-senbei': 'round crackers with a cute puffed-up pufferfish shape pressed into them',
  // Shikoku
  'sanuki-udon': 'thick glossy white udon noodles lifted with chopsticks from a bowl',
  'mikan-sweets': 'mandarin oranges, cups of orange jelly and a small juice bottle',
  'sudachi-candy': 'small round green citrus fruits, one halved, beside pale green hard candies',
  'imo-kenpi': 'a pile of golden candied sweet-potato matchsticks with a sugar sheen',
  // Kyushu
  'mentaiko-snacks': 'orange-red spicy roe flavored rice crackers and puffed corn sticks with chili flecks',
  'tonkotsu-ramen-kits': 'a bowl of creamy white pork-broth ramen with thin noodles, pork slices and scallions',
  'hiyoko': 'chick-shaped soft golden bean-paste buns with tiny dot eyes, one facing forward',
  'amaou-strawberry-sweets': 'large glossy red strawberries beside strawberry-filled chocolates, one cut open',
  'marubolo': 'round flat golden honey biscuits with a rustic cracked surface, stacked',
  'castella': 'a tall slice of golden honey sponge cake with dark caramelized top and bottom on a plate',
  'ikinari-dango': 'a steamed dumpling cut open showing a thick sweet-potato slice and red-bean paste',
  'kabosu-candy': 'green kabosu citrus halves beside pale green hard candies',
  'mango-sweets': 'a ripe red-orange mango with cubes cut open, mango gummies beside',
  'botan-rice-candy': 'soft orange candy cubes wrapped in translucent rice paper, one unwrapped',
  'karukan': 'pure white fluffy steamed cake rectangles with a fine crumb, one cut',
  // Okinawa
  'chinsuko': 'crumbly pale shortbread cookie sticks with fluted edges, one broken showing sandy texture',
  'kokuto-brown-sugar': 'rough chunks of dark brown cane sugar on rustic paper with sugarcane stalks behind',
  'beni-imo-tarts': 'boat-shaped tarts filled with vivid purple sweet-potato paste piped in a swirl',
  'shikuwasa-candy': 'tiny green citrus fruits, one halved showing juicy segments, with pale green candies',
  'sata-andagi-mix': 'round golden fried doughnut balls with cracked tops, one split showing cakey inside',
};

const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;

mkdirSync(OUT_DIR, { recursive: true });
const ref = {
  inline_data: { mime_type: 'image/webp', data: readFileSync(STYLE_REF).toString('base64') },
};

async function generate(slug, desc) {
  const out = `${OUT_DIR}/${slug}.webp`;
  if (existsSync(out) && !only) return 'skip';
  const body = {
    contents: [{ role: 'user', parts: [ref, { text: `${STYLE} Subject: ${desc}.` }] }],
  };
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': API_KEY },
          body: JSON.stringify(body),
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const part = (data?.candidates?.[0]?.content?.parts ?? []).find(
        (p) => p.inline_data?.data || p.inlineData?.data,
      );
      if (!part) throw new Error('no image in response');
      const inline = part.inline_data ?? part.inlineData;
      const tmp = `${OUT_DIR}/.${slug}.tmp`;
      writeFileSync(tmp, Buffer.from(inline.data, 'base64'));
      await sharp(tmp).resize(512, 512, { fit: 'cover' }).webp({ quality: 80 }).toFile(out);
      rmSync(tmp);
      return 'ok';
    } catch (err) {
      if (attempt === 3) throw new Error(`${slug}: ${err.message}`);
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
}

const entries = Object.entries(MANIFEST).filter(([slug]) => !only || slug === only);
console.log(`${entries.length} items, concurrency ${CONCURRENCY}`);
let done = 0;
const failures = [];
const queue = [...entries];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const [slug, desc] = queue.shift();
      try {
        const r = await generate(slug, desc);
        console.log(`[${++done}/${entries.length}] ${r} ${slug}`);
      } catch (err) {
        failures.push(slug);
        console.error(`[${++done}/${entries.length}] FAIL ${err.message}`);
      }
    }
  }),
);
console.log(failures.length ? `FAILURES: ${failures.join(', ')}` : 'all done');
process.exit(failures.length ? 1 : 0);
