import type { MetadataRoute } from "next";
import { SITE_LOCALITY } from "@/lib/siteBusiness";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aperix Studio",
    short_name: "Aperix",
    description:
      "Custom web development and software for Melbourne businesses — hand-coded, fast, and built to last.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c1017",
    theme_color: "#0c1017",
    lang: SITE_LOCALITY.htmlLang,
    icons: [
      {
        src: "/aperix-logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
