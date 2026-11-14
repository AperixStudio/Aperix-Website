# Cursor brief: SEO-02, confirm the keyword-to-page ownership map (Aperix Studio)

**Task:** SEO-02, Confirm the keyword-to-page ownership map (P1, Content & SEO, Days 1–30)
**Macro task (SEO-02):** https://macro.com/app/task/01a1bcd1-aca3-7b58-9259-e2f6afa08762
**Completed baseline (SEO-01):** https://macro.com/app/task/01a1bcd1-aca3-7508-9a7b-917046b5fa7e
**Live site:** https://aperix.com.au
**Source:** *Aperix Studio — SEO Optimisation Proposal* (accepted overall, 8 Nov 2026), Section 3.

> **Status of this map:** a **recommended draft**. Accepting the overall proposal doesn't approve this map. SEO-02 is done only when Thomas and his teammate both sign it off. Don't mark SEO-02 complete.

---

## 1. Prompt for Cursor

```
Read this whole brief first. Your job is documentation only.

1. Follow any AGENTS.md / CLAUDE.md / contributing rules in this repo.
2. Inspect the repository read-only and report:
   - framework and rendering model (SSR/SSG/SPA) — do not assume Next.js;
   - every real public route/page (not just the 5 in sitemap.xml);
   - where titles, meta descriptions, canonicals and the sitemap are defined;
   - where header/footer navigation lives and whether links are real <a href>;
   - where case studies (Nails by Avy, The Hidden Chapter, POV Sync,
     Complete Trade Solutions, National Roofing Solutions) are stored, and
     what each one actually says (features, outcomes) — quote, don't invent;
   - any existing route equivalent to a proposed slug in section 3
     (/ecommerce-websites, /web-design-for-tradies, /custom-software-development),
     or any existing pricing/FAQ content, or any AI receptionist offering.
3. Create or update the keyword map document. Default path
   docs/seo/keyword-page-map.md, unless the repo has an existing docs layout,
   in which case follow it and say where you put it.
4. Fill the map from section 3 of this brief. Adjust only where the repo
   proves something different (e.g. an equivalent route already exists);
   flag every adjustment as a decision point, do not silently change owners.
5. Then STOP and reply with: repo observations, the doc path and diff,
   and the open decision points list.

Do NOT: edit source/pages/components/metadata/navigation/sitemap, build,
deploy, add dependencies or APIs, submit anything to Google, run paid SEO
research, invent prices, outcomes, testimonials or slugs, or mark SEO-02 done.
```

---

## 2. Rules for the map

- **One primary owner per keyword.** Other pages can mention a phrase naturally, but only one page targets it.
- **One page per buyer need.** No thin suburb, synonym, "responsive" or "website vs web" pages. Cover variants on the page that owns the topic.
- **Volumes are estimated monthly Australian searches** from OpenSEO/DataForSEO. Close variants overlap, so **don't add them together**.
- **Not every term here is in the OpenSEO saved list.** Some come from earlier research exports.
- **Only list services Aperix actually offers.** Remove anything it doesn't offer.
- **No new pages in sitemap.xml until they exist.**
- **No made-up prices, outcomes or rankings.**

---

## 3. Recommended map (draft)

Draft title and H1 lines are suggestions only. Don't change the site.

### 3.1 Home `/` (existing, P1)
- **Buyer intent:** hire a Melbourne web design or development studio.
- **Primary:** web design melbourne (1,900).
- **Secondary:** website design melbourne (1,000); custom web design melbourne (140).
- **Purpose:** the main Melbourne commercial page. It introduces the studio, shows proof and links to the service pages.
- **Proof:** all case studies; the two-developer team; custom builds with no templates; the client owns the code; the existing FAQ (including "Do you use WordPress?").
- **Don't target:** ecommerce, tradie, software or pricing phrases as primaries.
- **Draft direction:** keep the current title ("Web Design & Software Studio Melbourne | Aperix Studio") and H1 ("Melbourne-based web design and software development studio"). No change is needed for SEO-02.
- **Inbound links:** logo/home link everywhere.
- **To verify:** whether the home FAQ or /services should own pricing (see 3.6).

### 3.2 `/services` (existing hub, P2; SEO-04 rewrites the copy)
- **Buyer intent:** compare what Aperix offers.
- **Primary:** none of the main Melbourne phrases. This is a hub, not a second home page.
- **Covers:** web design, web apps & SaaS, software development, app development.
- **Purpose:** a short section per service, each linking a real case study and, once it exists, the dedicated page.
- **Don't target:** "web design melbourne" (owned by home).
- **Draft direction:** something like "Web design & software development services | Aperix Studio", for SEO-04.
- **Inbound links:** header, footer, home hero, home FAQ (SEO-03).
- **Live status (8 Nov):** Google URL Inspection showed "Discovered – currently not indexed". The earlier "unknown to Google" result is superseded. The server HTML linked only to `/` and `/#contact`.

