import type { APIRoute, GetStaticPaths } from "astro";
import satori from "satori";
import sharp from "sharp";
import { getOgFonts } from "@lib/og-fonts";
import { getOgTemplate } from "@lib/og-template";
import { getPublishedPosts } from "@lib/posts";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({
    params: { slug: post.data.slug },
    props: post,
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { data } = props;
  const fonts = await getOgFonts();
  const template = getOgTemplate(data.title, data.description, data.tags ?? []);

  const svg = await satori(template as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts,
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
