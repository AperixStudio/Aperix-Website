"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

type HashLinkProps = ComponentProps<typeof Link>;

function scrollToHash(hash: string) {
  const target = document.getElementById(hash);
  if (!target) {
    return false;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${hash}`);
  return true;
}

export default function HashLink({ href, onClick, ...props }: HashLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) {
      return;
    }

    const url = typeof href === "string" ? href : (href.pathname ?? "");
    const hashIndex = url.indexOf("#");
    if (hashIndex === -1) {
      return;
    }

    const path = url.slice(0, hashIndex) || "/";
    const hash = url.slice(hashIndex + 1);
    const onTargetPage = window.location.pathname === path;

    if (onTargetPage && scrollToHash(hash)) {
      event.preventDefault();
    }
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
