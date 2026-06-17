export const MELBOURNE_TIMEZONE = "Australia/Melbourne";

export type MelbourneTimeParts = {
  hours: string;
  minutes: string;
  seconds: string;
  timeZoneName: string;
};

export function getMelbourneTimeParts(date = new Date()): MelbourneTimeParts {
  const timeParts = new Intl.DateTimeFormat("en-AU", {
    timeZone: MELBOURNE_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    timeParts.find((part) => part.type === type)?.value ?? "00";

  const timeZoneName =
    new Intl.DateTimeFormat("en-AU", {
      timeZone: MELBOURNE_TIMEZONE,
      timeZoneName: "short",
    })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value ?? "Melbourne";

  return {
    hours: read("hour"),
    minutes: read("minute"),
    seconds: read("second"),
    timeZoneName,
  };
}

export function formatMelbourneFlipClock(parts: MelbourneTimeParts) {
  return `${parts.hours}:${parts.minutes}:${parts.seconds}`;
}
