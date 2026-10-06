"use client";

import { useState, type CSSProperties } from "react";

type LiveSiteIframeProps = {
  src: string;
  title: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Scaled, non-interactive live-site preview. If the remote host blocks
 * framing (X-Frame-Options or CSP frame-ancestors), the iframe unmounts
 * so a fallback image underneath can show.
 */
export default function LiveSiteIframe({
  src,
  title,
  className,
  style,
}: LiveSiteIframeProps) {
  const [blocked, setBlocked] = useState(false);
  if (blocked) return null;

  return (
    <iframe
      src={src}
      title={title}
      className={className}
      style={style}
      tabIndex={-1}
      aria-hidden="true"
      sandbox={
        src.startsWith("/")
          ? "allow-scripts allow-same-origin allow-popups"
          : "allow-scripts allow-same-origin"
      }
      loading="eager"
      onError={() => setBlocked(true)}
      onLoad={(event) => {
        const frame = event.currentTarget;
        // First paint is often about:blank. Wait before treating that as a
        // frame-ancestors / X-Frame-Options block.
        window.setTimeout(() => {
          try {
            const href = frame.contentDocument?.location.href;
            if (!href || href === "about:blank") setBlocked(true);
          } catch {
            // Cross-origin load succeeded.
          }
        }, 600);
      }}
    />
  );
}
