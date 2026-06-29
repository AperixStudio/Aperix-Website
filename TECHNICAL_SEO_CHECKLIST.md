# Technical SEO Checklist

Reusable foundation checklist for every client website. Copy this file into each project, fill in the **Project** row, and mark items as you ship.

**Legend:** ✅ Done · ⚠️ Partial · ❌ Missing · 🔧 External (client / post-launch)

---

## Project audit snapshot

| Field | Value |
|-------|-------|
| **Project** | Aperix Studio (`aperix.com.au`) |
| **Stack** | Next.js App Router |
| **Last reviewed** | 2026-06-29 |

| # | Area | Aperix status | Notes |
|---|------|---------------|-------|
| 01 | Technical SEO foundation | ✅ Done | Per-page metadata, canonicals, `en-AU`, geo tags, robots + `/dev/` disallow |
| 02 | Structured data (schema.org) | ⚠️ Partial | Org, LocalBusiness, Person, Offer, FAQ, WebPage ✅ — Review/Article when content exists |
| 03 | Social sharing (OG + Twitter) | ✅ Done | Per-page OG images + root/twitter-image |
| 04 | XML sitemap + image sitemap | ✅ Done | `/sitemap.xml` + `/image-sitemap.xml` |
| 05 | Image SEO | ⚠️ Partial | Key alts improved — full WebP migration optional |
| 06 | Core Web Vitals tuning | ⚠️ Partial | See `docs/LIGHTHOUSE_BASELINE.md` — record scores post-deploy |
| 07 | Semantic HTML & accessibility | ✅ Done | Skip link, `#main-content`, sr-only home h1, ARIA landmarks |
| 08 | Favicons, manifest & mobile polish | ✅ Done | `icon.svg`, `apple-icon.tsx`, `manifest.ts`, theme-color |
| 09 | Search Console setup | 🔧 External | See `docs/SEARCH_CONSOLE_HANDOVER.md` |
| 10 | AI Overview readiness | ✅ Done | Entity + Person + FAQ + Offer schema, `llms.txt` |

---

## 01 — Technical SEO foundation

Custom titles and meta descriptions per page, canonical URLs, regional lang targeting, geo tags, robots directives, and crawl optimisation.

### Checklist

- [ ] **Unique `<title>` per page** — primary keyword + brand; 50–60 chars target
- [ ] **Unique meta description per page** — 150–160 chars, human-readable CTA
- [ ] **Canonical URL on every indexable page** — absolute URL, no duplicate content
- [ ] **`metadataBase` set once** — so relative canonicals resolve correctly (Next.js)
- [ ] **`<html lang="…">`** — match primary audience (`en-AU` for Australia)
- [ ] **Regional Open Graph locale** — e.g. `locale: "en_AU"` in `openGraph`
- [ ] **hreflang** (if multi-region) — `<link rel="alternate" hreflang="en-AU" …>`
- [ ] **Geo meta tags** (local businesses) — `geo.region`, `geo.placename`, `ICBM` or schema instead
- [ ] **`robots.txt`** — allow public routes, disallow admin/dev/staging, point to sitemap
- [ ] **Noindex** on thank-you pages, search results, dev routes, draft content
- [ ] **Clean URL structure** — lowercase, hyphens, no trailing-slash duplicates
- [ ] **Internal linking** — every page reachable within ≤3 clicks from home
- [ ] **404 page** — helpful, branded, links back to key pages
- [ ] **HTTPS everywhere** — no mixed content

### Aperix — where it lives

