# Nail Salon Website — Project Startup Guide

Blueprint for a **new client project** with the **same architecture and organisation as Aperix Studio**, styled like premium AU beauty retail ([Fenty Beauty AU](https://fentybeauty.com/en-au), [MECCA](https://www.mecca.com/en-au/), [kit: skinkind](https://kitskinkind.com.au/)), with **Google Calendar** as the booking backbone.

Copy this file into the new repo root when you scaffold the project. Treat Aperix as the reference implementation.

---

## 1. Project snapshot

| Field | Fill in |
|-------|---------|
| **Client / salon name** | _e.g. Studio Name Nails_ |
| **Domain** | _e.g. studionamenails.com.au_ |
| **Location** | _Suburb, VIC, Australia_ |
| **Primary CTA** | Book appointment (Google Calendar) |
| **Stack** | Next.js App Router · TypeScript · Tailwind CSS v4 · Framer Motion |
| **Booking** | Google Calendar Appointment Schedules (+ optional API later) |
| **Deploy** | Vercel or Netlify (Node-compatible Next.js) |
| **Locale** | `en-AU` |

---

## 2. Visual direction (beauty retail, not agency dark-room)

Blend three references — don’t clone any one site.

### From Fenty Beauty AU
- **Promo strip** above nav (today’s offer, hours, or “New gel collection”).
- **Bold, confident typography** for heroes; short punchy headlines.
- **Category-led shopping mental model** → map to **service categories** (Gel, BIAB, Acrylic, Pedicure, Add-ons).
- High-contrast CTAs; “Shop now” language becomes **“Book now”**.

### From MECCA
- **Premium, clean layout** — generous whitespace, editorial photography.
- **Mega-menu feel** for services (grouped, scannable).
- **Services & events** pattern → **Services + Aftercare + Policies**.
- Trust row: reviews count, location, hours, “Book in-store / online”.
- Skip to main content; accessible nav.

### From kit: skinkind
- **Soft, modern wellness** — muted base (cream, warm grey, off-white) + one accent (nude blush, soft brown, or deep espresso).
- **Lowercase or mixed-case wordmark** if it fits the brand (optional).
- **Social proof in hero** — ★★★★★ quote + link to Google reviews or Instagram.
- **“Fan favourites” carousel** → **Signature sets** (e.g. “The Classic Mani”, “BIAB Refresh”, “Event Ready”).

### Nail-salon UI tokens (starting point)

```css
/* Suggested starting palette — tune per brand */
--salon-bg: #faf8f6;
--salon-surface: #ffffff;
--salon-text: #1a1a1a;
--salon-muted: #6b6560;
--salon-accent: #c4a484;        /* nude gold */
--salon-accent-dark: #8b6914;
--salon-border: #ebe6e1;
--salon-ink: #121212;             /* Fenty-like contrast for buttons */
```

- **Photography**: hands/nails, studio interior, tool flat-lays — never stock-only if client can shoot once.
- **Motion**: subtle fade/slide (Framer Motion); respect `prefers-reduced-motion`.
- **No WebGL hero required** — this project should stay **lighter than Aperix** (image/video hero + optional subtle gradient atmosphere).

---

## 3. Repository structure (mirror Aperix)

Use the same conventions as Aperix so you can reuse patterns, SEO checklist, and CI.

```
nail-salon/
├── app/
│   ├── layout.tsx                 # Root metadata, schema graph, SkipToContent
│   ├── page.tsx                   # Home
│   ├── globals.css                # Design tokens + Tailwind v4
│   ├── icon.svg
│   ├── apple-icon.tsx
│   ├── manifest.ts
│   ├── opengraph-image.tsx
│   ├── twitter-image.tsx
│   ├── robots.ts
│   ├── sitemap.ts
│   ├── image-sitemap.xml/route.ts
│   ├── not-found.tsx
│   ├── error.tsx
│   ├── loading.tsx
│   ├── about/page.tsx
│   ├── services/page.tsx          # Full menu + prices (or /menu)
│   ├── book/page.tsx              # Booking hub → Google Calendar
│   ├── gallery/page.tsx           # Portfolio / Instagram grid
│   ├── contact/page.tsx           # Enquiry form (non-booking questions)
│   ├── policies/page.tsx          # Cancellation, late policy, patch test
│   └── api/
│       ├── contact/route.ts       # Resend (same pattern as Aperix)
│       └── book/                  # Optional Phase 2 — Calendar API webhook
│           └── route.ts
├── components/
│   ├── layout/
│   │   └── SkipToContent.tsx
│   ├── salon/                     # Domain components (Aperix uses agency/)
│   │   ├── SalonNav.tsx
│   │   ├── PromoBar.tsx
│   │   ├── HeroEditorial.tsx
│   │   ├── ServiceCategoryGrid.tsx
│   │   ├── SignatureSetsCarousel.tsx
│   │   ├── BookCTA.tsx
│   │   ├── GalleryGrid.tsx
│   │   ├── ReviewsStrip.tsx
│   │   ├── HoursLocation.tsx
│   │   ├── FAQSection.tsx
│   │   └── Footer.tsx
│   └── ui/                        # Button, Accordion, Badge (reuse Aperix ui/)
├── lib/
│   ├── site.ts                    # SITE_NAME, URL, email, socials
│   ├── siteBusiness.ts            # Address, geo, hours, Google Place ID
│   ├── services-content.ts        # Services, durations, prices (AUD)
│   ├── booking.ts                 # Google Calendar URLs + env helpers
│   ├── contactSchema.ts
│   ├── contactEmail.ts
│   ├── contactRateLimit.ts
│   ├── schema/siteSchema.ts
│   ├── seo/pageMetadata.ts
│   └── og/SalonOgImage.tsx
├── docs/
│   ├── SEARCH_CONSOLE_HANDOVER.md
│   └── LIGHTHOUSE_BASELINE.md
├── public/
│   ├── llms.txt
│   └── google*.html               # Search Console verification
├── TECHNICAL_SEO_CHECKLIST.md     # Copy from Aperix; re-audit per client
├── .env.example
├── .github/workflows/ci.yml
├── package.json
└── README.md
```

### Aperix → Salon naming map

| Aperix | Nail salon |
|--------|----------------|
| `components/agency/` | `components/salon/` |
| `/services` (agency packages) | `/services` (treatment menu + prices) |
| `/our-work` | `/gallery` |
| `/contact` | `/contact` + **`/book`** |
| HeroV4 / Unicorn | **HeroEditorial** (static image or short loop video) |
| `lib/services-content.ts` | Same file role — nail tiers & add-ons |
| IntroScreen (optional) | **Skip** for v1, or 1s logo fade only |

---

## 4. Page map & content requirements

| Route | Purpose | SEO focus |
|-------|---------|-------------|
| `/` | Hero, signature sets, book CTA, reviews, hours snippet | “nail salon [suburb]” |
| `/services` | Full menu: categories, duration, price, what’s included | Service + Offer schema |
| `/book` | How to book, policies summary, **Google Calendar embed/link** | Book action |
| `/gallery` | Work portfolio (ImageObject / image sitemap) | Visual trust |
| `/about` | Story, techs, hygiene, training | AboutPage + Person (optional) |
| `/contact` | Form: name, email, phone, message (not a substitute for booking) | ContactPage |
| `/policies` | Cancel / late / deposit / patch test | FAQPage snippets |

**Primary user journey:** Land → pick service → **Book** (Google Calendar) → confirmation email from Google.

**Secondary journey:** Question / corporate / allergy → **Contact form**.

---

## 5. Google Calendar booking system

You asked for **Google Calendar** specifically — not Calendly-as-primary. Use a phased approach.

### Phase 1 — Launch (recommended MVP)

Use **Google Calendar Appointment Schedules** (Google account → Calendar → Appointment schedules).

1. Create one schedule per **staff member** OR one schedule with **multiple appointment types** (if your Google plan supports it).
2. Set **duration**, **buffer**, **availability**, **location** (salon address or “Google Meet” if irrelevant).
3. Copy the **public booking page URL** for each schedule.
4. On `/book`:
   - Primary button: **“Book online”** → opens schedule URL (same tab or new tab).
   - List which service maps to which link (e.g. Gel Full Set → 90 min schedule).
5. Add **`lib/booking.ts`**:

```ts
export const BOOKING_LINKS = {
  default: process.env.NEXT_PUBLIC_GOOGLE_BOOKING_URL!,
  gelMani: process.env.NEXT_PUBLIC_GOOGLE_BOOKING_GEL_MANI_URL,
  biab: process.env.NEXT_PUBLIC_GOOGLE_BOOKING_BIAB_URL,
  // ...
} as const;
```

6. Optional: **embed** if Google provides iframe for appointment page — test on mobile; often **link-out is more reliable** than embed.

**Pros:** Free/low friction, no custom auth, confirmations/reminders from Google.  
**Cons:** Less “on-brand” UI; limited multi-service cart; branding is Google’s unless you skin the surrounding page.

### Phase 2 — In-site selection (still Google-backed)

- `/book` UI: user picks **service + preferred day** (display only).
- CTA still deep-links to the correct Appointment Schedule with query params if supported, or pre-filled service label in instructions.
- Show **salon policies** checkbox copy (“By booking you agree to…”).

### Phase 3 — Google Calendar API (custom)

Only if client needs **true in-site booking** without leaving the site.

| Piece | Notes |
|-------|--------|
| **Google Cloud project** | Calendar API enabled |
| **OAuth or service account** | Service account only works easily with **Google Workspace** shared calendar; consumer Gmail needs OAuth per staff |
| **Server route** | `app/api/book/route.ts` creates event on staff calendar |
| **Slots** | Read free/busy via `freebusy.query` — respect buffers |
| **Confirmations** | Google sends invite; optionally duplicate notify via Resend |

Document in `.env.example`:

```bash
# Phase 1 — public appointment schedule URLs (required for launch)
NEXT_PUBLIC_GOOGLE_BOOKING_URL=https://calendar.google.com/calendar/appointments/...

# Phase 3 — only if building API integration
GOOGLE_CALENDAR_ID=...
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

**Recommendation:** Ship **Phase 1** for the salon launch; quote Phase 3 as a paid upgrade if they outgrow link-based booking.

### Booking vs contact (important)

| Channel | Use for |
|---------|---------|
| **Google Calendar** | Actual appointments |
| **Contact form** | Allergies, group bookings, press, “which service should I pick?” |
| **Phone** | Same as today — click-to-call in header |

Do **not** promise instant booking in the contact form API unless you wire Calendar API.

---

## 6. `lib/services-content.ts` (nail menu)

Same pattern as Aperix pricing tiers — structured data friendly.

```ts
export type NailService = {
  id: string;
  name: string;
  category: "gel" | "biab" | "acrylic" | "pedicure" | "add-on";
  durationMinutes: number;
  priceAud: string;           // "$65" — display
  priceAudNumeric: number;    // schema / sorting
  summary: string;
  bookingUrlKey?: keyof typeof BOOKING_LINKS;
  popular?: boolean;
};
```

Categories in nav (Mecca-style):

- **New + Popular** (signature sets)
- **Gel**
- **BIAB / Builder**
- **Acrylic**
- **Pedicure**
- **Add-ons** (nail art, removal, repair)

Include **GST note** if applicable (same as Aperix services page: “Prices in AUD”).

---

## 7. SEO & local (copy Aperix setup)

Copy **`TECHNICAL_SEO_CHECKLIST.md`** from Aperix into the new repo and complete it for the salon.

### Salon-specific schema (`lib/schema/siteSchema.ts`)

| Type | Use |
|------|-----|
| **BeautySalon** or **NailSalon** (LocalBusiness subtype) | Home + contact |
| **PostalAddress + GeoCoordinates** | Physical studio |
| **OpeningHoursSpecification** | Tue–Sat hours in schema |
| **Service + Offer** | Each major treatment on `/services` |
| **FAQPage** | Policies + “how long does gel last?” |
| **AggregateRating** | Only when real Google Business reviews exist |

### Local SEO essentials

- [ ] **Google Business Profile** — same NAP as website + schema
- [ ] **`NEXT_PUBLIC_SITE_URL`** set in production
- [ ] **`public/llms.txt`** — salon name, services, book URL, hours
- [ ] Image sitemap for gallery nails photos

---

## 8. Environment variables (`.env.example`)

```bash
# Site
NEXT_PUBLIC_SITE_URL=https://example.com.au

# Contact (Resend — same as Aperix)
RESEND_API_KEY=
CONTACT_TO_EMAIL=hello@salon.com.au
CONTACT_FROM_EMAIL=bookings@salon.com.au

# Booking — Google Calendar appointment schedules (Phase 1)
NEXT_PUBLIC_GOOGLE_BOOKING_URL=
NEXT_PUBLIC_GOOGLE_BOOKING_GEL_MANI_URL=
NEXT_PUBLIC_GOOGLE_BOOKING_BIAB_URL=

# Optional: Google Maps embed / Place ID for HoursLocation component
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=
NEXT_PUBLIC_GOOGLE_PLACE_ID=

# Optional: Instagram feed (Phase 2 — API or manual gallery)
# INSTAGRAM_ACCESS_TOKEN=
```

---

## 9. Scaffold checklist (day 1)

1. [ ] `npx create-next-app@latest` — TypeScript, App Router, Tailwind, ESLint (match Aperix versions when possible).
2. [ ] Copy from Aperix: `lib/seo/pageMetadata.ts`, `lib/schema/siteSchema.ts` (adapt types), `components/layout/SkipToContent.tsx`, `app/robots.ts`, `app/sitemap.ts` pattern, `docs/*`, CI workflow.
3. [ ] Create `lib/site.ts` + `lib/siteBusiness.ts` with real salon NAP.
4. [ ] Build **SalonNav** + **PromoBar** + **Footer** (hours, address, Book CTA, Instagram).
5. [ ] Home: HeroEditorial + SignatureSetsCarousel + ReviewsStrip + BookCTA.
6. [ ] `/services` from `services-content.ts`.
7. [ ] `/book` with Google Calendar links tested on iPhone + Android.
8. [ ] `/contact` + `api/contact` (copy Aperix route + rate limit).
9. [ ] Run `TECHNICAL_SEO_CHECKLIST.md` pass.
10. [ ] Deploy + Search Console + submit sitemaps.

---

## 10. Component behaviour notes (beauty UX)

| Component | Behaviour |
|-----------|-----------|
| **PromoBar** | Dismissible; “Book this week — 10% off BIAB” or hours; link to `/book`. |
| **SalonNav** | Sticky; **Book** button always visible (Fenty/Mecca CTA clarity). |
| **SignatureSetsCarousel** | kit:-style horizontal scroll; card = set name, from-price, duration, “Book”. |
| **ServiceCategoryGrid** | Mecca category tiles → `/services#gel`. |
| **ReviewsStrip** | Pull quote from Google or static until API; link to leave a review. |
| **HoursLocation** | Map embed + “Get directions”; schema matches visible hours. |
| **Gallery** | Lazy-loaded WebP; alt = “Gel manicure — [salon name]”. |

---

## 11. What to deliberately omit in v1

- Heavy intro animation (Aperix IntroScreen) — optional later.
- WebGL / Unicorn scenes — not needed for salon brand.
- E-commerce checkout — unless client sells gift cards (then Shopify link or Stripe later).
- Custom login / client accounts — Google Calendar handles identity for bookings.

---

## 12. Reference links

| Resource | URL |
|----------|-----|
| Fenty Beauty AU (promo, category nav, bold retail) | https://fentybeauty.com/en-au |
| MECCA AU (premium nav, services, editorial) | https://www.mecca.com/en-au/ |
| kit: skinkind (minimal wellness, social proof hero) | https://kitskinkind.com.au/ |
| Google Calendar Appointment schedules | Google Calendar → Create → Appointment schedule |
| Aperix SEO checklist (copy into repo) | `TECHNICAL_SEO_CHECKLIST.md` in this monorepo |

---

## 13. Client intake questions (before build)

1. Salon name, suburb, full address, phone, email, Instagram handle?
2. Opening hours + which days bookable?
3. Full service menu with **duration + price** (AUD)?
4. One or multiple nail techs (separate calendars)?
5. Google account for booking — who owns the calendar?
6. Cancellation / late / deposit policy text?
7. Patch test required for certain services?
8. Photos ready or need a shoot?
9. Google Business Profile already claimed?

---

*Template v1.0 — derived from Aperix Studio project structure. Update booking phase and palette when client signs off.*
