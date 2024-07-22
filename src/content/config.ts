import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    // Description for Search engines
    metaDescription: z.string(),
    // Description for Users
    summary: z.string(),
    // Transform string to Date object
    datePublished: z.string().transform((val) => new Date(val)),
    dateModified: z
      .string()
      .optional()
      .transform((val) => (val ? new Date(val) : undefined)),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    published: z.boolean().optional().default(true),
    tags: z.string().transform((val) => val.split(",").map((val) => val.trim()))
  })
});

export const collections = { blog };