| Item | Location |
|------|----------|
| Root metadata | `app/layout.tsx` |
| Per-page metadata | `app/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `app/services/page.tsx`, `app/our-work/page.tsx` |
| Canonicals | `metadata.alternates.canonical` on each page |
| OG locale | `openGraph.locale: "en_AU"` in `app/layout.tsx` |
| `lang` attribute | `<html lang="en">` in `app/layout.tsx` — consider `en-AU` |
| Robots | `app/robots.ts` |
| Site URL helper | `lib/site.ts` (`NEXT_PUBLIC_SITE_URL`) |

### Aperix — gaps to close

- [ ] Add geo signals: LocalBusiness schema already on `/contact` — add `address`, `geo` coordinates, `telephone` if applicable
- [ ] Consider `lang="en-AU"` on `<html>` for stronger regional signal
- [ ] Disallow `/dev/` in `app/robots.ts` (currently only `/demo/`)

---

## 02 — Structured data (schema.org)

LocalBusiness, Person, Offer, Article, Review and AggregateRating markup so star ratings, prices and sitelinks appear directly in Google.

### Checklist

- [ ] **Organization** — sitewide, with `@id`, logo, url, sameAs social profiles
- [ ] **WebSite** — sitewide, linked to Organization
- [ ] **WebPage / AboutPage / ContactPage** — per page, linked via `isPartOf`
- [ ] **LocalBusiness** — name, url, logo, areaServed, address, geo, openingHours, telephone
- [ ] **Person** — founders/team on About page, linked to Organization
- [ ] **Service + Offer** — pricing pages with `price`, `priceCurrency`, `url`
- [ ] **FAQPage** — FAQ sections with Question/Answer pairs
- [ ] **Review + AggregateRating** — only if real, verifiable reviews exist (never fake)
- [ ] **Article / BlogPosting** — blog posts with author, datePublished, image
- [ ] **BreadcrumbList** — on nested pages (optional but helps sitelinks)
- [ ] **Validate** — [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] **JSON-LD** — preferred format; one `@graph` per page where possible

### Schema types reference

| Type | Use when |
|------|----------|
| `Organization` | Every business site |
| `LocalBusiness` | Physical or service-area local business |
| `Person` | Team, author, founder pages |
| `Offer` | Published pricing packages |
| `Service` | Service descriptions tied to provider |
| `FAQPage` | Visible FAQ accordion/section |
| `Review` / `AggregateRating` | Real Google/testimonial reviews with permission |
| `Article` | Blog posts, news, guides |

### Aperix — where it lives

| Schema | Location |
|--------|----------|
| Organization + WebSite | `app/layout.tsx` |
| WebPage | `app/page.tsx`, `app/our-work/page.tsx` |
| AboutPage | `app/about/page.tsx` |
| LocalBusiness | `app/contact/page.tsx` |
| Service + Offer + FAQPage | `app/services/page.tsx` |

### Aperix — gaps to close

- [ ] **Person** schema for Tom & Harrison on `/about`
- [ ] **Review / AggregateRating** — add only when real reviews exist
- [ ] **Article** — N/A until a blog exists
- [ ] Enrich LocalBusiness: street address, `geo` lat/lng, phone number

---

## 03 — Social sharing that looks professional

Open Graph and Twitter Card tags so every shared link renders a proper preview in iMessage, WhatsApp, LinkedIn, Slack and Discord.

### Checklist

- [ ] **`openGraph.title`** — per page (can differ slightly from `<title>`)
- [ ] **`openGraph.description`** — per page
- [ ] **`openGraph.url`** — absolute canonical URL
- [ ] **`openGraph.siteName`** — brand name
- [ ] **`openGraph.type`** — `website` or `article`
- [ ] **`openGraph.locale`** — e.g. `en_AU`
- [ ] **`openGraph.images`** — 1200×630 px, < 8 MB, branded; per page where content differs
- [ ] **`twitter.card`** — `summary_large_image` for visual sites
- [ ] **`twitter.title` / `twitter.description`** — mirror OG or tailor for X
- [ ] **`twitter.images`** — same as OG image (or dedicated `twitter-image`)
- [ ] **Test previews** — [opengraph.xyz](https://www.opengraph.xyz), LinkedIn Post Inspector, Meta Sharing Debugger

### Recommended image specs

| Platform | Size | Format |
|----------|------|--------|
| Open Graph | 1200 × 630 | PNG or JPG |
| Twitter large card | 1200 × 630 (min 300 × 157) | PNG or JPG |
| Square (optional) | 1200 × 1200 | For some platforms |

### Aperix — where it lives

| Item | Location |
|------|----------|
| Per-page OG + Twitter metadata | Each `app/*/page.tsx` |
| Default OG image (generated) | `app/opengraph-image.tsx` |

### Aperix — gaps to close

- [ ] Add per-page OG images for `/services`, `/about`, `/our-work`, `/contact` if previews should differ
- [ ] Add `app/twitter-image.tsx` or explicit `twitter.images` if X preview differs from OG
- [ ] Confirm `metadataBase` resolves OG image URLs correctly in production

---

## 04 — XML sitemap with image sitemap extensions

Your photos surface in Google Images. Your pages get crawled in days, not weeks.

### Checklist

- [ ] **`/sitemap.xml`** — auto-generated or static; lists all indexable URLs
- [ ] **`lastModified`** — real dates per page/content change, not all identical
- [ ] **`changeFrequency` / `priority`** — optional; use honestly (Google largely ignores inflated values)
- [ ] **Sitemap referenced in `robots.txt`**
- [ ] **Submit sitemap in Google Search Console**
- [ ] **Image sitemap** — `<image:image>` entries for indexable photos (hero, team, case studies)
- [ ] **Split sitemaps** if > 50,000 URLs or > 50 MB
- [ ] **Exclude** noindex pages, redirects, paginated duplicates

### Image sitemap entry example

```xml
<url>
  <loc>https://example.com/about</loc>
  <image:image>
    <image:loc>https://example.com/team/tom.webp</image:loc>
    <image:title>Tom — Co-founder</image:title>
    <image:caption>Tom, co-founder of Example Studio in Melbourne</image:caption>
  </image:image>
</url>
```

### Aperix — where it lives

| Item | Location |
|------|----------|
| Sitemap | `app/sitemap.ts` |
| Robots sitemap reference | `app/robots.ts` |

### Aperix — gaps to close

- [ ] Add image entries for team photos, case study previews, OG-relevant assets
- [ ] Set meaningful `lastModified` per route (e.g. from git or CMS)
- [ ] Add `/dev/*` to robots disallow

---

## 05 — Image SEO done right

Descriptive alt text on every image (critical for accessibility), WebP format for speed, lazy loading, responsive sizing.

### Checklist

- [ ] **Alt text on every meaningful image** — describe content, not "image of…"
- [ ] **Decorative images** — `alt=""` + `aria-hidden="true"` when adjacent text covers it
- [ ] **WebP / AVIF** — modern formats with JPG/PNG fallback where needed
- [ ] **`next/image` or equivalent** — automatic srcset, lazy load, size hints
- [ ] **`sizes` attribute** — matches layout breakpoints (avoids overserving pixels)
- [ ] **`width` / `height` or aspect-ratio** — prevents CLS
- [ ] **Descriptive filenames** — `melbourne-web-design-team.webp` not `IMG_2847.jpg`
- [ ] **Compress** — target < 200 KB hero, < 100 KB thumbnails
- [ ] **No critical text baked into images** — use HTML text for SEO and accessibility
- [ ] **Audit** — run Lighthouse accessibility + spot-check empty alts

### Aperix — where it lives

| Item | Location |
|------|----------|
| Team photos (webp + alt) | `components/agency/AboutWallTransitionSection.tsx`, `lib/aboutContent.ts` |
| Case study images | `components/agency/LiveSitesSectionV2.tsx` |
| Logo alt | `components/agency/Footer.tsx` |
| Decorative nav logos | `AgencyNavV2.tsx` — `alt=""` (parent has `aria-label`) |

### Aperix — gaps to close

- [ ] Audit all `<img>`, `<Image>`, and CSS background images for alt / aria
- [ ] Convert remaining JPEG/PNG content images to WebP where quality allows
- [ ] Add explicit `sizes` on all `next/image` instances

---

## 06 — Core Web Vitals tuning

Performance, layout stability and interactivity scored against Google's actual ranking signals, not guesswork.

### Checklist

- [ ] **LCP < 2.5 s** — optimise hero image/video, fonts, server response
- [ ] **INP < 200 ms** — reduce main-thread JS; defer non-critical scripts
- [ ] **CLS < 0.1** — reserve space for images, ads, embeds, web fonts
- [ ] **Font loading** — `font-display: swap`, subset weights, preload critical fonts
- [ ] **Third-party scripts** — audit (analytics, chat, maps); load async/defer
- [ ] **Code splitting** — dynamic import below-fold sections
- [ ] **Caching headers** — static assets long-cache, HTML short-cache
- [ ] **CDN** — deploy edge network (Netlify, Vercel, Cloudflare)
- [ ] **Baseline Lighthouse** — record mobile + desktop scores at launch; re-check after major changes
- [ ] **Real User Monitoring** — Search Console CWV report or CrUX

### Aperix — notes

- Heavy hero (Unicorn WebGL / video background) — mobile uses pre-rendered video intentionally
- Below-fold sections dynamically imported in `app/page.tsx` ✅
- `poweredByHeader: false` in `next.config.ts` ✅
- Security headers configured in `next.config.ts` ✅

### Aperix — gaps to close

- [ ] Document launch Lighthouse scores (mobile home, services, contact)
- [ ] Monitor CWV in Search Console after deploy
- [ ] Continue mobile perf work on scroll sections (Our Work, About)

---

## 07 — Semantic HTML and accessibility

Proper heading hierarchy, skip-to-content, ARIA labels. Search engines and screen readers both win.

### Checklist

- [ ] **One `<h1>` per page** — matches page topic
- [ ] **Logical heading order** — h1 → h2 → h3, no skipped levels
- [ ] **`<main>` landmark** — wraps primary content on every page
- [ ] **`<nav>` with `aria-label`** — main navigation identified
- [ ] **Skip to content link** — first focusable element, visible on focus
- [ ] **Focus styles** — keyboard users can see where they are
- [ ] **Form labels** — every input has associated `<label>` or `aria-label`
- [ ] **Colour contrast** — WCAG AA minimum (4.5:1 body text)
- [ ] **`prefers-reduced-motion`** — respect animation opt-out
- [ ] **Modal focus trap** — dialogs return focus on close
- [ ] **axe / Lighthouse a11y audit** — fix critical issues before launch

### Skip link example

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
<!-- … -->
<main id="main-content">…</main>
```

### Aperix — where it lives

| Item | Location |
|------|----------|
| `aria-label` on sections | Hero, FAQ, About, Live Sites, Footer modals |
| `role="main"` | `app/contact/page.tsx`, `app/services/page.tsx` |
| Reduced motion | `lib/useReducedMotion.ts`, intro/animation components |
| Accessibility statement | Footer modal in `components/agency/Footer.tsx` |

### Aperix — gaps to close

- [ ] Add skip-to-content link in `app/layout.tsx`
- [ ] Ensure `<main>` + single `<h1>` on every page consistently
- [ ] Run axe audit on home, services, contact

---

## 08 — Favicons, manifest and mobile polish

Full favicon set, PWA manifest, brand-matched browser chrome on mobile.

### Checklist

- [ ] **favicon.ico** — 32×32 (legacy browsers, bookmarks)
- [ ] **SVG favicon** — `icon.svg` for modern browsers
- [ ] **PNG favicons** — 16×16, 32×32, 192×192, 512×512
- [ ] **apple-touch-icon** — 180×180 for iOS home screen
- [ ] **Safari pinned tab** — `mask-icon` SVG + `color` theme
- [ ] **`manifest.webmanifest`** — name, short_name, icons, theme_color, background_color
- [ ] **`theme-color` meta** — matches brand header/chrome on mobile
- [ ] **Next.js App Router** — use `app/icon.svg`, `app/apple-icon.png`, `app/manifest.ts`

### Aperix — where it lives

| Item | Location |
|------|----------|
| SVG icon | `app/icon.svg` |

### Aperix — gaps to close

- [ ] Add `app/apple-icon.png` (180×180)
- [ ] Add `app/manifest.ts` with theme/background colours
- [ ] Add `metadata.themeColor` in `app/layout.tsx`
- [ ] Optional: `favicon.ico` for older clients

---

## 09 — Search Console setup

Google Search Console configured, sitemap submitted, indexing verified. Handed over ready to monitor.

### Checklist (post-launch — client or agency)

- [ ] **Verify domain property** — DNS TXT or HTML file (prefer domain-level)
- [ ] **Submit `sitemap.xml`**
- [ ] **Request indexing** for home + key landing pages
- [ ] **Check Coverage report** — no unexpected errors
- [ ] **Check Page Experience / CWV report**
- [ ] **Set up email alerts** for critical issues
- [ ] **Link Analytics** — GA4 ↔ Search Console association
- [ ] **Document handover** — login, property URL, verification method

### Aperix — status

🔧 **External** — not verifiable in codebase. Complete after production deploy on `aperix.com.au`.

---

## 10 — AI Overview ready

Structured data is how Google's AI answers pick which sites to cite. Yours is eligible from day one.

### Checklist

- [ ] **Clear entity markup** — Organization + LocalBusiness with consistent `@id` URLs
- [ ] **FAQ schema** — matches visible FAQ content verbatim
- [ ] **Service + Offer schema** — real pricing, currency, service area
- [ ] **Person schema** — named founders with roles and sameAs links
- [ ] **Quoteable copy** — short factual sentences on services, location, pricing
- [ ] **`/llms.txt`** — optional; tells AI crawlers preferred pages and business facts
- [ ] **No conflicting facts** — NAP (name, address, phone) identical across site, schema, GMB
- [ ] **Review schema** — only with genuine, attributable reviews

### Aperix — where it lives

| Item | Location |
|------|----------|
| Entity schema | `app/layout.tsx`, `app/contact/page.tsx`, `app/services/page.tsx` |
| AI crawler hints | `public/llms.txt` |

### Aperix — gaps to close

- [ ] Add Person schema on About page
- [ ] Ensure pricing in schema matches visible `/services` prices exactly
- [ ] Add reviews schema when real Google/testimonial reviews are available

---

## Launch sign-off template

Copy for each project delivery:

```
Project: ___________________
Launch URL: ___________________
Date: ___________________

[ ] All indexable pages have unique title + description + canonical
[ ] robots.txt + sitemap.xml live and submitted to Search Console
[ ] Rich Results Test passed on home, services, contact
[ ] OG/Twitter previews verified on iMessage + LinkedIn
[ ] Lighthouse mobile: Performance ___ / Accessibility ___ / SEO ___
[ ] Favicon + apple-touch-icon visible on iOS + Android
[ ] Skip link + keyboard nav tested
[ ] Search Console verified and sitemap submitted
[ ] Client handover doc delivered
```

---

## Quick file map (Next.js App Router)

| SEO concern | Typical file |
|-------------|--------------|
| Root metadata | `app/layout.tsx` |
| Page metadata | `app/[route]/page.tsx` → `export const metadata` |
| Sitemap | `app/sitemap.ts` |
| Robots | `app/robots.ts` |
| OG image | `app/opengraph-image.tsx` |
| Favicon | `app/icon.svg`, `app/apple-icon.png` |
| Manifest | `app/manifest.ts` |
| Site URL env | `NEXT_PUBLIC_SITE_URL` |
| JSON-LD | Inline `<script type="application/ld+json">` or `lib/schema/*.ts` |
| AI hints | `public/llms.txt` |

---

*Template version 1.0 — Aperix Studio internal use. Update the audit table per project.*
