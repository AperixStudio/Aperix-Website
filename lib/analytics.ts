/** Public GA4 measurement ID for the Aperix Studio website stream. */
export const GA_MEASUREMENT_ID = "G-7ZB0J7JTHC";

const PRODUCTION_HOSTS = new Set(["aperix.com.au", "www.aperix.com.au"]);

export const CONTACT_EMAIL_LOCATIONS = [
  "contact_form",
  "footer",
  "privacy_policy",
  "accessibility",
  "error_page",
] as const;

export const CONTACT_PHONE_LINES = ["harrison", "tom", "receptionist"] as const;

export type ContactEmailLocation = (typeof CONTACT_EMAIL_LOCATIONS)[number];
export type ContactPhoneLine = (typeof CONTACT_PHONE_LINES)[number];

export type GenerateLeadInput = {
  pagePath: string;
  leadNeed: string;
  leadTiming: string;
  preferCall: boolean;
};

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

export function analyticsHostAllowed(hostname: string) {
  return PRODUCTION_HOSTS.has(hostname);
}

export function buildGenerateLeadParams(input: GenerateLeadInput) {
  return {
    form_id: "contact_briefing",
    page_path: input.pagePath,
    lead_need: input.leadNeed,
    lead_timing: input.leadTiming,
    prefer_call: input.preferCall,
  } as const;
}

export function buildPageViewParams(origin: string, pagePath: string) {
  return {
    page_path: pagePath,
    page_location: `${origin}${pagePath}`,
    send_to: GA_MEASUREMENT_ID,
  } as const;
}

function sendEvent(name: string, params: Record<string, string | boolean>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  if (!analyticsHostAllowed(window.location.hostname)) {
    return;
  }

  window.gtag("event", name, params);
}

export function trackPageView(pagePath: string) {
  if (!pagePath.startsWith("/")) {
    return;
  }

  sendEvent("page_view", buildPageViewParams(window.location.origin, pagePath));
}

export function trackGenerateLead(input: GenerateLeadInput) {
  sendEvent("generate_lead", buildGenerateLeadParams(input));
}

export function trackContactEmail(location: ContactEmailLocation) {
  sendEvent("contact_email", { link_location: location });
}

export function trackContactPhone(line: ContactPhoneLine) {
  sendEvent("contact_phone", { line });
}
