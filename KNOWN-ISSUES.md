# Known issues

Findings from a multi-agent audit of the whole project (2026-08-21/22). Nothing
here is scheduled. This exists so the same things are not rediscovered from
scratch next time, and so the ones that were deliberately _not_ fixed are
recorded as decisions rather than oversights.

Each entry says where it is, why it matters, and what the fix looks like.
Severity is about this site specifically: a static personal blog with no auth,
no database, and no user input beyond search.

---

## Accessibility

### Search dialog has no focus trap and no focus restore

`src/components/PageFind.astro`. The container correctly declares
`role="dialog"`, `aria-modal="true"` and an accessible name, and opening it
moves focus to the input. But Tab escapes into the page behind it (which is
only visually covered, not `inert`), and closing never returns focus to
`#magnifying-glass` — focus lands on `<body>` and the reader restarts from the
top of the document. WCAG 2.4.3.

Fix: trap Tab inside `#pagefind-container` while open (or set `inert` on
`header`/`main`/`footer`), and call `magnifyingGlass?.focus()` at the end of
`closePagefind()`.

This is the largest remaining accessibility gap, and it makes the two items
below less worth chasing until it lands.

### Control borders are below the 3:1 contrast floor

`src/styles/global.css`. `--rule: #e4e4e4` measures **1.27:1** against
`--paper`, and it is the only thing marking several controls as controls:

| Surface                                                                    | Measured        | Needs |
| -------------------------------------------------------------------------- | --------------- | ----- |
| `.btn-quiet` border (BackToTop, BackToPrevious, PostNavigation, tag chips) | 1.27:1          | 3:1   |
| `.copy-code` white button on `--paper-raised`                              | **1.10:1** edge | 3:1   |
| `--pagefind-ui-border` on the search input                                 | 1.27:1          | 3:1   |

WCAG 1.4.11. The same token is also used for decorative dividers under
headings, where 3:1 is _not_ required — so this is not a global repaint.

Fix: add a `--rule-strong` token for control boundaries only. `#949494` lands
at exactly 3.03:1 and is already in the palette as `--underline`, so no new
colour is needed. The TOC `<details>` frame in `TableOfContents.astro` needs
the same treatment but is not a `.btn-quiet` consumer: it applies
`border-rule` directly, so switching the class alone would miss it. The rest
of the palette was verified correct: ink 17.40:1,
muted 8.86:1, faint 5.33:1, underline 3.03:1.

### Header search trigger is missing `type` and `aria-haspopup`

`src/components/Header.astro`. The button has no `type`, so it defaults to
`type="submit"`. Harmless today (no ancestor `<form>`), but it is the one
button on the site missing it — `BackToTop` and the generated copy buttons
both set it. `aria-haspopup="dialog"` would also tell a reader the control
opens a dialog rather than navigating.

(`aria-keyshortcuts` was added here already.)

### Copy-code result is not announced

`src/components/Head.astro`. On copy, the button swaps `innerText` and
`aria-label` ("Code copied" / "Copy failed"). Mutating the `aria-label` of an
already-focused element is announced inconsistently across screen readers, so
both success and failure can pass silently. Fix: an `sr-only`
`role="status"` region.

### Escape does not exclude IME composition

`src/components/PageFind.astro`. With a CJK candidate window open over the
search field, Escape means "cancel this conversion", not "close the dialog" —
but the handler closes and wipes the query. Fix: add `!e.isComposing` to the
condition. Where a browser lets the IME swallow the key entirely no keydown
fires and the clause is inert, so it is a strict improvement. High confidence
on the spec, untested per-browser.

### Cold-load focus race when opening search

`src/components/PageFind.astro`. `openPagefind` focuses via
`setTimeout(..., 0)`, which on a genuinely cold load fires before Pagefind
mounts its input. The dialog then opens with focus still on `<body>` despite
`aria-modal="true"`. The optional chaining means it fails silently rather than
throwing. Fix properly with the focus trap above.

---

## Performance

### Reveal order is inverted on post pages

`src/pages/[...slug].astro`, `src/components/Head.astro`,
`src/styles/global.css`. The post body uses `.reveal-immediate`, a CSS
animation that starts at first style resolution. The back-link, `h1` and meta
row still use `.animate`, which the inline script staggers at
`DOMContentLoaded + index * 100ms`. So the body finishes fading at ~500ms
while the title is still fading in at ~DCL+600ms: for roughly half a second a
fully-rendered hero sits under a title that has not arrived.

