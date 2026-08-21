import type { APIRoute } from "astro";
import satori from "satori";
import sharp from "sharp";
import { SITE } from "@consts";
import { getOgFonts } from "@lib/og-fonts";
import { getOgTemplate } from "@lib/og-template";

// The site-level social card, used by every page that has no card of its own:
// the homepage, /tags, each tag page and /404. Posts pass their own
// /og/<slug>.png instead. Static route, so it wins over [...slug].png.ts.
export const GET: APIRoute = async () => {
  const fonts = await getOgFonts();
  // The template already prints the site name as the wordmark, so the
  // headline carries the tagline rather than repeating the domain.
  const template = getOgTemplate(SITE.DESCRIPTION, "");

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
