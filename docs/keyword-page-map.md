# Keyword-to-page ownership map (draft)

**Status:** draft with Thomas's decisions recorded on 9 Nov 2026. The teammate has not signed. This file does not mark SEO-02 complete. Both names and dates are required at the end before anyone marks the Macro task done.

**Task:** SEO-02, confirm the keyword-to-page ownership map. Source: *Aperix Studio — SEO Optimisation Proposal*, Section 3 (accepted overall, 8 Nov 2026). Accepting the proposal did not approve this map.

**Live site:** https://aperix.com.au

**Path:** `docs/keyword-page-map.md`. The brief's default was `docs/seo/keyword-page-map.md`. This repo already keeps docs as flat files in `docs/` (`SEARCH_CONSOLE_HANDOVER.md`, `LIGHTHOUSE_BASELINE.md`) and has no `docs/seo/` folder, so the map sits with those files.

**Out of scope:** SEO-03 (navigation) and SEO-04 / SEO-05 (`/services` copy). This document does not change pages, metadata, navigation, or the sitemap. Proposed URLs stay out of `app/sitemap.ts` until the pages exist.

Volumes below are estimated monthly Australian searches, as supplied in the brief. Close variants overlap, so they are not added together. Not every term was in the OpenSEO saved list. No prices, outcomes, or rankings were invented. Price slots are placeholders until Thomas supplies the figures. AI receptionist is mapped because Thomas confirmed the offer on 9 Nov 2026. The public site does not show that section yet.

---

## Rules

- One primary owner per keyword. Other pages may mention a phrase. Only one page targets it.
- One page per buyer need. No suburb pages, no synonym pages, no "responsive" page, no "website vs web" page.
- Only services Aperix offers are mapped. AI receptionist is included because Thomas confirmed it on 9 Nov 2026. The public site does not show that section yet.
- Every adjustment below is marked **Decision**. Owners from the brief are kept unless the repo proves an equivalent route already exists. None of the three proposed slugs has an equivalent route.

---

## Repo observations

### Framework and rendering

Next.js 16 App Router (`next` 16.1.6 in `package.json`). Public pages are React Server Components with static `metadata` exports. The server renders the HTML. Client islands include the navigation and the forum inbox. This is not a client-only single-page app.

### Public routes

Sitemap routes, from `app/sitemap.ts`:

| Path | In sitemap | Indexing |
|---|---|---|
| `/` | Yes | Indexable. Metadata comes from `app/layout.tsx` because `app/page.tsx` does not export its own. |
| `/services` | Yes | Indexable |
| `/our-work` | Yes | Indexable |
| `/about` | Yes | Indexable |
| `/contact` | Yes | Indexable |

Real routes beyond those five. None of these owns a commercial keyword in this map:

| Path | Notes |
|---|---|
| `/forum` | Public page of build notes (`app/forum/page.tsx`). Metadata is indexable. It is not in the sitemap. |
| `/current` | Internal design snapshot. `noindex` via `buildPageMetadata({ index: false })`. Also disallowed in `app/robots.ts`. |
| `/dev` | Playground index. Disallowed in robots. No page-level `noindex` found. |
| `/dev/hero-canvas` | Disallowed with `/dev/`. Listed on the dev index. |
| `/dev/desk-evolution` | Same. |
| `/dev/act-3-reveal` | Same. |
| `/dev/rocket` | Same. |
| `/dev/hero-theatre` | Same. Not listed on the dev index page. |
| `/dev/hero-capture` | Same. Not listed on the dev index page. |

`app/robots.ts` also disallows `/demo/`. No `app/demo` page was found.

No route matches `/ecommerce-websites`, `/web-design-for-tradies`, or `/custom-software-development`. Those slugs stay proposed. They are not added to the sitemap.

### Where titles, descriptions, canonicals, and the sitemap are defined

