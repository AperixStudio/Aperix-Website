"use client";

import dynamic from "next/dynamic";

const PlaygroundClient = dynamic(() => import("./PlaygroundClient"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center text-agency-ink">
      Loading hero canvas playground…
    </div>
  ),
});

export default function HeroCanvasPlaygroundPage() {
  return <PlaygroundClient />;
}
