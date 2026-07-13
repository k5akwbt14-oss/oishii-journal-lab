// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Production custom domain (registered via Cloudflare, connected to the
	// oishii-journal-lab Pages project).
	site: 'https://oishiijournal.com',
	integrations: [mdx(), sitemap()],
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Playfair Display',
			cssVariable: '--font-heading',
			fallbacks: ['serif'],
			weights: [500, 600, 700],
			styles: ['normal', 'italic'],
		},
		{
			provider: fontProviders.google(),
			name: 'Lora',
			cssVariable: '--font-body',
			fallbacks: ['serif'],
			weights: [400, 500, 600],
			styles: ['normal', 'italic'],
		},
	],
});
