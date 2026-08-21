import { type CollectionEntry, getCollection } from "astro:content";

/**
 * All non-draft blog posts, newest first.
 *
 * Lives in a module (rather than page frontmatter) because Astro extracts
 * `getStaticPaths` into a standalone prerender chunk at build time: only
 * imported bindings are carried across, so a helper declared inline in the
 * frontmatter is undefined by the time `getStaticPaths` runs.
 */
export async function getPublishedPosts(): Promise<CollectionEntry<"blog">[]> {
  return (await getCollection("blog"))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
