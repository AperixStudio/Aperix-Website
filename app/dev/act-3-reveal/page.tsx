"use client";

import dynamic from "next/dynamic";

const PlaygroundClient = dynamic(() => import("./PlaygroundClient"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center text-agency-ink">
      Loading Act 3 reveal playground…
    </div>
  ),
});

export default function Act3RevealPlaygroundPage() {
  return <PlaygroundClient />;
}
