"use client";

import type { ComponentProps } from "react";
import {
  trackContactEmail,
  trackContactPhone,
  type ContactEmailLocation,
  type ContactPhoneLine,
} from "@/lib/analytics";

type Shared = Omit<ComponentProps<"a">, "href"> & {
  href: string;
};

type TrackedContactLinkProps = Shared &
  (
    | { event: "contact_email"; location: ContactEmailLocation }
    | { event: "contact_phone"; line: ContactPhoneLine }
  );

export default function TrackedContactLink(props: TrackedContactLinkProps) {
  if (props.event === "contact_email") {
    const { event: _event, location, onClick, ...rest } = props;

    return (
      <a
        {...rest}
        onClick={(clickEvent) => {
          trackContactEmail(location);
          onClick?.(clickEvent);
        }}
      />
    );
  }

  const { event: _event, line, onClick, ...rest } = props;

  return (
    <a
      {...rest}
      onClick={(clickEvent) => {
        trackContactPhone(line);
        onClick?.(clickEvent);
      }}
    />
  );
}