**Do not fix this with `animation-delay`.** With `animation-fill-mode: both`
the delay is backfilled with the `from` state, so the article would sit at
`opacity: 0` for the whole delay and re-break LCP exactly as before.

Safe options: accept it; shorten the stagger step in `Head.astro` from 100ms
to ~40ms; or move the `h1`/meta onto their own CSS reveals with small delays
(they are not LCP candidates on these posts, so a delay is cheap there).

### LCP attribution on post pages is distorted

Measured, not theorised, and worth knowing before trusting Speed Insights.
With the fade on the article, the hero image (691,200 px²) **never registers
as an LCP candidate** across a 2s observation window — a 2,551 px² link wins
instead, reporting a flattering ~66ms. With the fade removed, the image is
correctly attributed at ~145ms.

Likely because an opacity animation runs on the compositor, so the image
never produces another main-thread paint after becoming visible and the
candidate list is not revisited. That mechanism is a best reading, not
established fact; the observation is solid and repeated.

Real users are fine — the image starts appearing as soon as it loads. But
post-page LCP in the field will read better than it is.

### Homepage and tag pages are still gated by the stagger

`src/pages/index.astro:32`, `src/pages/tags/[...id].astro:32`,
`src/pages/tags/index.astro`. The likely LCP element (the year `<section>`
holding the post list, or the results `<ul>`) is index 1 in the JS stagger,
so it waits for `DOMContentLoaded + 100ms`. Post pages no longer have this
problem; these routes still do.

### Pagefind ships 74.8KB of JS on every page

`src/components/PageFind.astro`. `dist/_astro/Search.astro_*.js` is emitted on
every page and mounts at load, though search opens rarely. Deferred, so it
does not block render, but it competes with the LCP image for bandwidth and
CPU on mobile. Fix: render an empty container and `await import()` the UI on
first `openPagefind()`.

### No font preloading

`src/components/Head.astro`. Nine `@fontsource` CSS files are bundled into a
render-blocking 71KB stylesheet and no font is preloaded, so Lora 400 (the
face the prose is set in) is not discovered until that stylesheet parses.
Fix: import the woff2 with `?url` and emit a `<link rel="preload">`, letting
Vite hash the URL rather than hardcoding it.

### Two source images are smaller than the widths they declare

`widths={[480, 720, 1440]}` exceeds the intrinsic width of two post images, so
Astro silently caps the largest variant:

| File                                                | Actual    | Largest emitted |
| --------------------------------------------------- | --------- | --------------- |
| `03-three-things-my-dad-said/photo_2026-08-21.jpeg` | 960×1280  | 960w            |
| `01-…/D937102F-…jpeg`                               | 1074 wide | 1074w           |

At the 720 CSS px desktop measure on a 2× display the browser wants 1440w and
gets less, so both render soft — and the first is also its post's LCP element.
Fix: re-export the sources at ≥1440px wide. `Japan-HP5-1.jpg` (2048w) and
`IMG_1767.jpg` (4284w) are already fine.

**This one needs the author, not a code change.**

### Smaller performance items

- `src/styles/global.css:89` — `text-rendering: optimizeLegibility` on `body`
  forces full kerning/ligature resolution over all text; a documented
  first-paint foot-gun. Drop it or scope it to `article`.
- `src/styles/global.css` — `.animate` uses `transition-all`, so every
  property change transitions, not just the reveal. Narrow to
  `opacity, translate`.
- `src/components/PageFind.astro:9` — backdrop uses `h-screen` (`100vh`),
  which overflows under mobile browser toolbars. `h-dvh` fixes it.
- `src/pages/tags/index.astro:20` — tag counts re-filter all posts per tag
  (O(tags × posts)). Free at 4 posts; noted so it is not mistaken for an
  oversight later.

---

## Correctness

### Reading time is inflated on every post

`src/lib/utils.ts`. `(wordCount / WORDS_PER_MINUTE + 1).toFixed()` adds a
whole minute and _then_ rounds to nearest, instead of rounding up:

| Post                                   | Shows  | Correct (`Math.ceil`) |
| -------------------------------------- | ------ | --------------------- |
| hello-again                            | 2 min  | 2 min                 |
| the-convenience-of-not-owning-anything | 6 min  | 5 min                 |
| reintroducing-friction-to-feel-again   | 6 min  | 5 min                 |
| three-things-my-dad-said               | 13 min | 12 min                |

Deliberately left alone: it changes a user-visible number on every post, so
it is the author's call. (MDX `import` lines are already excluded from the
count; that fix landed and moved no displayed value.)

Related, lower stakes: the import-stripping regex is anchored `^[ \t]*`, so it
would also drop an `import` line inside a fenced code block. No post contains
a code fence today.

