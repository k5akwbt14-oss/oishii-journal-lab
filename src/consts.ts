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
		tagline: '季節もの・ギフト・スナックBOXの徹底比較。',
		blurb: '限定フレーバー、贈り物選び、定期便レビュー。テーマごとに掘り下げた読み物。',
	},
	{
		id: 'regional',
		num: '2',
		href: '/regional',
		title: 'ご当地',
		titleEn: 'REGIONAL',
		tagline: 'その土地でしか買えない、お土産の名品。',
		blurb: '東京バナナから白い恋人まで。どこで買えて、いくらで、日本のどこの味なのかまで分かるガイド。',
	},
	{
		id: 'classics',
		num: '3',
		href: '/classics',
		title: '定番',
		titleEn: 'CLASSICS',
		tagline: '日本人なら誰でも知っている、いつものお菓子。',
		blurb: 'ポッキー、じゃがりこ、カントリーマアム。まず一度は食べておきたい殿堂入りを、実食ランキングで。',
	},
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

/**
 * Regional picker for the home page.
 * Deliberately a handful of well-known areas rather than all 47 prefectures —
 * US readers navigate by famous city/region names, not by prefecture geography.
 */
export const REGIONS = [
	{ id: 'hokkaido', name: '北海道', nameEn: 'Hokkaido', emoji: '🐻', known: '白い恋人・ロイズ' },
	{ id: 'tokyo', name: '東京', nameEn: 'Tokyo', emoji: '🗼', known: '東京バナナ' },
	{ id: 'kyoto', name: '京都', nameEn: 'Kyoto', emoji: '⛩️', known: '抹茶・八ツ橋' },
	{ id: 'osaka', name: '大阪', nameEn: 'Osaka', emoji: '🐙', known: 'たこ焼き味' },
	{ id: 'kyushu', name: '九州', nameEn: 'Kyushu', emoji: '🌋', known: '博多・明太子' },
	{ id: 'okinawa', name: '沖縄', nameEn: 'Okinawa', emoji: '🌺', known: '紅いも・ちんすこう' },
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
		bestFor: '本物志向の人・ギフト',
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
		bestFor: '和菓子・お茶が好きな人',
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
		bestFor: '初めての人・家族や子ども',
		points: ['期間限定フレーバーや話題の新商品', 'スナック菓子・ドリンクなど量が多い', '日本のコンビニの雰囲気に近い'],
		catch: '伝統的な和菓子を期待すると方向性が違う。',
	},
] as const;

/** Trust block — why read this site. */
export const WHY_US = [
	{
		icon: 'check',
		title: '全部、実際に食べています',
		body: '味も食感も自分たちで確かめてから書いています。',
	},
	{
		icon: 'shield',
		title: '正直なランキング',
		body: 'おいしくないものは、おいしくないと書きます。',
	},
	{
		icon: 'gift',
		title: 'ギフトにも強い',
		body: '値段・日持ち・買える場所まで分かるので、贈り物選びに迷いません。',
	},
] as const;
