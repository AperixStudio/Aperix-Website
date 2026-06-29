# Google Search Console — Aperix Studio Handover

Complete these steps after deploying to production (`https://aperix.com.au`).

## 1. Verify the property

**Option A — HTML file (current setup):** Place Google's file in `public/` so it is live at:

- `https://aperix.com.au/google9134aa3e65faee2c.html`

After deploy, click **Verify** in Search Console.

**Option B — Domain property (recommended long-term):**

1. Open [Google Search Console](https://search.google.com/search-console)
2. Add property → **Domain** → `aperix.com.au`
3. Add the DNS TXT record Google provides at your domain registrar
4. Wait for verification (usually minutes to a few hours)

**Option C:** URL-prefix property with HTML meta tag in `app/layout.tsx` if neither above is possible.

## 2. Submit sitemaps

In Search Console → **Sitemaps**, submit:

- `https://aperix.com.au/sitemap.xml`
- `https://aperix.com.au/image-sitemap.xml`

## 3. Request indexing

Use **URL Inspection** for:

- `https://aperix.com.au/`
- `https://aperix.com.au/services`
- `https://aperix.com.au/our-work`
- `https://aperix.com.au/about`
- `https://aperix.com.au/contact`

Click **Request indexing** for each after confirming “URL is on Google” or fixing any reported issues.

## 4. Link Google Analytics (if used)

Search Console → **Settings** → **Associations** → link GA4 property.

## 5. Enable email alerts

Search Console → **Settings** → **Users and permissions** → ensure the client email receives critical issue alerts.

## 6. Post-launch checks (week 1)

- [ ] **Pages** report — no unexpected “Excluded” or “Error” URLs
- [ ] **Core Web Vitals** — review mobile + desktop field data when available
- [ ] **Rich results** — validate `/services` FAQ and `/contact` LocalBusiness in [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] **Manual search** — `site:aperix.com.au` shows all key pages

## Credentials to hand over

| Item | Value |
|------|-------|
| Property URL | `https://search.google.com/search-console` |
| Verified domain | `aperix.com.au` |
| Sitemaps | `/sitemap.xml`, `/image-sitemap.xml` |
| Primary contact email | hello@aperix.com.au |

---

*Update this doc when verification method or sitemap URLs change.*
