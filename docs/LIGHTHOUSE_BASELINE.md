# Lighthouse Baseline — Aperix Studio

Record scores after each major release. Run in Chrome DevTools → Lighthouse (incognito, throttled).

**Production URL:** https://aperix.com.au  
**Last updated:** _Run after next deploy_

## Mobile

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | INP |
|------|-------------|---------------|----------------|-----|-----|-----|-----|
| Home `/` | — | — | — | — | — | — | — |
| Services `/services` | — | — | — | — | — | — | — |
| Contact `/contact` | — | — | — | — | — | — | — |

## Desktop

| Page | Performance | Accessibility | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| Home `/` | — | — | — | — |
| Services `/services` | — | — | — | — |

## Targets (Google ranking signals)

| Metric | Good |
|--------|------|
| LCP | ≤ 2.5 s |
| CLS | ≤ 0.1 |
| INP | ≤ 200 ms |
| Lighthouse SEO | ≥ 95 |
| Lighthouse Accessibility | ≥ 95 |

## Notes

- Home page includes WebGL hero + intro — expect lower mobile Performance than inner pages.
- Mobile background uses pre-rendered video (not live WebGL) to protect CWV.
- Re-run after: hero changes, new below-fold sections, font/asset changes.

## How to run

```bash
# Optional: CI-style capture with npx (requires Chrome)
npx lighthouse https://aperix.com.au --preset=desktop --output=html --output-path=./lighthouse-home-desktop.html
npx lighthouse https://aperix.com.au --screenEmulation.mobile=true --output=html --output-path=./lighthouse-home-mobile.html
```

Also monitor **Search Console → Experience → Core Web Vitals** for real-user data (CrUX).
