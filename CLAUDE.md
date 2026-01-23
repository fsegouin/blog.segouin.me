# CLAUDE.md

This file provides context for Claude Code when working on this codebase.

## Project Overview

**blog.segouin.me** is a personal blog and portfolio website for Florent Segouin, built on the Astro Micro theme (a fork of Astro Nano).

**Live site:** https://blog.segouin.me

## Tech Stack

- **Framework:** Astro 5.x (static site generator)
- **Styling:** TailwindCSS 4.x with typography plugin
- **Content:** MDX for interactive markdown
- **Search:** Pagefind (client-side search)
- **Comments:** Giscus (GitHub-based)
- **Language:** TypeScript

## Project Structure

```
src/
├── components/       # Reusable Astro components (Header, Footer, ArrowCard, etc.)
├── layouts/          # Page layout templates
├── pages/            # File-based routing
│   ├── blog/         # Blog listing and individual posts
│   ├── projects/     # Projects listing and pages
│   └── tags/         # Tag-based filtering
├── content/          # Markdown/MDX content
│   ├── blog/         # Blog posts (numbered folders with index.mdx)
│   └── projects/     # Project descriptions
├── lib/utils.ts      # Utility functions (cn, formatDate, readingTime)
├── consts.ts         # Site configuration (title, description, social links)
├── types.ts          # TypeScript type definitions
└── content.config.ts # Content collection schemas (Zod validation)

public/               # Static assets (favicon, images, pagefind index)
```

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Type check + build for production
npm run preview  # Preview production build
```

## Content Collections

Two collections defined in `src/content.config.ts`:

- **blog**: Posts with title, description, date, draft status, and tags
- **projects**: Projects with title, description, date, draft status, demo URL, and repo URL

Content files use numbered folder prefixes for ordering (e.g., `00-hello-world/index.mdx`).

## Key Configuration Files

- `astro.config.mjs` - Astro settings, integrations, Shiki syntax highlighting
- `src/consts.ts` - Site metadata, social links, homepage display counts
- `tsconfig.json` - TypeScript config with `@/*` path alias for `./src/*`

## Styling Notes

- Uses Tailwind CSS with `@tailwindcss/typography` for prose content
- Light/dark theme support with system preference detection
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
   date: "2025-01-01"
   draft: false
   tags: ["tag1", "tag2"]
   ---
   ```

**New project:**
1. Create folder in `src/content/projects/`
2. Add `index.md` with frontmatter including `demoURL` and `repoURL`
