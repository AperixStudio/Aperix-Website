# GA4 enquiry conversion (SEO-09)

**Status:** ready to deploy on 15 Nov 2026. Measurement ID `G-7ZB0J7JTHC`. The privacy policy and the tag are in the repo. The tag loads only on `aperix.com.au` and `www.aperix.com.au`, after this change is published.

**Task:** SEO-09, decide how enquiry conversions are counted on https://aperix.com.au.

**Live site:** https://aperix.com.au

**Checked:** 15 Nov 2026, against the live homepage and this repo.

---

## Decision

Keep the existing Search Console property. The Google login already has an Analytics account for the app. Add one new website property on that same Analytics account. Leave the app property as it is. Do not create a second Analytics account, and do not add `aperix.com.au` as a stream on the app.

One enquiry is one successful delivery of the contact briefing. Email clicks and phone clicks are separate events and are not that conversion. No name, email, or phone from the form is sent to analytics. There is no cookie banner in this phase. The privacy policy is updated before the tag ships.

---

## Does GA4 exist?

The tag does not. The live homepage has no `gtag`, no `G-` measurement ID, no Google Tag Manager container, and no `dataLayer`. This repo has no analytics script in `app/layout.tsx` and no measurement ID in env or source. `docs/SEARCH_CONSOLE_HANDOVER.md` treats a GA4 link as optional.

The live page does load Netlify’s RUM script at `/.netlify/scripts/rum`. That is Netlify performance monitoring, not GA4. The privacy policy already describes Netlify Analytics as anonymous and cookieless.

Confirmed on 15 Nov 2026: Search Console exists for the studio. Analytics on this login already held the app. A separate website property was added beside it. Search Console counts Google search clicks. It cannot count form submissions. The app property stays separate so app events and website enquiries are not counted together.

The website stream, confirmed from the Analytics screen on 15 Nov 2026, is stream name Aperix Studio, stream URL `https://aperix.com.au/`, stream ID `16343048853`, measurement ID `G-7ZB0J7JTHC`. The tag is in this repo and reaches the live site on the next deploy. Until then the stream can still say “No data received”.

Enhanced measurement on that stream is page views only. Form interactions, scrolls, outbound clicks, site search, video engagement, and file downloads are off. Confirmed 15 Nov 2026.

Search Console → Settings → Associations, confirmed 15 Nov 2026, lists one Google Analytics GA4 service: account Aperix Studio, data stream Aperix Studio, URL `https://aperix.com.au/`. There are no pending requests. That is this website stream, not the app.

Still to confirm on that website property only, not on the app:

- Google signals are off. Ads personalization is off. No user-id. Data retention is 14 months.
- The tag in the site is direct `gtag.js` for `G-7ZB0J7JTHC`, not Tag Manager. It was not pasted in from the Analytics setup screen.

| Item | Value |
|---|---|
| Analytics account | The existing account that already holds the app |
| Website property | Aperix Studio website, beside the app |
| Stream name | Aperix Studio |
| Stream ID | `16343048853` |
| Measurement ID | `G-7ZB0J7JTHC` |
| Data stream URL | `https://aperix.com.au/` |

---

## What counts as one enquiry

One enquiry is one successful delivery of the contact briefing. It is not a button click, not a step change, and not the thank-you screen by itself.

The form is `components/agency/ContactForm.tsx`. It is a four-step briefing (need, timing, name, email, optional phone) posted to `POST /api/contact`. `app/api/contact/route.ts` returns success only after the enquiry email is sent. The same form is mounted on `/`, `/contact`, `/services`, `/our-work`, and `/current`.

**Key event (the only conversion): `generate_lead`**

Fire it in `submitDraft` only after all of this is true:

- The honeypot branch has already returned. That branch shows a fake success and never calls the API. It must not count.
- `fetch("/api/contact")` returned `response.ok`.
- The call sits on that success path only, once. Continue, chip selection, “Prefer a call?”, and the final “Send enquiry” click do not fire it. A failed request, a 429, or a network error does not fire it.
- A second real submission, after a new page load, is a second enquiry and should count. Do not dedupe across visits.

Do not also send the event from the API route. Client-only, one call site.

Allowed parameters, all non-identifying:

