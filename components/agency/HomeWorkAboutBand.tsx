"use client";

import { useRef, type ReactNode } from "react";
import WorkCursorLens from "@/components/agency/WorkCursorLens";
import "./HomeWorkAboutBand.css";

/**
 * Binds Our Work and About us into one atmospheric band.
 *
 * The slab, the dissolving pixel grid and the cursor lens all live here
 * rather than inside Our Work, so they share a single coordinate space that
 * spans both sections. That is what lets the grid hang past the Work
 * section's bottom edge as a background for About, and lets the lens keep
 * tracking the cursor across the boundary without a seam.
 *
 * Both sections come in as props rather than being imported here, so they
 * stay server-rendered despite this wrapper being a client component.
 */
export default function HomeWorkAboutBand({
  work,
  about,
}: {
  work: ReactNode;
  about: ReactNode;
}) {
  const bandRef = useRef<HTMLDivElement>(null);
  const workRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={bandRef} className="home-band">
      <WorkCursorLens containerRef={bandRef} slabRef={workRef} />

      <div ref={workRef} className="home-band__work">
        {work}
      </div>
      <div className="home-band__about">{about}</div>
    </div>
  );
}
