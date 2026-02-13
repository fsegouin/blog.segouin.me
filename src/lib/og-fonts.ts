import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

async function loadFont(path: string): Promise<ArrayBuffer> {
  const buffer = await readFile(resolve(path));
  return new Uint8Array(buffer).buffer as ArrayBuffer;
}

export async function getOgFonts() {
  const [geistSans400, geistSans700, geistMono400] = await Promise.all([
    loadFont(
      "node_modules/@fontsource/geist-sans/files/geist-sans-latin-400-normal.woff"
    ),
    loadFont(
      "node_modules/@fontsource/geist-sans/files/geist-sans-latin-700-normal.woff"
    ),
    loadFont(
      "node_modules/@fontsource/geist-mono/files/geist-mono-latin-400-normal.woff"
    ),
  ]);

  return [
    { name: "Geist Sans", data: geistSans400, weight: 400 as const, style: "normal" as const },
    { name: "Geist Sans", data: geistSans700, weight: 700 as const, style: "normal" as const },
    { name: "Geist Mono", data: geistMono400, weight: 400 as const, style: "normal" as const },
  ];
}
