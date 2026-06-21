"use client";

import dynamic from "next/dynamic";

const HeroTheatreClient = dynamic(() => import("./HeroTheatreClient"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center text-agency-ink">
      Loading Theatre.js hero editor…
    </div>
  ),
});

export default function HeroTheatrePage() {
  return <HeroTheatreClient />;
}
