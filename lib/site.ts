const DEFAULT_SITE_URL = "https://aperix.com.au";

export const SITE_NAME = "Aperix Studio";
export const SITE_EMAIL = "hello@aperix.com.au";
export const SITE_LOGO_PATH = "/aperix-logo.svg";
export const SITE_SOCIAL_LINKS = [
  "https://linkedin.com/company/aperixstudio",
  "https://instagram.com/aperixstudio",
];

export function getSiteUrl() {
  const rawValue = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!rawValue) {
    return DEFAULT_SITE_URL;
  }

  try {
    return new URL(rawValue).toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}