| Parameter | Values |
|---|---|
| `form_id` | `contact_briefing` |
| `page_path` | `/`, `/contact`, `/services`, `/our-work`, or `/current` |
| `lead_need` | `New website`, `Mobile app`, `Custom software`, or `Other` |
| `lead_timing` | `ASAP`, `This quarter`, or `Just looking` |
| `prefer_call` | `true` or `false` (the choice, never the number) |

Never send name, email, phone, the honeypot field, free text, the thank-you first name, or `requestId`. The API currently logs name and email on the server. That pattern stays out of analytics. Do not attach form fields to the GA user or as user-provided data.

---

## Other channels, counted separately

These are events, not key events. They never increment the enquiry conversion. Someone who clicks email and also submits the form is one enquiry plus one email click.

**`contact_email`** on click of a `mailto:` link. Parameter `link_location` only, not the address.

| `link_location` | Where |
|---|---|
| `contact_form` | `components/agency/ContactForm.tsx` |
| `footer` | `components/agency/Footer.tsx` |
| `privacy_policy` | Privacy modal in `components/agency/Footer.tsx` |
| `accessibility` | Accessibility modal in `components/agency/Footer.tsx` |
| `error_page` | `app/error.tsx` |

**`contact_phone`** on click of a `tel:` link. Parameter `line` only: `harrison`, `tom`, or `receptionist`. Never the digits.

| `line` | Where |
|---|---|
| `harrison` | Footer, from `lib/siteBusiness.ts` |
| `tom` | Footer, from `lib/siteBusiness.ts` |
| `receptionist` | Hero orb in `components/agency/HeroReceptionistOrb.tsx`, and the services AI-receptionist block in `lib/services-content.ts`. This is the product demo line, so it stays off the enquiry conversion. |

Turning off enhanced-measurement outbound clicks is what stops GA4 from also recording those same links as generic `click` events.

Page views are not enquiries. When the tag is added, client-side route changes in the App Router need their own `page_view`, because the default tag only fires on the first full load.

---

## Consent

Australia does not require a cookie banner for first-party analytics on your own site. The Privacy Act and the Australian Privacy Principles do require the privacy policy to be accurate at the time of collection. This site already says it follows those principles.

- No consent banner in this phase.
- No Consent Mode. That only becomes necessary if Google Ads later target the EEA or UK.
- The privacy policy copy now names Google Analytics 4. It reaches the live site on the next deploy. The tag is still not in the code.
- Signals, ads personalization, user-id, and enhanced conversions stay off, so the cookie is a first-party analytics cookie (`_ga`, `_ga_<stream>`) and not an advertising cookie.

---

## Privacy policy

Updated in the privacy modal in `components/agency/Footer.tsx` on 15 Nov 2026, at Thomas's request. Last updated is 15 November 2026. The live site shows the previous policy until this file is deployed.

- Section 3 names Netlify Analytics and Google Analytics 4. It names the `_ga` and `_ga_7ZB0J7JTHC` cookies, and says name, email, and phone from the form are not sent to Google.
- Section 4 no longer says Netlify Forms. Enquiries go through this website and are emailed with Resend.
- Section 6 says the Google Analytics cookie is a first-party analytics cookie, and that the site does not use advertising or cross-site tracking cookies.
- Section 7 names Google and Resend, with links to their privacy policies, and keeps the note that some processing happens in the United States.

---

## What is included in this deploy

- The website tag is `G-7ZB0J7JTHC`, loaded from `components/analytics/GoogleAnalytics.tsx`. The app property is unchanged.
- `generate_lead` fires once per successful `/api/contact` delivery, never on a click and never for the honeypot.
- `contact_email` and `contact_phone` are separate events and are not conversions.
- No personal details from form fields go to analytics.
- No cookie banner. Privacy policy sections 3, 4, 6, and 7 go live with this deploy.

After the first real enquiry arrives, mark `generate_lead` as the only key event in Analytics: Admin → Events. Email and phone events stay unmarked.

---

## Sign-off

Thomas approved this written plan on 15 Nov 2026. The teammate approved adding the tag on the same day. The name was not recorded.

| | Name | Date |
|---|---|---|
| Founder | Thomas | 15 Nov 2026 |
| Teammate | Approved | 15 Nov 2026 |
