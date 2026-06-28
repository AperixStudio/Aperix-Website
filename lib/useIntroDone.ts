"use client";

import { useEffect, useState } from "react";
import { introHasPlayed, onIntroDone } from "@/components/animations/IntroScreen";

/**
 * True once the Aperix intro loading screen has finished (or was skipped).
 * Defaults to `introHasPlayed` so repeat visits / dev skips mount immediately.
 */
export function useIntroDone(): boolean {
  const [introDone, setIntroDone] = useState(introHasPlayed);

  useEffect(() => {
    if (introHasPlayed) {
      setIntroDone(true);
      return undefined;
    }

    return onIntroDone(() => {
      setIntroDone(true);
    });
  }, []);

  return introDone;
}
