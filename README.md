# Aperix Portfolio

Marketing site and interactive demo showroom for Aperix Studio, built with Next.js App Router, TypeScript, Tailwind CSS v4, and Framer Motion.

## What’s Included

- Main marketing site for acquiring real clients
- Demo tiers under `/demo/*` for showcase conversations
- Production contact API backed by Resend
- Basic anti-spam protection with server-side validation and rate limiting
- CI pipeline for lint, test, and build verification

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template and fill in real values:

```bash
cp .env.example .env.local
```

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Required Environment Variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public canonical base URL, used for metadata, sitemap, and robots |
| `RESEND_API_KEY` | Resend API key used by `app/api/contact/route.ts` |
| `CONTACT_TO_EMAIL` | Inbox that receives new enquiries |
| `CONTACT_FROM_EMAIL` | Verified sender identity in Resend |

## Contact Flow

- The main form lives in `components/agency/ContactForm.tsx`
- Validation is shared via `lib/contactSchema.ts`
- Requests post to `app/api/contact/route.ts`
- Delivery uses Resend via `lib/contactEmail.ts`
- Rate limiting is handled in `lib/contactRateLimit.ts`

## Quality Checks

```bash
npm run lint
npm run test
npm run typecheck
npm run build
```

## Deployment Notes

- Deploy on a Node.js-compatible Next.js platform such as Vercel.
- Add the environment variables from `.env.example` in the hosting dashboard.
- Verify `CONTACT_FROM_EMAIL` is a verified Resend sender before going live.
- CI runs from `.github/workflows/ci.yml` on pushes and pull requests.
