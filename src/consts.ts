// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'OISHII JOURNAL LAB.';
export const SITE_DESCRIPTION =
	"Japanese snacks and souvenir sweets — actually eaten, honestly ranked. From classic souvenirs to convenience-store gems, see at a glance which ones you can't go wrong with.";

/** The three pillars of the home page, in display order: Features / Regional / Classics */
export const CATEGORIES = [
	{
		id: 'features',
		num: '1',
		href: '/features',
		title: 'Features',
		titleJa: '特集',
		tagline: "Eating every new release — that's our department.",
		blurb: 'Limited flavors don’t wait around. From soft-baked cookies to gently bitter matcha, we post honest notes in the order we ate them.',
	},
	{
		id: 'regional',
		num: '2',
		href: '/regional',
		title: 'Regional',
		titleJa: 'ご当地',
		tagline: 'Worth shipping across the Pacific? We checked.',
		blurb: 'Shiroi Koibito cookies (white-chocolate sandwich wafers) that snap clean in half. Royce’ Nama Chocolate so fresh it ships refrigerated. We eat them where they’re made, then tell you which ones are worth ordering.',
	},
	{
		id: 'classics',
		num: '3',
		href: '/classics',
		title: 'Classics',
		titleJa: '定番',
		tagline: 'The snacks Japan keeps coming back to.',
		blurb: 'Pocky with its clean snap, Jagariko potato sticks that turn into potato salad with hot water, Country Maam cookies baked soft in the middle. The hall of fame, taste-tested and ranked.',
	},
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

/**
 * Regional picker for the home page.
 * Deliberately a handful of well-known areas rather than all 47 prefectures —
 * US readers navigate by famous city/region names, not by prefecture geography.
 */
export const REGIONS = [
	// known: fact-hook copy (EN loop, panel-voted). Rule: no "Ryukyu", no "roe", no "Hakata".
	{ id: 'hokkaido', name: 'Hokkaido', nameJa: '北海道', emoji: '🐻', known: 'Chocolate so fresh it needs a fridge' },
	{ id: 'tokyo', name: 'Tokyo', nameJa: '東京', emoji: '🗼', known: 'Tokyo Banana: 2 billion sold' },
	{ id: 'kyoto', name: 'Kyoto', nameJa: '京都', emoji: '⛩️', known: 'Matcha’s home turf' },
	{ id: 'osaka', name: 'Osaka', nameJa: '大阪', emoji: '🐙', known: 'Takoyaki flavor — trust the octopus' },
	{ id: 'kyushu', name: 'Kyushu', nameJa: '九州', emoji: '🌋', known: 'The spicy flavor Japan swears by' },
	{ id: 'okinawa', name: 'Okinawa', nameJa: '沖縄', emoji: '🌺', known: 'Brown-sugar island sweets' },
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
		blurb: 'Artisan sweets from Japan’s small family-run makers, shipped direct.',
		offer: '10% off your first box',
		href: '#',
		bestFor: 'Quality over quantity',
		points: [
			'Sweets from small family-run makers across Japan',
			'Comes with a booklet on the story behind each sweet',
			'Built to be paired with tea',
		],
		catch: 'On the pricey side. If you just want to try Japanese snacks, it may be more box than you need.',
	},
	{
		id: 'sakuraco',
		name: 'Sakuraco',
		badge: '桜',
		rating: 4,
		blurb: 'Traditional Japanese sweets and tea, every month — a real Japanese teatime, boxed.',
		offer: '10% off your first box',
		href: '#',
		bestFor: 'A quieter taste of Japan',
		points: [
			'Mostly traditional sweets: mochi (soft rice cakes), yokan (a dense red-bean jelly)',
			'One Japanese tea included each month',
			'Sometimes includes a small piece of tableware',
		],
		catch: 'Almost none of the convenience-store hits like Pocky or Japanese Kit Kats.',
	},
	{
		id: 'tokyotreat',
		name: 'TokyoTreat',
		badge: '東',
		rating: 4,
		blurb: 'Convenience-store exclusives and the flavors everyone’s talking about. What Japan is eating right now, delivered.',
		offer: '$5 off your first box',
		href: '#',
		bestFor: 'Your first box',
		points: [
			'Limited-run flavors and trending new releases',
			'A lot of it: snacks, candy, drinks',
			'The closest thing to a Japanese convenience-store run',
		],
		catch: 'If you’re hoping for traditional Japanese sweets, this is the wrong aisle.',
	},
] as const;

/**
 * Trust block — why read this site. (EN copy panel-scored; card 2 body flagged
 * "do not touch" — the おいしくない×2 repetition is the site's most trusted line.)
 */
export const WHY_US = [
	{
		icon: 'check',
		title: 'We do the eating for you',
		body: 'We check taste and texture before we write a word.',
	},
	{
		icon: 'shield',
		title: 'Ratings come from our own taste buds',
		body: 'Not from sales copy — from eating. If something isn’t good, we say it isn’t good.',
	},
	{
		icon: 'gift',
		title: 'Less time second-guessing',
		body: 'Price and shelf life up front — no agonizing over gift picks.',
	},
] as const;