### 3.3 `/ecommerce-websites` (proposed, priority P2)
- **Buyer intent:** get a custom online store built.
- **Primary:** ecommerce website design melbourne (260).
- **Secondary:** ecommerce website development melbourne (260). It overlaps with the primary, so don't add them together.
- **Proof:** The Hidden Chapter (shop, product browsing, checkout). Confirm the exact features in the repo.
- **Purpose:** process, features, platform approach (custom, not WordPress templates) and FAQs.
- **Don't target:** Shopify- or WooCommerce-specific terms, unless Aperix actually offers them.
- **Draft H1:** "Custom ecommerce websites in Melbourne".
- **Inbound links:** home, /services, The Hidden Chapter case study.
- **Competitor context (not proof of cause):** in the 8 Nov domain reports, Zeemo (`/ecommerce-websites`) and Digiwhiz (`/ecommerce-web-design-melbourne/`) both have dedicated ecommerce pages. Positions in those reports conflict with a live search, so don't quote ranks.
- **To verify:** whether an equivalent route already exists.

### 3.4 `/web-design-for-tradies` (proposed, conditional P3)
- **Buyer intent:** a tradie wants a website that brings in jobs.
- **Primary:** web design for tradies (320).
- **Proof:** National Roofing Solutions and Complete Trade Solutions. Confirm what each case study actually shows.
- **Condition:** build it only if there's enough trade-specific value (features, process, FAQs) and credible project evidence. Include outcomes only where they're documented.
- **Don't target:** suburb or trade-by-trade pages; hipages, directory or app searches.
- **Draft H1:** "Websites for tradies, built in Melbourne".
- **Excluded and parked:**
  - **"tradie website" (1,600):** search intent is unclear (it looks like people searching for a specific site). It's a possible supporting phrase only, and its volume doesn't count toward this page.
  - **"australian tradies" (1,300):** irrelevant.
- **AI receptionist for tradies (40):** a different buyer need from websites, so it isn't this page's primary.
  - Map it only if Aperix really offers an AI receptionist service, and only after both reviewers agree.
  - Don't invent a slug for it. Record it as a decision point.

### 3.5 `/custom-software-development` (proposed, staged P3)
- **Buyer intent:** commission custom software, a web app or a SaaS product.
- **Primary:** custom software development melbourne (50).
- **Secondary:** software development companies melbourne (140).
- **Low volume, but high commercial value.**
- **Proof:** POV Sync for web app/SaaS work. Confirm what it is from the repo or the live /our-work page.
- **Don't target:** salary, jobs or "software companies" employer searches.
- **Draft H1:** "Custom software development in Melbourne".
- **To verify:** whether existing "Web apps & SaaS" or "Software development" content on /services already covers this, so the two pages don't compete.

### 3.6 Pricing FAQ (owner: `/services`, recommended)
- **Buyer intent:** understand the cost before enquiring.
- **Primary:** small business website design packages (210).
- **Secondary:** website design melbourne price (50); how much does a website cost per month (50); average cost of website design for small business australia (40).
- **Purpose:** explain how pricing works, and upfront build cost versus ongoing hosting and care. Use real ranges only if the founders supply them.
- **Decision:** one owner only. This brief recommends /services. Home can keep its short "How does pricing work?" answer and link to /services.
- **Don't:** create a separate pricing page or make up numbers.

### 3.7 Supporting pages (existing; no generic commercial target)
- **`/our-work`:**
  - Proof and case studies: Nails by Avy (booking), The Hidden Chapter (ecommerce), POV Sync, Complete Trade Solutions, National Roofing Solutions.
  - Link each case study to its service page.
- **`/about`:** brand and team trust, "two developers, one studio".
- **`/contact`:** contact intent. Being short is fine.

### 3.8 Not mapped now

| Keyword | Volume | Decision |
|---|---|---|
| web design / website design | 5,400 each | Too broad and nationwide. No page. |
| web designer | 2,900 | Broad. Home can cover it naturally. |
| website designer near me | 1,600 | Depends on the searcher's location. Home covers it. |
| web designing company | 720 | Broad. No page. |
| salon website design and variants | about 10 each | No page for now. Nails by Avy stays a case study. Revisit if Search Console shows demand. |

---

## 4. Context, not to be repeated in the doc

- **Search Console (5 Aug–5 Nov 2026, Google Pacific dates):** 4 clicks and 25 impressions. The only query Google disclosed was "aperix". This is a tiny sample, and Google hides most queries for privacy.
- **Raw HTML:** on 8 Nov the home page's raw HTML linked only to `/`. Menus added by JavaScript may not show up there.
- **Other tasks:** SEO-03 (navigation) and SEO-04/05 (/services) depend on this map. Don't implement them here.

---

## 5. Acceptance checklist (Thomas and his teammate)

- [ ] The map is in the repo at the agreed docs path, with Cursor's repo observations.
- [ ] Every URL lists its status, intent, primary and secondary keywords, proof, purpose, what not to target and inbound links.
- [ ] Each selected keyword has exactly one primary owner, with no duplicate topic owners.
- [ ] Proposed slugs are checked against real routes, and existing equivalents are kept.
- [ ] No suburb or synonym pages, no made-up prices or outcomes, and no services Aperix doesn't offer.
- [ ] Decisions are recorded on: the pricing owner, the AI receptionist service, when the tradie page is built, and whether software is covered by /services or a dedicated page.
- [ ] New URLs are added to the sitemap only after the pages exist.
- [ ] Both founders have signed off, with names and date. Only then mark SEO-02 complete in Macro.
