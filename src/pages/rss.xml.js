import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { siteTitle, siteDescription } from "~/consts";

export async function GET(context) {
  const posts = (await getCollection("blog")).filter(
    (post) => post.data.published
  );
  return rss({
    title: siteTitle,
    summary: siteDescription,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/blog/${post.slug}/`
    }))
  });
}