- Helper: `lib/seo/pageMetadata.ts` (`buildPageMetadata`). It sets `title`, `description`, `alternates.canonical`, `alternates.languages` (`en-AU` from `lib/siteBusiness.ts`), Open Graph, Twitter card, and geo meta tags.
- Home title and description: `app/layout.tsx`, which also sets `metadataBase` from `lib/site.ts` (`https://aperix.com.au` unless `NEXT_PUBLIC_SITE_URL` is set).
- Other indexable pages pass their own title and description into `buildPageMetadata`: `app/services/page.tsx`, `app/our-work/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `app/forum/page.tsx`.
- Sitemap: `app/sitemap.ts`. Image sitemap: `app/image-sitemap.xml/route.ts`. Both are referenced from `app/robots.ts`.
- JSON-LD builders: `lib/schema/siteSchema.ts`.

Current titles, unchanged by this task:

| Path | Title in the repo |
|---|---|
| `/` | Web Design & Software Studio Melbourne \| Aperix Studio |
| `/services` | Services \| Aperix Studio |
| `/our-work` | Our Work \| Aperix Studio |
| `/about` | About Us \| Aperix Studio |
| `/contact` | Contact \| Aperix Studio |
| `/forum` | Forum \| Aperix Studio |

Home H1, in `components/agency/HomeHero.tsx`: "Melbourne-based web design and software development studio". That matches the brief. No title or H1 change is part of SEO-02.

### Header and footer links

Links are real `<a href>` elements. `HashLink` renders Next.js `Link`.

Home, `/services`, and `/forum` use `components/agency/BubbleNav.tsx`:

- Our Work → `/#our-work`
- Services → `/services`
- About → `/#about`
- Forum → `/forum`
- Contact → `/#contact`

`/about`, `/contact`, and `/our-work` use `components/agency/AgencyNavV2.tsx`:

- Home → `/`
- Our Work → `/#our-work`
- About → `/#about`
- Contact → `/#contact`

That second nav does not link to `/services` or to the `/about` route. "Our Work" and "Contact" in both navs go to sections on `/`, not to `/our-work` or `/contact`. Both of those routes still exist.

`components/agency/Footer.tsx` links the logo to `/`, plus email and phone. It does not link `/services`, `/our-work`, `/about`, or `/contact`.

SEO-03 owns any navigation change. This map only records where inbound links actually are.

### Case studies

Catalogue: `lib/liveSites.ts`. The public work carousel uses `CAROUSEL_SITES`, which drops Rhino's Walk. Forum write-ups for three of the projects live in `components/agency/ForumInbox.tsx`. Quotes below are from those files. Measured outcomes (rankings, revenue, lead counts) are not in the repo, so none are stated here.

**Nails by Avy** (`https://nailsbyavy55.com.au/`). Label: "Nail studio / appointments". Sunbury, VIC.

> An appointments-only site for a Sunbury nail studio. Gel, BIAB, and custom nail art are laid out as signature sets, with prices, hours, and online booking on the same page.

Scope in the file: Booking site, Service menu, Signature sets, Studio hours, Local appointments.

> Visitors can choose a set, check the price, and book online, with confirmation sent straight to their inbox.

No forum post for this project.

**The Hidden Chapter** (`https://thehiddenchapter.com.au/`). Label: "E-commerce / brand experience". Victoria, Australia.

> A blind date with a book storefront built around mood, mystery, and gifting. The site leads with a strong brand concept, clear shopping flow, and a polished experience that feels thoughtful from the first scroll.

Scope: E-commerce, Brand storytelling, Responsive UX, Story-led homepage, Warm branded shopping flow.

> We built a mood-led storefront with stronger visual hierarchy, clearer product pathways, and brand storytelling that supports discovery on desktop and mobile.

> The finished site gives the brand a more premium feel and makes it easier for visitors to move from curiosity to browsing and purchase.

The forum post says the homepage leads with story, the product path stays short on mobile, and the shop should "feel like a gift experience from the first screen, not a catalogue with nicer photos."

