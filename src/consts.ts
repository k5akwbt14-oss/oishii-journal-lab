// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'OISHII JOURNAL LAB.';
export const SITE_DESCRIPTION =
	'日本のお菓子・お土産スイーツを実際に食べて、正直にランキング。おみやげ定番からコンビニの名品まで、「これを買えば間違いない」がすぐ分かるガイド。';

/** The three pillars of the home page, in display order: 特集 / ご当地 / 定番 */
export const CATEGORIES = [
	{
		id: 'features',
		num: '1',
		href: '/features',
		title: '特集',
		titleEn: 'FEATURES',
		tagline: '新作が出たら、食べに行く係です。',
		blurb: '限定フレーバーは出会いもの。しっとり半生のクッキーから、ほろ苦く香る抹茶まで、食べた順に正直な感想を並べます。',
	},
	{
		id: 'regional',
		num: '2',
		href: '/regional',
		title: 'ご当地',
		titleEn: 'REGIONAL',
		tagline: '海の向こうから買う前に、読む。',
		blurb: 'パリッと割れる白い恋人、冷蔵だからこそ作りたてのロイズ生チョコ。取り寄せる価値があるか、現地で実食して判定します。',
	},
	{
		id: 'classics',
		num: '3',
		href: '/classics',
		title: '定番',
		titleEn: 'CLASSICS',
		tagline: '日本人が、結局戻ってくるお菓子。',
		blurb: 'パキッと鳴るポッキー、お湯でポテトサラダに化けるじゃがりこ、半生みたいにしっとりのカントリーマアム。殿堂入りを実食ランキングで。',
	},
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

/**
 * Regional picker for the home page.
 * Deliberately a handful of well-known areas rather than all 47 prefectures —
 * US readers navigate by famous city/region names, not by prefecture geography.
 */
export const REGIONS = [
	// known: fact-hook copy (R4 winner 案40). 英訳時の注意: 「琉球」はOkinawaに寄せる。
	{ id: 'hokkaido', name: '北海道', nameEn: 'Hokkaido', emoji: '🐻', known: '冷蔵必須の生チョコ' },
	{ id: 'tokyo', name: '東京', nameEn: 'Tokyo', emoji: '🗼', known: '累計20億個の味' },
	{ id: 'kyoto', name: '京都', nameEn: 'Kyoto', emoji: '⛩️', known: '抹茶菓子の本場' },
	{ id: 'osaka', name: '大阪', nameEn: 'Osaka', emoji: '🐙', known: 'たこ焼き味の街' },
	{ id: 'kyushu', name: '九州', nameEn: 'Kyushu', emoji: '🌋', known: '博多の明太子味' },
	{ id: 'okinawa', name: '沖縄', nameEn: 'Okinawa', emoji: '🌺', known: '琉球うまれの甘さ' },
] as const;

/**
 * The money page (/boxes) + sidebar rail.
 *
 * Links stay '#' until Bokksu (Impact) etc. are approved — see CLAUDE.md
 * "Monetization rules". Deliberately NO prices or item counts here: those must be
 * verified against the live source before publishing, so the page sends readers to
 * the box's own site for numbers rather than quoting figures we haven't checked.
 */
export const SNACK_BOXES = [
	{
		id: 'bokksu',
		name: 'Bokksu',
		badge: '箱',
		rating: 5,
		blurb: '職人がつくる本格派を厳選。日本各地の老舗メーカーから直送。',
		offer: '初回10%OFF',
		href: '#',
		bestFor: '量より質を選ぶ人',
		points: ['日本各地の老舗・小規模メーカーの菓子', '各菓子の背景を紹介する冊子つき', 'お茶とのペアリング前提の構成'],
		catch: '価格帯は高め。まず「日本のお菓子を試したい」だけなら過剰かも。',
	},
	{
		id: 'sakuraco',
		name: 'Sakuraco',
		badge: '桜',
		rating: 4,
		blurb: '和菓子とお茶が毎月届く。伝統的な日本のおやつ時間をそのまま。',
		offer: '初回10%OFF',
		href: '#',
		bestFor: '静かに日本を味わいたい人',
		points: ['もち・羊羹など伝統的な和菓子中心', '毎月お茶が1種類つく', '器などの雑貨が入ることも'],
		catch: 'ポッキーやキットカットのような「コンビニ系」はほぼ入らない。',
	},
	{
		id: 'tokyotreat',
		name: 'TokyoTreat',
		badge: '東',
		rating: 4,
		blurb: 'コンビニ限定・話題のフレーバー中心。日本の「今」が届く。',
		offer: '初回$5OFF',
		href: '#',
		bestFor: '初めての一箱に',
		points: ['期間限定フレーバーや話題の新商品', 'スナック菓子・ドリンクなど量が多い', '日本のコンビニの雰囲気に近い'],
		catch: '伝統的な和菓子を期待すると方向性が違う。',
	},
] as const;

/**
 * Trust block — why read this site. (R4 winner 案36, ② reworked by supervisor:
 * the original「広告文は、書きません」would sit right under the affiliate rail —
 * an FTC-shaped contradiction — so ② keeps the independence claim without it.)
 */
export const WHY_US = [
	{
		icon: 'check',
		title: 'あなたの代わりに、食べています',
		body: '味も食感も、確かめる前には書きません。',
	},
	{
		icon: 'shield',
		title: '評価は、自分の舌で決めます',
		body: '売り手の言葉ではなく実食で。おいしくないものは、おいしくないと書きます。',
	},
	{
		icon: 'gift',
		title: '迷う時間を、短くします',
		body: '値段と日持ちが分かるから、贈り物選びで迷いません。',
	},
] as const;
