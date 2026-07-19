/**
 * Prefecture-level omiyage data for the /regional explorer.
 *
 * Link kinds (the explorer renders a distinct badge for each — a card must
 * never surprise the reader about where it goes):
 *  - article:   we ate it; deep-link to the taste-tested section.
 *  - amazon:    orderable in the US; tagged search link (search terms chosen
 *               to return relevant listings — if a term rots, fix it here).
 *  - japanOnly: honest "you have to go" items; the card routes to /boxes,
 *               since subscription boxes sometimes carry regional-limiteds.
 *
 * Copy rules: EN copy locks apply (no "Ryukyu"/"Hakata" chip words, no hype
 * adjectives, glosses for unknown items inside the hook).
 */

export type OmiyageLink =
	| { kind: 'article'; href: string }
	| { kind: 'amazon'; q: string }
	| { kind: 'japanOnly' };

export interface Omiyage {
	name: string;
	hook: string;
	link: OmiyageLink;
}

export interface Prefecture {
	id: string;
	name: string;
	ja: string;
	items: Omiyage[];
}

export interface RegionBlock {
	id: string;
	name: string;
	ja: string;
	/** Famous-name subtitle — US readers navigate by these, not by geography. */
	anchor: string;
	prefs: Prefecture[];
}

const article = (href: string): OmiyageLink => ({ kind: 'article', href });
const amazon = (q: string): OmiyageLink => ({ kind: 'amazon', q });
const japanOnly: OmiyageLink = { kind: 'japanOnly' };