**Checkout.** Thomas (9 Nov 2026): The Hidden Chapter has a checkout. Aperix built it on Stripe, and can use other payment providers. The write-up in `lib/liveSites.ts` and the forum post never say that. They stop at storefront, product pathways, browsing, and purchase. **To do:** add the Stripe checkout to that case study. Until the write-up is updated, the map is the record of the fact, and the published case study is behind it.

**POV Sync** (`https://pov-sync.onrender.com/`). Label: "SaaS / streaming product". Location in the file: "Web app".

> A multi-POV streaming tool that brings YouTube and Twitch feeds into one synced view. The product site focuses on fast onboarding, clear feature communication, and a simple path into the host setup flow.

Scope: SaaS landing, Product messaging, Onboarding UX, Fast setup flow.

> We focused the page on fast onboarding, clear feature explanation, and a clean route into the host setup flow.

The catalogue calls POV Sync a SaaS / streaming product and a web app: a multi-POV tool that syncs YouTube and Twitch. It fits `/custom-software-development`, whose buyer is commissioning custom software, a web app, or a SaaS product. The sentences in the file spend more time on the product site and host setup than on the application itself. That is a gap in the write-up, not a reason to drop the project. No forum post.

**Complete Trade Solutions** (`https://www.completetrade.au/`). Label: "Trades / home renovation". Melbourne, VIC.

> A full-service trades business covering kitchen renovations, roof restoration, painting, plumbing, electrical, cabinetry, and flooring. The site leads with a cinematic intro animation, clear service breakdown, and a direct quote enquiry flow.

> The site presents the business as broader and more organised, with a clearer path into enquiries across multiple trades.

The forum post repeats those trades and says services were grouped so the page stayed scannable, with a quote path kept visible. Results in both files are qualitative. No lead counts or rankings.

**National Roofing Solutions** (`https://www.nationalroofing.com.au/`). Label: "Roofing contractor". Sunbury, VIC.

> A roofing contractor site for a Sunbury-based business servicing Melbourne's north-west. Built around a bold hero with a typewriter service loop, trust signals, and a focused contact flow for roof repairs, restorations, and replacements.

> The business now has a focused local presence that makes the core services clearer and the contact path more direct.

The forum post says the business services Melbourne's north west, that trust signals were put up front, and that local SEO sat in service pages, location, and the contact path. Results are qualitative.

**Rhino's Walk** is in `LIVE_SITES` (fundraiser / community campaign, donation and join-the-walk actions) and is filtered out of `CAROUSEL_SITES` with the comment "paused out of rotation for now". It is catalogue content, not a proof asset for any keyword in this map.

### Pricing, FAQ, and AI receptionist

The only pricing answer on a rendered page is the home FAQ, from `FAQ_ITEMS` in `lib/services-content.ts`, shown by `components/agency/HomeFAQSection.tsx`:

> How does pricing work?

> Every project is scoped individually. We look at what you need, from pages and functionality to content structure and timeline, then send back a fixed quote with the next steps. Tell us what you're trying to achieve through the contact form and we'll shape the rest from there.

`/services` (`components/agency/ServicesIndex.tsx`) says the same thing in different words. Lede: "Custom websites, web apps, software, and mobile apps. Built by the two of us in Melbourne, and scoped to the job rather than a package." Closing line: "Don't see the exact thing? Describe what you want to ship. We'll reply with a fixed quote and a timeline."

`SERVICE_TIERS` in the same file defines four named tiers (Basic, Growth, Pro, Enterprise), each with a price string and a monthly care line. `TierShowcase` and `TierDetails` are not imported by any page. Those figures are not on the public site. Thomas (9 Nov 2026) made `/services` the pricing owner and will supply new figures. Until then this map uses placeholders and does not copy the unused tier strings. See Decision 1.

