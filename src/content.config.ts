import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
	// Load Markdown and MDX files in the `src/content/posts/` directory.
	loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			category: z.enum(['Mining Hardware', 'Pool Reviews', 'Crypto Insights']),
			tags: z.array(z.string()).default([]),
			author: z.string().default('MinerPool Editor'),
			draft: z.boolean().default(false),
			readTime: z.string(),
		}),
});

export const collections = { posts };
