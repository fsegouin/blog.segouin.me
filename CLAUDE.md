# CLAUDE.md

This file provides context for Claude Code when working on this codebase.

## Project Overview

**blog.segouin.me** is a personal blog for Florent Segouin, built on the Astro Micro theme (a fork of Astro Nano).

**Live site:** https://blog.segouin.me

## Tech Stack

- **Framework:** Astro 7.x (static site generator)
- **Styling:** TailwindCSS 4.x (CSS-first `@theme` config) with typography plugin
- **Content:** MDX for interactive markdown
- **Search:** Pagefind (client-side search)
- **OG images:** Satori + Sharp, generated at build time
- **Language:** TypeScript
- **Hosting:** Vercel (Analytics + Speed Insights)

## Project Structure

```
src/
├── components/         # Reusable Astro components (Header, Footer, ArrowCard, etc.)
├── layouts/            # Page layout templates
├── pages/              # File-based routing
│   ├── index.astro     # Homepage — full post archive grouped by year
│   ├── [...slug].astro # Individual blog posts, served at the site root
│   ├── og/             # Build-time Open Graph images (Satori + Sharp)
│   ├── tags/           # Tag-based filtering
│   ├── rss.xml.js      # RSS feed
│   └── 404.astro       # Not-found page
├── content/
│   └── blog/           # Blog posts (numbered folders with index.mdx)
├── lib/                # utils.ts (cn, formatDate, readingTime), og-fonts.ts, og-template.ts
├── styles/global.css   # Tailwind entry, design tokens, base styles
├── consts.ts           # Site configuration (title, description, social links)
├── types.ts            # TypeScript type definitions
└── content.config.ts   # Content collection schema (Zod validation)

public/                 # Static assets (the Pagefind index is generated into dist/)
```

## Development Commands

```bash
pnpm dev      # Start development server
pnpm build    # Type check + build for production (astro check && astro build)
pnpm preview  # Preview production build
```

## Content Collections

One collection defined in `src/content.config.ts`:

- **blog**: Posts with title, description, date, and slug, plus optional draft status, tags, and toc flag

Content files use numbered folder prefixes for ordering (e.g., `00-hello-world/index.mdx`).

## Key Configuration Files

- `astro.config.mjs` - Astro settings, integrations, Shiki syntax highlighting, `/blog` and `/projects` redirects to `/`
- `src/consts.ts` - Site metadata (SITE, HOME) and social links
- `tsconfig.json` - TypeScript config with `@*` path alias for `./src/*`

## Styling Notes

- Uses Tailwind CSS with `@tailwindcss/typography` for prose content
- Light theme only — no dark mode and no theme toggle (see the palette comment in `src/styles/global.css`)
- Global styles in `src/styles/global.css`
- Class merging utilities: `clsx` + `tailwind-merge` via `cn()` helper

## Adding Content

**New blog post:**

1. Create folder in `src/content/blog/` with numbered prefix (e.g., `01-post-name/`)
2. Add `index.md` or `index.mdx` with frontmatter:
   ```yaml
   ---
   title: "Post Title"
   description: "Post description"
   date: "2026-01-01"
   slug: "post-slug"
   toc: false
   tags:
     - tag1
     - tag2
   ---
   ```

`slug` is required and sets the post's URL — posts are served at the site root
(`/post-slug`), not under `/blog/`. `draft`, `tags`, and `toc` are optional;
`toc` defaults to `true`. Co-locate images in the post folder and import them
through `astro:assets`, marking the first one `loading="eager"` since it is the
LCP element.
