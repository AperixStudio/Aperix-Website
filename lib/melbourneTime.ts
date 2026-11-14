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

export type MelbourneClockFace = MelbourneTimeParts & {
  day: string;
  month: string;
  weekday: string;
};

export function getMelbourneClockFace(date = new Date()): MelbourneClockFace {
  const time = getMelbourneTimeParts(date);
  const dateParts = new Intl.DateTimeFormat("en-AU", {
    timeZone: MELBOURNE_TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "short",
  }).formatToParts(date);

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    dateParts.find((part) => part.type === type)?.value ?? "";

  const hourNumber = Number(time.hours);
  const hours = String(Number.isFinite(hourNumber) ? hourNumber % 24 : 0).padStart(2, "0");

  return {
    ...time,
    hours,
    minutes: time.minutes.padStart(2, "0"),
    day: read("day"),
    month: read("month").replace(".", "").slice(0, 3).toUpperCase(),
    weekday: read("weekday").toUpperCase(),
  };
}
