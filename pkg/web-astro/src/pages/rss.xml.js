/*
 * SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { siteTitle, siteDescription, authorName } from "~/consts";

export async function GET(context) {
  const posts = (await getCollection("blog")).filter(
    (post) => post.data.published
  );
  return rss({
    title: siteTitle,
    description: siteDescription,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.datePublished,
      author: authorName.join(" "),
      description: post.data.summary,
      link: `/blog/${post.id}/`
    }))
  });
}