The same FAQ includes "Do you use WordPress?" Answer: "Not for this kind of work. You get a fully custom site instead of a template, so there's no limit on what we can build together." Ownership is also in that FAQ: "Yes. You own the code, the design, and the domain once the project is complete."

`components/agency/HeroAIReceptionistDemo.tsx` is a placeholder transcript. Its button handler is intentionally inert, and the file says the backend is not wired. No page imports the component. That script is not the offer. Thomas described the offer on 9 Nov 2026. See Decision 2.

Shopify and WooCommerce are not named as services anywhere in the repo. Web design copy says "No templates, and no WordPress."

### What `/services` already covers

Rendered from `STUDIO_SERVICES` by `ServicesIndex`. H1: "Our most popular services".

| Section | Summary in the repo | Covers |
|---|---|---|
| Web design | "Hand-coded websites for service businesses, shops, and brands that need a site with a point of view. No templates, and no WordPress." | Service businesses, E-commerce, Landing pages |
| Web apps & SaaS | "Products people log into. The site, the onboarding, and the product itself, built as one piece rather than a theme with a login attached." | SaaS products, Onboarding, Dashboards |
| Software development | "Bespoke software for the way a business actually runs. Tools, portals, and the work a marketing site was never meant to carry." | Custom software, Internal tools, Client portals |
| App development | "Apps for the phone and for the product. The same two people from the first conversation through to something you can hand someone." | Mobile apps, Product apps |

The page does not link a case study from each section. That linking is later work (SEO-04), not this map.

Team trust copy: home subheading says "A two-man team". About metadata says "a two-person web development team in Melbourne". `lib/siteBusiness.ts` names Tom and Harrison, each "Co-founder & Developer".

---

## 1. Home `/` (existing, P1)

| | |
|---|---|
| **Status** | Live. In the sitemap. |
| **Buyer intent** | Hire a Melbourne web design or development studio. |
| **Primary** | web design melbourne (1,900) |
| **Secondary** | website design melbourne (1,000); custom web design melbourne (140). Do not add these to the primary. |
| **Purpose** | The main Melbourne commercial page. It introduces the studio, shows proof, and links to the service pages. |
| **Draft title** | Keep "Web Design & Software Studio Melbourne \| Aperix Studio". |
| **Draft H1** | Keep "Melbourne-based web design and software development studio". No change for SEO-02. |

**Proof, from the repo**

- Case studies in `lib/liveSites.ts`, shown on the home work section. The five named in the brief, plus Rhino's Walk in the catalogue only.
- Two-developer team: Tom and Harrison, Co-founder & Developer.
- Custom builds, no templates: web design summary and the WordPress FAQ.
- Client owns the code: "Do I own my website after you build it?"
- Home FAQ, including "Do you use WordPress?"

**Do not target as primaries:** ecommerce, tradie, software, or pricing phrases.

**Inbound links today:** logo to `/` in the footer; Home in `AgencyNavV2`; BubbleNav has no separate Home item (it is the page the pill sits on).

**Pricing:** `/services` is the only owner (Thomas, 9 Nov 2026). Home keeps the short "How does pricing work?" answer and should link it to `/services`. That link is later work. Home does not target the package phrases.

---

## 2. `/services` (existing hub, P2)

| | |
|---|---|
| **Status** | Live. In the sitemap. The brief records that on 8 Nov 2026 Google URL Inspection showed "Discovered – currently not indexed". That is context from the brief, not a new crawl. |
| **Buyer intent** | Compare what Aperix offers. |
| **Primary** | None of the main Melbourne phrases. This is a hub, not a second home page. |
| **Pricing phrases** | Owner of the pricing FAQ in section 6 (Thomas, 9 Nov 2026). Figures are placeholders until he supplies them. |
| **AI receptionist** | Own section on this page. No new URL. Primary: AI receptionist for tradies (40). The offer is for businesses in general, with the emphasis on service businesses such as trades and salons. The tradie website page does not target this phrase. |
| **Purpose** | A short section per service, including the AI receptionist section once it is written. Later, each section should link a real case study and, once it exists, the dedicated page. SEO-04 rewrites the copy. This task does not. |

