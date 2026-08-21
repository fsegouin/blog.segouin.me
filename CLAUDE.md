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
├── lib/                # utils.ts (cn, formatDate, readingTime), posts.ts, og-fonts.ts, og-template.ts
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

## Writing Rules

These apply to everything under `src/content/blog/`. The prose there is the
author's own voice, not generated copy.

### Never introduce em-dashes

**Do not add `—` (em-dash, U+2014) to a blog post.** Not when drafting, not
when editing, not when rewriting or tightening an existing sentence. It is the
single clearest tell of LLM-written prose and the author does not use it.

Use instead, in rough order of preference:

- a full stop, splitting the sentence in two
- a comma, for a light aside
- parentheses, for a genuine aside
- a colon, when the second half explains the first

```
Bad:   My dad lent me his Nikon D70 — I don't think he was still using it —
       and I took photos with it now and then.
Good:  My dad lent me his Nikon D70. I don't think he was still using it. I
       took photos with it now and then.
Good:  My dad lent me his Nikon D70 (I don't think he was still using it),
       and I took photos with it now and then.
```

This rule is about the em-dash specifically, in any use, not only as
punctuation between clauses. Every other dash is fine and needs no
justification: the plain hyphen `-` (`point-and-shoot`, `well-known`,
`2009-2015`) and the en-dash `–` are both allowed anywhere. Do not "fix" them.

If the author has written an em-dash themselves, leave it alone unless they
ask you to change it. This rule forbids _introducing_ em-dashes and forbids
unrequested rewriting; it does not block an explicit request to remove
existing ones.

To check before handing back an edit:

```bash
grep -n '—' src/content/blog/*/index.md*
```

### Don't touch prose that wasn't asked about

Editing a post means doing what was asked. Do not silently "improve" wording,
tighten sentences, or fix the author's grammar in passages outside the request.

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