export const OMIYAGE_BLOCKS: RegionBlock[] = [
	{
		id: 'hokkaido',
		name: 'Hokkaido',
		ja: '北海道',
		anchor: 'Sapporo, the dairy north',
		prefs: [
			{
				id: 'hokkaido-pref',
				name: 'Hokkaido',
				ja: '北海道',
				items: [
					{ name: 'Shiroi Koibito', hook: "Japan's most-gifted cookie: white chocolate between butter wafers", link: article('/blog/hokkaido-snacks/#1-shiroi-koibito-the-white-chocolate-legend') },
					{ name: "Royce' Nama Chocolate", hook: 'Ganache so fresh it ships with cold packs', link: article('/blog/hokkaido-snacks/#2-royce-nama-chocolate-the-one-that-needs-a-fridge') },
					{ name: "Royce' Potato Chip Chocolate", hook: 'Salted chips half-dipped in milk chocolate', link: article('/blog/hokkaido-snacks/#3-royce-potato-chip-chocolate') },
					{ name: 'Jaga Pokkuru', hook: 'The potato sticks that sell out at the airport', link: article('/blog/hokkaido-snacks/#4-jaga-pokkuru-the-potato-sticks-with-a-cult') },
					{ name: 'Yubari melon candy', hook: 'A $45,000 melon, rendered into $3 candy', link: article('/blog/hokkaido-snacks/#5-yubari-melon-candy-a-45000-melon-for-3') },
					{ name: 'Marusei Butter Sand', hook: 'Butter cream and rum raisins in a biscuit — too fresh to export', link: japanOnly },
				],
			},
		],
	},
	{
		id: 'tohoku',
		name: 'Tohoku',
		ja: '東北',
		anchor: 'Sendai & the apple north',
		prefs: [
			{
				id: 'aomori',
				name: 'Aomori',
				ja: '青森',
				items: [
					{ name: 'Whole-apple pie', hook: 'An entire syrup-soaked apple, baked inside a pie', link: japanOnly },
					{ name: 'Aomori apple juice', hook: "Straight-pressed juice from Japan's apple capital", link: amazon('aomori apple juice') },
				],
			},
			{
				id: 'iwate',
				name: 'Iwate',
				ja: '岩手',
				items: [
					{ name: 'Kamome no Tamago', hook: 'Seagull-egg cakes: white bean paste in a marbled shell', link: japanOnly },
					{ name: 'Nanbu senbei', hook: 'Rustic wheat crackers studded with peanuts or sesame', link: japanOnly },
				],
			},
			{
				id: 'miyagi',
				name: 'Miyagi',
				ja: '宮城',
				items: [
					{ name: 'Hagi no Tsuki', hook: 'Custard moon cakes Sendai carries home as hand luggage', link: japanOnly },
					{ name: 'Zunda sweets', hook: "Sweet edamame paste — Sendai's bright-green obsession", link: japanOnly },
				],
			},
			{
				id: 'akita',
				name: 'Akita',
				ja: '秋田',
				items: [
					{ name: 'Inaniwa udon', hook: 'Silk-thin noodles, hand-stretched since the 1600s', link: amazon('inaniwa udon') },
				],
			},
			{
				id: 'yamagata',
				name: 'Yamagata',
				ja: '山形',
				items: [
					{ name: 'Cherry jellies', hook: "Sato Nishiki cherries — Japan's luxury fruit — in jelly form", link: japanOnly },
					{ name: 'Milk cake', hook: 'Chewy condensed-milk planks sold as "milk you can eat"', link: japanOnly },
				],
			},
			{
				id: 'fukushima',
				name: 'Fukushima',
				ja: '福島',
				items: [
					{ name: 'Mamador', hook: 'Milky butter-bean cakes the whole prefecture runs on', link: japanOnly },
					{ name: 'Peach jelly', hook: "Fukushima peaches — Japan's juiciest — boxed as jelly", link: japanOnly },
				],
			},
		],
	},
	{
		id: 'kanto',
		name: 'Kanto',
		ja: '関東',
		anchor: 'Tokyo & around',
		prefs: [
			{
				id: 'tokyo',
				name: 'Tokyo',
				ja: '東京',
				items: [
					{ name: 'Tokyo Banana', hook: 'The banana-custard sponge with 2 billion sold', link: article('/blog/tokyo-souvenirs-top3/#1-tokyo-banana-mitsuketa') },
					{ name: 'Sweet Potato Tamago', hook: 'Golden sweet-potato cakes from Tokyo Station', link: article('/blog/tokyo-souvenirs-top3/#2-tokyo-tamago--sweet-potato-tamago') },
					{ name: 'Sugar Butter Tree', hook: 'Toasted cereal biscuits with white-chocolate butter', link: article('/blog/tokyo-souvenirs-top3/#3-sugar-butter-tree') },
					{ name: 'Yoku Moku Cigare', hook: 'Rolled butter cookies with a real US fan base', link: article('/blog/japanese-snacks-americans-love/#4-yoku-moku-cigare') },
				],
			},
			{
				id: 'kanagawa',
				name: 'Kanagawa',
				ja: '神奈川',
				items: [
					{ name: 'Hato Sablé', hook: "Kamakura's dove-shaped butter shortbread, over a century old", link: japanOnly },
				],
			},
			{
				id: 'chiba',
				name: 'Chiba',
				ja: '千葉',
				items: [
					{ name: 'Peanut monaka', hook: "Chiba grows Japan's peanuts; these wafer shells hold peanut jam", link: japanOnly },
				],
			},
			{
				id: 'saitama',
				name: 'Saitama',
				ja: '埼玉',
				items: [
					{ name: 'Soka senbei', hook: 'The grilled rice cracker that set the national standard', link: japanOnly },
				],
			},
			{
				id: 'ibaraki',
				name: 'Ibaraki',
				ja: '茨城',
				items: [
					{ name: 'Hoshi imo', hook: 'Chewy dried sweet-potato slices — no added sugar, oddly addictive', link: amazon('hoshi imo dried sweet potato') },
				],
			},
			{
				id: 'tochigi',
				name: 'Tochigi',
				ja: '栃木',
				items: [
					{ name: 'Lemon milk sweets', hook: 'A retro school-lunch drink reborn as cookies and candy', link: japanOnly },
				],
			},
			{
				id: 'gunma',
				name: 'Gunma',
				ja: '群馬',
				items: [
					{ name: 'Gateau rusks', hook: 'Butter-and-sugar baguette rusks with a national following', link: japanOnly },
				],
			},
		],
	},
	{
		id: 'chubu',
		name: 'Chubu',
		ja: '中部',
		anchor: 'The Japan Alps & snow country',
		prefs: [
			{
				id: 'niigata',
				name: 'Niigata',
				ja: '新潟',
				items: [
					{ name: 'Kaki no tane', hook: "Crescent rice crackers plus peanuts: Japan's bar snack in chief", link: amazon('kaki no tane') },
					{ name: 'Sasa dango', hook: 'Mugwort mochi steamed inside bamboo leaves', link: japanOnly },
				],
			},
			{
				id: 'toyama',
				name: 'Toyama',
				ja: '富山',
				items: [
					{ name: 'Shiroebi senbei', hook: 'Crackers made from the bay\'s translucent "jewel" shrimp', link: japanOnly },
				],
			},
			{
				id: 'ishikawa',
				name: 'Ishikawa',
				ja: '石川',
				items: [
					{ name: 'Gold-leaf sweets', hook: 'Kanazawa gilds its sweets in real gold leaf', link: japanOnly },
				],
			},
			{
				id: 'fukui',
				name: 'Fukui',
				ja: '福井',
				items: [
					{ name: 'Habutae mochi', hook: 'Mochi named after woven silk, and just as soft', link: japanOnly },
				],
			},
			{
				id: 'yamanashi',
				name: 'Yamanashi',
				ja: '山梨',
				items: [
					{ name: 'Shingen mochi', hook: 'Kinako mochi you drown in brown-sugar syrup — a cult classic', link: amazon('shingen mochi') },
				],
			},
			{
				id: 'nagano',
				name: 'Nagano',
				ja: '長野',
				items: [
					{ name: 'Obuse chestnut sweets', hook: 'A town that has cooked chestnuts since the shoguns', link: japanOnly },
				],
			},
		],
	},
	{
		id: 'tokai',
		name: 'Tokai',
		ja: '東海',
		anchor: 'Nagoya & Mt. Fuji country',
		prefs: [
			{
				id: 'aichi',
				name: 'Aichi',
				ja: '愛知',
				items: [
					{ name: 'Ebi senbei', hook: "Nagoya's shrimp crackers — the gift-box kind", link: japanOnly },
					{ name: 'Uiro', hook: 'Steamed rice cake, softer than mochi, older than Tokyo', link: japanOnly },
				],
			},
			{
				id: 'gifu',
				name: 'Gifu',
				ja: '岐阜',
				items: [
					{ name: 'Kuri kinton', hook: "Nakatsugawa's chestnut-and-sugar autumn ritual", link: japanOnly },
				],
			},
			{
				id: 'mie',
				name: 'Mie',
				ja: '三重',
				items: [
					{ name: 'Akafuku', hook: 'Mochi under sweet bean paste, made since 1707 — eat it same-day', link: japanOnly },
				],
			},
			{
				id: 'shizuoka',
				name: 'Shizuoka',
				ja: '静岡',
				items: [
					{ name: 'Unagi Pie', hook: 'The "midnight snack" butter pastry (tastes like butter, not eel)', link: amazon('unagi pie') },
					{ name: 'Shizuoka green tea', hook: 'The prefecture that grows most of Japan\'s tea', link: amazon('shizuoka green tea') },
				],
			},
		],
	},
	{
		id: 'kansai',
		name: 'Kansai',
		ja: '関西',
		anchor: 'Kyoto, Osaka & Kobe',
		prefs: [
			{
				id: 'kyoto',
				name: 'Kyoto',
				ja: '京都',
				items: [
					{ name: 'Uji matcha Kit Kat', hook: 'Where the matcha flavor craze started', link: article('/blog/kyoto-snacks/#1-the-matcha-kit-kat-where-the-flavor-craze-started') },
					{ name: 'Yatsuhashi', hook: 'Cinnamon rice-flour sweets, crisp or soft', link: article('/blog/kyoto-snacks/#2-yatsuhashi-cinnamon-the-kyoto-way') },
					{ name: 'Konpeito', hook: 'Tiny sugar stars, tumbled for days per batch', link: article('/blog/kyoto-snacks/#3-konpeito-tiny-sugar-stars-from-the-old-capital') },
					{ name: 'Uji matcha powder', hook: 'The real thing, from centuries-old tea merchants', link: article('/blog/kyoto-snacks/#4-uji-matcha-powder-the-real-thing') },
					{ name: 'Hojicha sweets', hook: "Roasted green tea — matcha's toasty sibling", link: article('/blog/kyoto-snacks/#5-hojicha-sweets-the-toasty-sibling') },
					{ name: 'Cha no Ka', hook: 'Matcha butter cookies, stubbornly hard to find stateside', link: japanOnly },
				],
			},
			{
				id: 'osaka',
				name: 'Osaka',
				ja: '大阪',
				items: [
					{ name: 'Takoyaki-flavor snacks', hook: "Osaka's street-food sauce in shelf-stable form", link: article('/blog/osaka-snacks/#1-takoyaki-flavor-snacks-the-sauce-is-the-point') },
					{ name: 'Pocky', hook: 'Yes — Pocky is from Osaka', link: article('/blog/osaka-snacks/#2-pocky-yes-pocky-is-from-osaka') },
					{ name: 'Pretz', hook: 'The savory stick for people who skip dessert', link: article('/blog/osaka-snacks/#3-pretz-the-savory-sibling') },
					{ name: 'Cream Collon', hook: 'Crunchy waffle rolls with a cool cream center', link: article('/blog/osaka-snacks/#4-cream-collon-the-third-glico-on-this-list') },
					{ name: 'Chicken Ramen', hook: 'The original instant ramen, invented in an Osaka shed', link: article('/blog/osaka-snacks/#5-chicken-ramen-instant-noodles-started-in-an-osaka-shed') },
					{ name: '551 Horai pork buns', hook: 'What every train out of Osaka smells like — fresh only', link: japanOnly },
				],
			},
			{
				id: 'hyogo',
				name: 'Hyogo',
				ja: '兵庫',
				items: [
					{ name: 'Kobe pudding', hook: "Silky custard from Japan's most cosmopolitan port", link: japanOnly },
					{ name: 'Carbonated senbei', hook: 'Arima onsen wafers baked with soda-spring water', link: japanOnly },
				],
			},
			{
				id: 'nara',
				name: 'Nara',
				ja: '奈良',
				items: [
					{ name: 'Kuzu sweets', hook: "Translucent arrowroot sweets from Yoshino's old mills", link: japanOnly },
				],
			},
			{
				id: 'wakayama',
				name: 'Wakayama',
				ja: '和歌山',
				items: [
					{ name: 'Ume candy', hook: "Salty-sour plum candy — Wakayama grows Japan's best ume", link: amazon('umeboshi candy') },
				],
			},
			{
				id: 'shiga',
				name: 'Shiga',
				ja: '滋賀',
				items: [
					{ name: 'Baumkuchen', hook: 'The ring cake people cross the country to buy fresh', link: japanOnly },
				],
			},
		],
	},
	{
		id: 'chugoku',
		name: 'Chugoku',
		ja: '中国',
		anchor: 'Hiroshima & the inland sea',
		prefs: [
			{
				id: 'hiroshima',
				name: 'Hiroshima',
				ja: '広島',
				items: [
					{ name: 'Momiji manju', hook: 'Maple-leaf cakes from Miyajima island — start with red bean', link: amazon('momiji manju') },
					{ name: 'Setouchi lemon sweets', hook: 'Island-grown lemons in cakes, cookies, and gummies', link: japanOnly },
				],
			},
			{
				id: 'okayama',
				name: 'Okayama',
				ja: '岡山',
				items: [
					{ name: 'Kibi dango', hook: 'The dumpling Momotaro used to recruit his demon-fighting crew', link: amazon('kibi dango') },
				],
			},
			{
				id: 'tottori',
				name: 'Tottori',
				ja: '鳥取',
				items: [
					{ name: 'Pear sweets', hook: 'Crisp, fragrant twentieth-century pears as jelly and candy', link: japanOnly },
				],
			},
			{
				id: 'shimane',
				name: 'Shimane',
				ja: '島根',
				items: [
					{ name: 'Zenzai sweets', hook: 'Izumo claims the birthplace of red-bean dessert soup', link: japanOnly },
				],
			},
			{
				id: 'yamaguchi',
				name: 'Yamaguchi',
				ja: '山口',
				items: [
					{ name: 'Fugu senbei', hook: 'Pufferfish crackers — the thrill without the risk', link: japanOnly },
				],
			},
		],
	},
	{
		id: 'shikoku',
		name: 'Shikoku',
		ja: '四国',
		anchor: 'Udon country & citrus islands',
		prefs: [
			{
				id: 'kagawa',
				name: 'Kagawa',
				ja: '香川',
				items: [
					{ name: 'Sanuki udon', hook: "Japan's udon capital ships its bouncy noodles dry", link: amazon('sanuki udon') },
				],
			},
			{
				id: 'ehime',
				name: 'Ehime',
				ja: '愛媛',
				items: [
					{ name: 'Mikan sweets', hook: 'One prefecture, a dozen citrus varieties, endless juice and jelly', link: japanOnly },
				],
			},
			{
				id: 'tokushima',
				name: 'Tokushima',
				ja: '徳島',
				items: [
					{ name: 'Sudachi candy', hook: 'A lime-like citrus so local even Tokyo rarely sees it', link: japanOnly },
				],
			},
			{
				id: 'kochi',
				name: 'Kochi',
				ja: '高知',
				items: [
					{ name: 'Imo kenpi', hook: 'Candied sweet-potato matchsticks — one bag is never enough', link: japanOnly },
				],
			},
		],
	},
	{
		id: 'kyushu',
		name: 'Kyushu',
		ja: '九州',
		anchor: 'Fukuoka, Nagasaki & the south',
		prefs: [
			{
				id: 'fukuoka',
				name: 'Fukuoka',
				ja: '福岡',
				items: [
					{ name: 'Mentaiko snacks', hook: 'The spicy cod-roe flavor Japan swears by', link: article('/blog/kyushu-snacks/#2-mentaiko-snacks-the-spicy-flavor-japan-swears-by') },
					{ name: 'Tonkotsu ramen kits', hook: "Fukuoka's pork-bone broth, boxed by its cult shops", link: article('/blog/kyushu-snacks/#4-tonkotsu-ramen-kits-fukuoka-in-a-box') },
					{ name: 'Hiyoko', hook: 'The chick-shaped bean bun Tokyo keeps taking credit for', link: japanOnly },
					{ name: 'Amaou strawberry sweets', hook: 'A strawberry bred to be "sweet, round, big, delicious"', link: japanOnly },
				],
			},
			{
				id: 'saga',
				name: 'Saga',
				ja: '佐賀',
				items: [
					{ name: 'Marubolo', hook: 'Round honey biscuits with Portuguese roots', link: japanOnly },
				],
			},
			{
				id: 'nagasaki',
				name: 'Nagasaki',
				ja: '長崎',
				items: [
					{ name: 'Castella', hook: 'The honey sponge cake that sailed in 400 years ago', link: article('/blog/kyushu-snacks/#1-castella-the-sponge-cake-that-sailed-in') },
				],
			},
			{
				id: 'kumamoto',
				name: 'Kumamoto',
				ja: '熊本',
				items: [
					{ name: 'Ikinari dango', hook: 'A steamed dumpling hiding sweet potato and bean paste', link: japanOnly },
				],
			},
			{
				id: 'oita',
				name: 'Oita',
				ja: '大分',
				items: [
					{ name: 'Kabosu candy', hook: "Oita's sharp green citrus, tamed into candy", link: japanOnly },
				],
			},
			{
				id: 'miyazaki',
				name: 'Miyazaki',
				ja: '宮崎',
				items: [
					{ name: 'Mango sweets', hook: 'Luxury "Egg of the Sun" mangoes, gummied for the rest of us', link: amazon('japanese mango gummy') },
				],
			},
			{
				id: 'kagoshima',
				name: 'Kagoshima',
				ja: '鹿児島',
				items: [
					{ name: 'Botan Rice Candy', hook: 'The rice-paper candy Americans grew up on — born here', link: article('/blog/kyushu-snacks/#3-botan-rice-candy-the-one-you-already-know') },
					{ name: 'Karukan', hook: 'Cloud-soft steamed yam cake from the samurai era', link: japanOnly },
				],
			},
		],
	},
	{
		id: 'okinawa',
		name: 'Okinawa',
		ja: '沖縄',
		anchor: 'The tropical islands',
		prefs: [
			{
				id: 'okinawa-pref',
				name: 'Okinawa',
				ja: '沖縄',
				items: [
					{ name: 'Chinsuko', hook: 'Crumbly shortbread from a royal court — try the sea-salt one', link: article('/blog/okinawa-snacks/#1-chinsuko-shortbread-from-a-royal-court') },
					{ name: 'Kokuto brown sugar', hook: 'Unrefined cane sugar you eat straight, like candy', link: article('/blog/okinawa-snacks/#2-kokuto-brown-sugar-you-eat-like-candy') },
					{ name: 'Beni-imo tarts', hook: 'Purple sweet-potato tarts — the color is the vegetable', link: article('/blog/okinawa-snacks/#3-beni-imo-sweets-purple-on-purpose') },
					{ name: 'Shikuwasa candy', hook: "The islands' tiny, aggressively tart green citrus", link: article('/blog/okinawa-snacks/#4-shikuwasa-candy-the-tiny-green-citrus') },
					{ name: 'Sata andagi mix', hook: "Fry the islands' crackle-top doughnuts at home", link: article('/blog/okinawa-snacks/#5-sata-andagi-the-islands-doughnut') },
				],
			},
		],
	},
];

/** Old anchor ids (map, home chips, external links) → explorer targets. */
export const REGION_ALIASES: Record<string, string> = {
	hokkaido: 'hokkaido',
	tohoku: 'tohoku',
	kanto: 'kanto',
	tokyo: 'tokyo',
	chubu: 'chubu',
	tokai: 'tokai',
	kansai: 'kansai',
	kyoto: 'kyoto',
	osaka: 'osaka',
	chugoku: 'chugoku',
	shikoku: 'shikoku',
	kyushu: 'kyushu',
	okinawa: 'okinawa',
};

export const AMAZON_TAG = 'oishiijournal-20';
export const amazonSearchUrl = (q: string) =>
	`https://www.amazon.com/s?k=${encodeURIComponent(q)}&tag=${AMAZON_TAG}`;
