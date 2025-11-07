// src/content.config.ts
// import { defineCollection, z } from 'astro:content';
// // import { glob } from 'astro/loaders';

// const blog = defineCollection({
//   loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
//   schema: z.object({
//     title: z.string(), // 必需
//     description: z.string().optional(),
//     pubDate: z.coerce.date(), // 必需
//     updatedDate: z.coerce.date().optional(),
//     tags: z.array(z.string()).default([]),
//     draft: z.boolean().default(false),
//   }),
// });

// export const collections = { blog };