### Prev/next post links may be inverted

`src/pages/[...slug].astro:26-27`. `posts` is newest-first, so
`posts[postIndex - 1]` is the _newer_ post, and it is bound to `prevPost`,
which renders on the left with a back-arrow labelled "Previous post".
Conventionally "previous" means older. Verified in the built output.

May be a deliberate "next in reading order" reading — the comment on line 23
documents the ordering — which is why it was left alone. If unintended, swap
the two expressions.

### Copy button is appended inside `<pre>`

`src/components/Head.astro`. The button is appended to the code block itself,
so `📋` becomes part of the block's text — hence the `codeText.replace(buttonText, "")`
workaround, which strips `✅` instead if the button is clicked twice within
its 2s reset window, leaving `📋` in the clipboard. A manual select-and-copy
of the block also picks up the emoji.

Fix: append to `wrapper` instead and drop the `.replace()`. `.copy-code` is
already positioned against `wrapper`, so placement should be unchanged —
worth an eyeball to confirm.

### Dates are parsed as UTC and rendered in local time

`src/content.config.ts:10` uses `z.coerce.date()`, making `"2026-08-21"` UTC
midnight. `src/lib/utils.ts`, `src/components/FormattedDate.astro` and
`src/pages/index.astro` all format in the local zone with no `timeZone`
option. Vercel builds in UTC so production is correct, but a local
`pnpm build`/`pnpm dev` west of UTC renders every post a day early, and a
January-1 post would group under the previous year. Fix: pass
`timeZone: "UTC"` and use `getUTCFullYear()`.

### `site` is now a reserved slug

`src/pages/og/site.png.ts` is a static route that shadows
`og/[...slug].png.ts`. A future post with `slug: "site"` would silently get
the generic site card instead of its own — no build error. Nothing collides
today.

---

## Content and metadata

- `src/components/Head.astro:47` — `og:type` is hardcoded `"website"` on every
  page, including posts, which should be `article` (plus
  `article:published_time`). Needs the layout to pass a type through.
- `src/components/Head.astro` — Twitter card tags are emitted as
  `property="twitter:*"` rather than `name="twitter:*"`. The crawler tolerates
  it and cards resolve, but `name` is what the spec calls for.
- `src/pages/tags/index.astro:12` and `src/pages/404.astro:10` are missing
  `data-pagefind-ignore`, which `index.astro` and `tags/[...id].astro` both
  have. So "404: Page not found" and the "All tags" listing are indexed and
  surface as search results.
- Internal post links omit the trailing slash that the sitemap, canonical tags
  and RSS all use (`ArrowCard.astro:15`, `PostNavigation.astro:16,48`). Both
  forms resolve and canonical points at the slash form, so it is SEO-safe, but
  whether the non-slash form 200s or 308s depends on Vercel's setting rather
  than anything in this repo.
- `src/content.config.ts:14` — `slug` has no uniqueness or reserved-word
  guard, and posts are served from the site root, so a slug of `tags`, `404`,
  `rss.xml` or `og` would collide with a real route.

---

## Code health

- **The two OG routes duplicate ~12 lines.** `og/site.png.ts` and
  `og/[...slug].png.ts` each restate the `1200`/`630` card dimensions, the
  `as Parameters<typeof satori>[0]` cast, and the sharp→Response tail. Worth
  extracting to `@lib/og-render.ts` with named constants; `@lib/` already
  holds `og-fonts.ts` and `og-template.ts`, so the pattern exists. Pure
  refactor, byte-identical output.
- `src/components/PostNavigation.astro` — the prev and next branches are ~30
  near-identical lines differing only in post, label, flex direction and arrow
  side.
- `src/components/Callout.astro` is unused — nothing in `src/` imports it. May
  be a deliberate authoring affordance for future posts. Its
  `typeClasses.default` and `typeClasses.info` are byte-identical, so `info`
  differs from `default` only by emoji.
- `src/styles/global.css` — the `.meta` utility has no consumers.
- `src/components/Link.astro` — the `group` prop is never passed by any caller,
  so `group && "group"` always resolves to `false`.
- `src/pages/rss.xml.js` is the only `.js` file in an otherwise TypeScript
  `src/`, so `context` is implicitly untyped and escapes `astro check`.
  Renaming to `.ts` with `APIContext` leaves the route URL unchanged.
- `src/components/PageFind.astro` is named for a product spelled "Pagefind",
  and `Layout.astro` imports it as `Pagefind`.

---

## Dependencies and config