**Covers today:** Web design (including the word "E-commerce" in its cover list), Web apps & SaaS, Software development, App development. Quotes are in the observations above.

**Planned on this page, not built yet:** an AI receptionist section, and the pricing FAQ with placeholder figures (section 6). The software section stays an introduction only. "custom software development melbourne" belongs to `/custom-software-development`.

**AI receptionist, as Thomas described it on 9 Nov 2026.** An AI bot linked to the company's phone. It is either the primary call taker or the answering machine. It sounds like a person and runs the call with a potential client. It collects the basics: name, contact details, job type, and when they need the work done, so the business does not lose the client and can call back without starting blind. It can also make bookings, including appointments and inspections, and it checks the rest of the calendar while it does that. It is for businesses in general. The emphasis is service businesses, such as trades and salons. Price, setup, and what is included are not set. Do not paste the placeholder transcript in `HeroAIReceptionistDemo.tsx`. Booking is part of the offer. That script is not the specification.

**Do not target:** "web design melbourne" (owned by home).

**Draft direction for SEO-04, not a change now:** something like "Web design & software development services | Aperix Studio". Current title is "Services | Aperix Studio". Current H1 is "Our most popular services".

**Inbound links today:** BubbleNav "Services" → `/services`, on home, `/services`, and `/forum`. `AgencyNavV2` (about, contact, our-work) does not link here. The footer does not link here. The home hero has no link to `/services`.

**Overlap with proposed pages.** The hub already names e-commerce, web apps and SaaS, and software development. Dedicated pages in sections 3 and 5 own those primaries. The hub introduces them and links through. It does not take "ecommerce website design melbourne" or "custom software development melbourne". Pricing phrases and "AI receptionist for tradies" are the phrases this page does own.

---

## 3. `/ecommerce-websites` (proposed, P2)

| | |
|---|---|
| **Status** | Proposed. No equivalent route in the repo. Not in the sitemap. Do not add it until the page exists. |
| **Buyer intent** | Get a custom online store built. |
| **Primary** | ecommerce website design melbourne (260) |
| **Secondary** | ecommerce website development melbourne (260). Overlaps the primary. Do not add them together. |
| **Draft H1, suggestion only** | "Custom ecommerce websites in Melbourne". |

**Proof:** The Hidden Chapter. The published write-up covers the mood-led storefront, product pathways, browsing, and purchase. Thomas (9 Nov 2026) adds the missing fact: Aperix built the checkout on Stripe, and can use other payment providers. **To do:** put that into the Hidden Chapter case study (`lib/liveSites.ts` and the forum post) so the public proof matches the map.

**Purpose, when the page is built:** process, features, checkout (Stripe, or another payment provider), a custom build rather than a WordPress template, and FAQs. No title or meta description is drafted yet. Draft H1 is above.

**Do not target:** Shopify- or WooCommerce-specific terms. The repo does not show those as offers.

**Inbound links, once the page exists:** home, `/services`, and the Hidden Chapter case study. None of those links exist yet. `/services` only lists "E-commerce" as a cover under Web design.

**Decision:** slug kept, because no equivalent route exists. Do not point this primary at the Web design row on `/services`.

---

## 4. `/web-design-for-tradies` (approved, P3, not built)

| | |
|---|---|
| **Status** | Approved by Thomas on 9 Nov 2026. Not built. No equivalent route. Not in the sitemap. Teammate sign-off is still open. |
| **Buyer intent** | A tradie wants a website that brings in jobs. |
| **Primary** | web design for tradies (320) |
| **Draft H1, suggestion only** | "Websites for tradies, built in Melbourne". |

