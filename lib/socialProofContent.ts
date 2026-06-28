/**
 * Social proof phrase content for SocialProofBoard.
 *
 * Single source of truth for the cycling messages shown in the airport-style
 * departure board on the homepage. Previously duplicated inline in SocialProofBar.
 *
 * SOCIAL_PROOF_MESSAGE_WIDTH is derived from the longest phrase so every row
 * renders the same number of flap cells — prevents horizontal layout jump on cycle.
 *
 * @see components/agency/SocialProofBoard.tsx
 * @see SOCIAL_PROOF_BOARD_IMPLEMENTATION_BRIEF.md
 */

/** Phrases cycled in the board's center "Message" column (display order). */
export const SOCIAL_PROOF_PHRASES = [
  "Business websites",
  "Web apps & SaaS",
  "Landing pages",
  "Multi-page sites",
  "Custom integrations",
  "Performance-first code",
  "No templates · no WP"
] as const;

/** Number of simultaneous phrase rows shown on the board (airport-style multi-line display). */
export const SOCIAL_PROOF_VISIBLE_ROWS = 3;

/** Character count of the longest phrase — used to pad shorter phrases with spaces. */
export const SOCIAL_PROOF_MESSAGE_WIDTH = SOCIAL_PROOF_PHRASES.reduce(
  (max, phrase) => Math.max(max, phrase.length),
  0,
);

/** City names shown in the destination column — uppercase on display. */
export const DEPARTURE_CITIES = [
  "BERLIN",
  "SYDNEY",
  "LONDON",
  "TOKYO",
  "PARIS",
  "NEW YORK",
  "DUBAI",
  "SINGAPORE",
  "OSLO",
  "ROME",
  "MADRID",
  "CHICAGO",
  "SEATTLE",
  "AUSTIN",
  "MIAMI",
  "ZURICH",
  "VIENNA",
  "LISBON",
  "DUBLIN",
  "BANGKOK",
] as const;

/** Four-character destination codes for mobile (airport-style abbreviations). */
export const DEPARTURE_CITY_CODES: Record<(typeof DEPARTURE_CITIES)[number], string> = {
  BERLIN: "BERL",
  SYDNEY: "SYDN",
  LONDON: "LOND",
  TOKYO: "TOKY",
  PARIS: "PARI",
  "NEW YORK": "NYC ",
  DUBAI: "DUBA",
  SINGAPORE: "SING",
  OSLO: "OSLO",
  ROME: "ROME",
  MADRID: "MADR",
  CHICAGO: "CHIC",
  SEATTLE: "SEAT",
  AUSTIN: "AUST",
  MIAMI: "MIAM",
  ZURICH: "ZURI",
  VIENNA: "VIEN",
  LISBON: "LISB",
  DUBLIN: "DUBL",
  BANGKOK: "BKKK",
};

/** Fixed flap width for HH:MM departure times. */
export const BOARD_TIME_WIDTH = 5;

/** Mobile flap width for 4-character destination codes. */
export const BOARD_MOBILE_CITY_CODE_WIDTH = 4;

/** Pad all destination cities to the longest name so flap counts stay stable. */
export const BOARD_CITY_WIDTH = DEPARTURE_CITIES.reduce(
  (max, city) => Math.max(max, city.length),
  0,
);

export type DepartureRowMeta = {
  time: string;
  city: string;
  cityCode: string;
  timeFormatted: string;
  cityFormatted: string;
  cityCodeFormatted: string;
};

/**
 * Prepare a phrase for the split-flap row: uppercase for airport-board aesthetic,
 * padEnd to fixed width so flap cell count stays constant across cycles.
 */
export function formatSocialProofMessage(phrase: string) {
  return phrase.toUpperCase().padEnd(SOCIAL_PROOF_MESSAGE_WIDTH, " ");
}

export function formatBoardTime(time: string) {
  return time.padEnd(BOARD_TIME_WIDTH, " ");
}

export function formatBoardCity(city: string) {
  return city.toUpperCase().padEnd(BOARD_CITY_WIDTH, " ");
}

export function formatBoardCityCode(city: string) {
  const code =
    DEPARTURE_CITY_CODES[city as keyof typeof DEPARTURE_CITY_CODES] ??
    city.slice(0, BOARD_MOBILE_CITY_CODE_WIDTH).toUpperCase();

  return code.padEnd(BOARD_MOBILE_CITY_CODE_WIDTH, " ");
}

export function getDepartureCityCode(city: string) {
  return (
    DEPARTURE_CITY_CODES[city as keyof typeof DEPARTURE_CITY_CODES] ??
    city.slice(0, BOARD_MOBILE_CITY_CODE_WIDTH).toUpperCase()
  );
}

/** Plausible 24h departure time with minutes in 5-minute steps (airport board style). */
export function randomDepartureTime() {
  const hour = Math.floor(Math.random() * 18) + 6;
  const minute = Math.floor(Math.random() * 12) * 5;
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

function pickRandomCities(count: number) {
  const pool = [...DEPARTURE_CITIES];
  const picked: string[] = [];

  for (let index = 0; index < count; index += 1) {
    if (pool.length === 0) {
      pool.push(...DEPARTURE_CITIES);
    }

    const choiceIndex = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(choiceIndex, 1)[0] ?? DEPARTURE_CITIES[0]);
  }

  return picked;
}

/** Random time + destination city per row — no duplicate cities within one board refresh. */
export function generateDepartureRowMeta(
  count = SOCIAL_PROOF_VISIBLE_ROWS,
): DepartureRowMeta[] {
  const cities = pickRandomCities(count);

  return Array.from({ length: count }, (_, row) => {
    const time = randomDepartureTime();
    const city = cities[row] ?? DEPARTURE_CITIES[0];
    const cityCode = getDepartureCityCode(city);

    return {
      time,
      city,
      cityCode,
      timeFormatted: formatBoardTime(time),
      cityFormatted: formatBoardCity(city),
      cityCodeFormatted: formatBoardCityCode(city),
    };
  });
}

/** Returns `count` consecutive phrases starting at `startIndex`, wrapping the list. */
export function getVisibleSocialProofPhrases(
  startIndex: number,
  count = SOCIAL_PROOF_VISIBLE_ROWS,
) {
  const length = SOCIAL_PROOF_PHRASES.length;
  return Array.from({ length: count }, (_, row) => {
    const phrase = SOCIAL_PROOF_PHRASES[(startIndex + row) % length] ?? SOCIAL_PROOF_PHRASES[0];
    return {
      plain: phrase,
      formatted: formatSocialProofMessage(phrase),
    };
  });
}