- **`sharp` is pinned `^0.34.5`**, and GHSA advisories covering
  CVE-2026-33327/33328/35590/35591 are patched in `>=0.35.0`. Real severity
  here is **low**: sharp runs once at build time on Satori output built from
  Zod-validated frontmatter the author wrote, so no attacker-controlled bytes
  reach libvips and there is no request-time image pipeline. Deliberately not
  bumped — 0.34→0.35 is breaking under 0.x semver and sits under every image
  on the site, so it wants its own change and a visual check.
- `pnpm audit --prod` reports 11 findings in total, 10 of them beyond sharp.
  All are transitive build-time dependencies with no runtime presence in a
  static build
  (`fast-uri` ×5 and `ajv` via `@astrojs/check`'s YAML language server,
  `picomatch` ×2 via `unstorage`, `nanoid` via `postcss`, `smol-toml`). They
  need hostile input that never arrives, and resolve as Astro updates its tree.
- `@astrojs/check` and `typescript` sit in `dependencies` rather than
  `devDependencies`. Moving them shrinks the declared production surface, but
  `pnpm build` runs `astro check`, so this depends on Vercel's install
  behaviour and could break the deploy.
- **No response security headers** — no `vercel.json`, so no
  `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors` or
  `Permissions-Policy` (Vercel supplies HSTS). Impact is near nil with no
  cookies, auth or session. A real CSP is a separate exercise: it would have to
  cover both `is:inline` scripts, the `data:` favicon, Pagefind's wasm and
  fetch, and Vercel Analytics — and getting it wrong silently breaks search.
- `.gitignore` ignores `.vscode/`, yet `.vscode/extensions.json` and
  `.vscode/launch.json` are tracked. Git honours existing tracking, so both
  stay. Either negate them explicitly (`.vscode/*` plus `!` for the two) or
  `git rm --cached` them — the first matches what the repo actually does.
- `.gitignore` covers `.env` and `.env.production`, but Astro/Vite also load
  `.env.local`, `.env.<mode>` and `.env.<mode>.local`. No such file exists and
  none appears in history; broadening to `.env.*` with `!.env.example` is
  purely preventive.
- Prettier is configured at `.prettierrc.mjs` but unreachable: there is no
  `format` script and `pnpm build` never runs it, so it only applies if someone
  runs `npx prettier` by hand.
- `astro-pagefind@1.8.5` declares
  `peerDependencies: astro ^2.0.4 || ^3 || ^4 || ^5` while this project runs
  Astro 7.2.4. It works — its script hooks
  `astro:page-load`, which ClientRouter still fires — but nothing pins that
  contract. Worth watching on the next Astro bump.

---

## Disputed — needs a manual check

**Does clicking a search result close the dialog?**

`src/components/PageFind.astro` matches on
`event.target.classList.contains("pagefind-ui__result-link")`, which only
matches a click on the `<a>` itself.

Two audits disagreed. One held that Pagefind renders the result title and
excerpt _inside_ the link, so clicking the title — the normal action — leaves
the modal open over the newly navigated page. A later pass decompiled the
shipped bundle and found the anchor holds **one text node and nothing else**
(`r=x("p"), i=x("a"), o=C(a)`, where `x` creates an element and `C` a text
node; the anchor sits inside the title `<p>` and receives only that text
node), with the `<mark>` highlights in a sibling
`<p class="pagefind-ui__result-excerpt">` whose `innerHTML` is set outside the
anchor, so `event.target` is always the `<a>`.

The second analysis is more specific and probably right, but this was never
exercised in a browser. One manual click settles it. If it turns out to be
broken, `event.target.closest?.(".pagefind-ui__result-link")` is the fix.

Worth checking on the same pass: search, click a result, then reopen search on
the destination page and confirm the field is clean. `#backdrop` is
`transition:persist`, so that path survives client-side navigation and is the
one the old stale-query bug rode on.

---

## Fixed already — do not re-investigate

Recorded so these are not rediscovered as new:

- Post reveal gating LCP (post body moved to a CSS reveal).
- Bare `/` search shortcut (removed; WCAG SC 2.1.4 now conforms because a
  modifier-bearing shortcut is out of that criterion's scope).
- `Cmd/Ctrl+K` handing the chord back to the browser when the dialog was open.
- `closePagefind` assigning `.value` to a `<div>`, so the query never cleared.
- Escape reaching into the search field when the dialog was closed.
- Default OG image being the upstream theme's stock art.
- Five separate copies of "non-draft posts, newest first", one of which sorted
  `Astro.props` in place.
- `readingTime()` counting MDX `import` lines as prose.
