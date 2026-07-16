import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			// Home page pillars: 定番 / ご当地 / 特集
			category: z.enum(['classics', 'regional', 'features']).default('features'),
			// Only for category: 'regional' — matches an id in REGIONS (src/consts.ts).
			region: z.string().optional(),
		}),
});

export const collections = { blog };
