import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    summary: z.string(),
    // Transform string to Date object
    pubDate: z.string().transform((val) => new Date(val)),
    coverImg: z.string().optional(),
    coverAlt: z.string().optional(),
    published: z.boolean().optional().default(true),
    tags: z.string().transform((val) => val.split(",").map((val) => val.trim()))
  })
});

export const collections = { blog };