**Proof:** National Roofing Solutions and Complete Trade Solutions, quoted above. The published write-ups already say: multi-service trades layout and a quote path (Complete Trade Solutions); local roofing services, trust signals, and a direct contact path (National Roofing Solutions). Outcomes stay qualitative. Do not add numbers.

**Page outline, from Thomas on 9 Nov 2026, for those trade jobs:**

- Opened their Google Business Profiles.
- Built free instant quote forms so a client can enquire without a phone tag.

The case study files do not say "Google Business Profile" or "free instant quote form" yet. Complete Trade Solutions says "quote enquiry" and "Quote CTA". National Roofing Solutions says "local SEO foundations" and a contact path. **To do:** add the profile setup and the instant quote forms to those two write-ups before the tradie page treats them as published proof.

**Condition:** Thomas says build it. The page is not part of this documentation task, and it stays out of the sitemap until it exists.

**Do not target:** suburb pages, trade-by-trade pages, hipages, directory searches, or app searches.

**Excluded, not this page's volume:**

| Phrase | Volume | Why it is parked |
|---|---|---|
| tradie website | 1,600 | Intent is unclear. Possible supporting phrase only. Its volume does not count toward this page. |
| australian tradies | 1,300 | Irrelevant. |
| AI receptionist for tradies | 40 | Different buyer need. Owned by the AI receptionist section on `/services`. No slug. |

**Inbound links, once the page exists:** home, `/services`, and the two trade case studies. Those links do not exist yet.

**Decision:** Thomas approved the page on 9 Nov 2026. See Decision 3. The teammate has not signed.

---

## 5. `/custom-software-development` (approved, P3, not built)

| | |
|---|---|
| **Status** | Approved by Thomas on 9 Nov 2026 as the dedicated owner. Not built. No equivalent route. Not in the sitemap. Teammate sign-off is still open. |
| **Buyer intent** | Commission custom software, a web app, or a SaaS product. |
| **Primary** | custom software development melbourne (50) |
| **Secondary** | software development companies melbourne (140) |
| **Draft H1, suggestion only** | "Custom software development in Melbourne". |

Low volume, high commercial value, as stated in the brief. That value is not a measured outcome from the repo.

**Proof:** POV Sync. It belongs here. The catalogue labels it a SaaS / streaming product and a web app: a multi-POV tool that puts YouTube and Twitch in one synced view, with onboarding and a host setup flow. That is the web app / SaaS half of this page's buyer intent. The write-up talks more about the product site than about the application. It does not describe internal tools or client portals, and it does not need to. Those sit in the `/services` software blurb. POV Sync is still the case study for this page.

`/services` already has two sections that sit on this intent:

- Web apps & SaaS: "Products people log into…"
- Software development: "Bespoke software for the way a business actually runs. Tools, portals, and the work a marketing site was never meant to carry."

**Do not target:** salary, jobs, or "software companies" as an employer search.

**Decision:** Thomas (9 Nov 2026) chose this page as the only owner of "custom software development melbourne". `/services` keeps a short software section that introduces the work and links here. That section does not target the primary. POV Sync stays a case study. See Decision 4. The teammate has not signed. The page is not built and is not in the sitemap.

---

## 6. Pricing FAQ (owner: `/services`)

| | |
|---|---|
| **Status** | Owner set by Thomas on 9 Nov 2026. There is no `/pricing` route, and this map does not create one. Figures are placeholders. |
| **Buyer intent** | Understand the cost before enquiring. |
| **Primary** | small business website design packages (210) |
| **Secondary** | website design melbourne price (50); how much does a website cost per month (50); average cost of website design for small business australia (40). Do not add these together. |

**Purpose:** explain how pricing works, and upfront build cost versus ongoing hosting and care.

**Placeholders, until Thomas supplies the numbers:**

| Slot | Figure |
|---|---|
| Upfront build | [price to be supplied] |
| Ongoing hosting and care | [price to be supplied] |

