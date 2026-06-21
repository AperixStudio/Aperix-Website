"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const HeroCaptureClient = dynamic(() => import("./HeroCaptureClient"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-[#0c1017] font-mono text-sm text-white/70">
      Loading hero capture…
    </div>
  ),
});

export default function HeroCapturePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0c1017] font-mono text-sm text-white/70">
          Loading hero capture…
        </div>
      }
    >
      <HeroCaptureClient />
    </Suspense>
  );
}
