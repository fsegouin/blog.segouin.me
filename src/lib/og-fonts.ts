import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

// `resolve()` would guess at the node_modules layout, which pnpm does not
// guarantee; the resolver knows where the package actually is.
const require = createRequire(import.meta.url);

async function loadFont(specifier: string): Promise<ArrayBuffer> {
  const buffer = await readFile(require.resolve(specifier));
  return new Uint8Array(buffer).buffer as ArrayBuffer;
}

// Every OG route needs the same three faces, so read them once and hand
// each later call the same promise.
let fontsPromise: ReturnType<typeof loadOgFonts> | undefined;

export function getOgFonts() {
  fontsPromise ??= loadOgFonts();
  return fontsPromise;
}

async function loadOgFonts() {
  // Satori cannot read woff2, so these are the .woff builds.
  const [lora600, geistSans400, geistMono400] = await Promise.all([
    loadFont("@fontsource/lora/files/lora-latin-600-normal.woff"),
    loadFont("@fontsource/geist-sans/files/geist-sans-latin-400-normal.woff"),
    loadFont("@fontsource/geist-mono/files/geist-mono-latin-400-normal.woff"),
  ]);

  return [
    {
      name: "Lora",
      data: lora600,
      weight: 600 as const,
      style: "normal" as const,
    },
    {
      name: "Geist Sans",
      data: geistSans400,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Geist Mono",
      data: geistMono400,
      weight: 400 as const,
      style: "normal" as const,
    },
  ];
}