Do not fill these from `SERVICE_TIERS`. Those strings are unused on the public site and are not the offer.

**What the site says now, and what stays for now:** projects are scoped individually and answered with a fixed quote. That copy is on `/` (the FAQ) and on `/services` (the lede and the closing line). Thomas is leaving that in place until the figures exist. Home keeps the short answer. The detailed block on `/services` waits.

**Do not:** create a pricing page, or publish a number that has not been supplied.

---

## 7. Supporting pages (existing, no generic commercial primary)

### `/our-work`

| | |
|---|---|
| **Status** | Live. In the sitemap. Title: "Our Work \| Aperix Studio". |
| **Intent** | Proof. |
| **Primary** | None. |
| **H1 in the repo** | "Website case studies for businesses Aperix has created." |

Case studies on this page come from the live-sites catalogue: Nails by Avy (booking), The Hidden Chapter (e-commerce storefront; Stripe checkout is confirmed by Thomas and still missing from the write-up), POV Sync (custom web app / SaaS), Complete Trade Solutions, National Roofing Solutions. Rhino's Walk is in the data file and paused out of the carousel.

**Later linking, not this task:** each case study should link to the service page that owns that kind of work, once those pages exist. The work nav item currently points at `/#our-work`, not at this URL.

### `/about`

| | |
|---|---|
| **Status** | Live. In the sitemap. Title: "About Us \| Aperix Studio". |
| **Intent** | Brand and team trust. |
| **Primary** | None. |
| **Proof** | "two-person web development team" in the page description. Tom and Harrison, each Co-founder & Developer, in `lib/siteBusiness.ts`. |

The About item in both navs points at `/#about` on the home page, not at `/about`.

### `/contact`

| | |
|---|---|
| **Status** | Live. In the sitemap. Title: "Contact \| Aperix Studio". |
| **Intent** | Contact. Being short is fine. |
| **Primary** | None. |

The Contact item in both navs points at `/#contact` on the home page. `/our-work` does link to `/contact` ("Start your project"). `/services` links to `/#contact`.

### `/forum`

Not a commercial target. Public, indexable, and absent from the sitemap. Build notes include write-ups of National Roofing Solutions, Complete Trade Solutions, and The Hidden Chapter. No keyword is assigned here.

---

## Not mapped

| Keyword | Volume | Decision |
|---|---|---|
| web design / website design | 5,400 each | Too broad and nationwide. No page. |
| web designer | 2,900 | Broad. Home can mention it. It is not a primary. |
| website designer near me | 1,600 | Depends on the searcher's location. Home covers it. No page. |
| web designing company | 720 | Broad. No page. |
| salon website design and variants | about 10 each | No page. Nails by Avy stays a case study. Revisit only if Search Console shows demand. |

No suburb pages and no synonym pages are proposed.

---

## Decisions recorded by Thomas (9 Nov 2026)

The teammate has not signed these. SEO-02 stays incomplete until that row is filled. No page, price, or sitemap entry was added with this update.

### Decision 1 — Pricing owner

**Recorded:** `/services` owns the pricing phrases in section 6. Home keeps a short answer and, later, a link to `/services`. No separate pricing page.

**Placeholders, left this way on purpose:** upfront build `[price to be supplied]`; ongoing hosting and care `[price to be supplied]`. Thomas (9 Nov 2026) is leaving the figures and the live "scoped individually / fixed quote" copy as they are for now. The unused `SERVICE_TIERS` figures stay unpublished. Do not fill this in until he sends the numbers and what each one includes.

### Decision 2 — AI receptionist

**Recorded:** Aperix offers AI receptionists. They get their own section on `/services`. No new slug.

**What it does:** linked to the company's phone as the primary call taker or as the answering machine. It sounds like a person, takes the call from a potential client, and collects name, contact details, job type, and when they need the work done. The business can call them back without starting blind, and the enquiry is not lost. It can also book the caller in, including appointments and inspections, while taking the rest of the calendar into account.

