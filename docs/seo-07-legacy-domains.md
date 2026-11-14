# Legacy studio domains (SEO-07)

**Status:** decision recorded on 15 Nov 2026. Redirects are implemented in the same change, in `netlify.toml`. They apply on the live site only after Netlify publishes that file. SEO-08 records the curl results.

**Task:** SEO-07, decide what to do with `aperixstudio.com.au` and `aperixstudio.com`. SEO-08 implements the approved map.

**Live site:** https://aperix.com.au

**Checked:** 15 Nov 2026, against the live hosts.

---

## Decision

Retire both apex domains and redirect them to the same path on `https://aperix.com.au`.

Reason: both hostnames serve this same Next.js site. They are not a separate site, and they are not used for email. Leaving them as normal 200 responses keeps a second copy of every URL.

---

## Ownership

| Domain | What the public record shows |
|---|---|
| `aperixstudio.com.au` | Registrant Harrison Natoli, ABN 22720293315, sole trader. Same registrant and ABN as `aperix.com.au`. Registrar Synergy Wholesale. Nameservers `kipp.ns.cloudflare.com` and `martha.ns.cloudflare.com`. |
| `aperixstudio.com` | Registered 12 Mar 2026, expires 12 Mar 2027. Reseller VentraIP. Nameservers `decker.ns.cloudflare.com` and `jocelyn.ns.cloudflare.com`. Public registrant is Domain Privacy. |

VentraIP login confirmation for `aperixstudio.com` (account holder):

| Confirmed by | Date | Account holder |
|---|---|---|
| | | |

That blank row does not block the redirect. The hostname is already attached to this Netlify site. The row is here so the registrar login can be written down when someone opens the VentraIP account.

---

## What each domain was doing

`https://aperixstudio.com.au` and `https://aperixstudio.com` returned 200 with no redirect to `aperix.com.au`. HTTP on each host redirected only to HTTPS on that same host.

Both hosts resolve to the same Netlify addresses as `aperix.com.au` (`75.2.60.5` and `99.83.231.61`) and serve this app. Pages already canonicalise to the matching `https://aperix.com.au` URL.

`www.aperixstudio.com.au` and `www.aperixstudio.com` have no DNS records. They stay that way. This change does not add `www` records.

Instagram and LinkedIn URLs that contain `aperixstudio` are social profiles. They are not these domains.

---

## Mail and DNS

Neither studio domain has MX, TXT, DMARC, or `mail.` records.

`aperix.com.au` mail stays where it is:

- MX: Google (`aspmx.l.google.com` and the `alt` Google servers)
- TXT: Google site verification, and SPF including Cloudflare, Resend, and Google

The redirects are HTTP rules only. They do not change DNS. `hello@aperix.com.au` is not moved.

---

## Path map

Each path 301s to the same path on `https://aperix.com.au`. The query string is kept.

| Studio path | Destination |
|---|---|
| `/` | `https://aperix.com.au/` |
| `/services` | `https://aperix.com.au/services` |
| `/our-work` | `https://aperix.com.au/our-work` |
| `/about` | `https://aperix.com.au/about` |
| `/contact` | `https://aperix.com.au/contact` |
| `/ecommerce-websites` | `https://aperix.com.au/ecommerce-websites` |
| `/web-design-for-tradies` | `https://aperix.com.au/web-design-for-tradies` |
| `/custom-software-development` | `https://aperix.com.au/custom-software-development` |
| `/app-development` | `https://aperix.com.au/app-development` |
| `/forum` | `https://aperix.com.au/forum` |
| `/current` | `https://aperix.com.au/current` |
| `/dev` | `https://aperix.com.au/dev` |
| `/sitemap.xml` | `https://aperix.com.au/sitemap.xml` |
| `/robots.txt` | `https://aperix.com.au/robots.txt` |

These paths returned 200 on both studio hosts on 15 Nov 2026. `/dev` is listed because it is served, not because it should be indexed.

**Paths with no equivalent:** 301 to that same path on `https://aperix.com.au`, query string kept. The canonical host then returns its own 404. Example: `/does-not-exist-seo07` goes to `https://aperix.com.au/does-not-exist-seo07`. It does not go to `/`.

`https://aperix.com.au` is not redirected. A rule on that host would loop.

---

## How the redirect behaves

HTTPS on a studio host is one 301 to the same path on `https://aperix.com.au`.

HTTP is two hops. Netlify upgrades HTTP to HTTPS on the same host first, then the host rule sends that HTTPS request to `aperix.com.au`. The final URL is the mapped one. There is no loop. Collapsing the first hop would mean proxying the domains through Cloudflare, which this task does not do.

`www` does not resolve, so there is nothing to redirect.

---

## Sign-off

Thomas approved this retire-and-redirect decision by asking for it to be implemented on 15 Nov 2026. The teammate line is still open. The redirects do not wait on that line.

| | Name | Date |
|---|---|---|
| Founder | Thomas | 15 Nov 2026 |
| Teammate | | |
