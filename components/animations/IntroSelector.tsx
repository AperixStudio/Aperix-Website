"use client";

import { usePathname } from "next/navigation";
import IntroScreen from "./IntroScreen";
import IntroScreenSimple from "./IntroScreenSimple";

/**
 * Picks the right intro screen based on the current route.
 *
 * /current  → original full glitch intro (for comparison)
 * everywhere else → new clean logo + name intro
 */
export default function IntroSelector() {
  const pathname = usePathname();

  if (pathname.startsWith("/current")) {
    return <IntroScreen />;
  }

  return <IntroScreenSimple />;
}