**Who it is for:** businesses in general, with the emphasis on service businesses such as trades and salons. The mapped phrase is still "AI receptionist for tradies" (40), because that is the keyword in the brief. `/web-design-for-tradies` does not target this phrase. No case study is claimed to be using it yet.

**How it is sold:** not set. No price, setup fee, or package is recorded.

**Still true of the repo:** `HeroAIReceptionistDemo` is an unwired placeholder and is not mounted. Do not publish that transcript as the product. Booking is a real part of the offer, as described above.

### Decision 3 — Tradie page

**Recorded:** build `/web-design-for-tradies`. Thomas approved it on 9 Nov 2026. It is not built in this task and it is not in the sitemap.

**Page outline he added:** for the trade jobs, Aperix opened their Google Business Profiles and built free instant quote forms. **To do:** add both to the National Roofing Solutions and Complete Trade Solutions write-ups. The published files do not say those words yet.

**Still excluded:** "tradie website" (1,600) and "australian tradies" (1,300). Do not add lead counts or rankings.

### Decision 4 — Software page

**Recorded:** `/custom-software-development` is the only owner of "custom software development melbourne". `/services` introduces software and links to that page. It does not take the primary.

The page is not built and it is not in the sitemap. POV Sync stays the case study. It fits: it is a custom web app and SaaS product (a multi-POV YouTube and Twitch tool), not only a landing page. The write-up under-describes the product. It does not need to be an internal tool to count.

### Decision 5 — Checkout on the ecommerce page

**Recorded:** `/ecommerce-websites` covers checkout. The Hidden Chapter checkout was built on Stripe. Aperix can use other payment providers as well.

**To do:** the case study does not say this. Add it to `lib/liveSites.ts` and the forum post for The Hidden Chapter. The write-up was incomplete. The store was not missing a checkout.

### Slugs

No existing route was an equivalent of `/ecommerce-websites`, `/web-design-for-tradies`, or `/custom-software-development`, so those slugs are unchanged. None of them is in the sitemap.

---

## Primary ownership check

| Keyword | Only primary owner |
|---|---|
| web design melbourne | `/` |
| ecommerce website design melbourne | `/ecommerce-websites` (proposed) |
| web design for tradies | `/web-design-for-tradies` (approved, not built) |
| custom software development melbourne | `/custom-software-development` (approved, not built) |
| small business website design packages | `/services` |
| AI receptionist for tradies | `/services`, own section, no new URL |

Secondaries are listed on those same pages and are not primaries anywhere else. Broad terms in the "Not mapped" table have no page.

---

## Acceptance checklist

SEO-02 is complete in Macro only after both founders sign below. This file does not check that box.

- [x] The map is in the repo at `docs/keyword-page-map.md`, with the repo observations above.
- [x] Every URL lists status, intent, primary and secondary keywords, proof, purpose, what not to target, and inbound links.
- [x] Each selected keyword has exactly one primary owner. No duplicate topic owners.
- [x] Proposed slugs were checked against real routes. No equivalent route existed, so the proposed slugs were kept.
- [x] No suburb or synonym pages. No made-up prices or outcomes. Price slots are placeholders. AI receptionist is mapped as a `/services` section because Thomas confirmed the offer. The unwired demo is not treated as the feature list.
- [x] Thomas's decisions are recorded: `/services` owns pricing, AI receptionist is a section on `/services`, the tradie page is approved, `/custom-software-development` owns the software primary, and `/ecommerce-websites` covers checkout.
- [x] New URLs are not in the sitemap. Add them only after the pages exist.
- [ ] Both founders have signed off, with names and date.

| | Name | Date |
|---|---|---|
| Founder | Thomas | 9 Nov 2026 |
| Teammate | | |

Thomas's row records the five decisions above. The teammate's row is still empty, so SEO-02 is not done.
