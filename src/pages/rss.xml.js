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
      link: `/blog/${post.slug}/`
    }))
  });
}
