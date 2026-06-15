/** Pick keys that differ from desktop defaults (for *.mobile.js export). */
export function pickConfigOverrides(config, defaults) {
  const overrides = {};

  for (const [key, value] of Object.entries(config)) {
    if (JSON.stringify(value) !== JSON.stringify(defaults[key])) {
      overrides[key] = value;
    }
  }

  return overrides;
}

/** Format overrides as a paste-ready ES module. */
export function formatMobileConfigModule(exportName, overrides) {
  return `/**
 * Mobile overrides — tune via /dev/hero-canvas (mobile preview + Copy mobile overrides).
 */
export const ${exportName} = ${JSON.stringify(overrides, null, 2)};
`;
}
