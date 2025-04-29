/*
 * SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    // Description for Search engines
    metaDescription: z.string().optional(),
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
