let studioReady = false;
let studioModule: typeof import("@theatre/studio").default | null = null;

/** Initialise Theatre Studio once (dev-only, client-side). Call after ensureHeroTheatreProject(). */
export async function initHeroTheatreStudio() {
  if (studioReady || typeof window === "undefined") {
    return studioModule;
  }

  const studio = (await import("@theatre/studio")).default;
  studio.initialize({
    persistenceKey: "aperix-hero-theatre",
    usePersistentStorage: true,
  });

  if (studio.ui.isHidden) {
    studio.ui.restore();
  }

  studioModule = studio;
  studioReady = true;
  return studio;
}

/** Re-open the Theatre panel if it was closed or hidden. */
export async function showHeroTheatrePanel() {
  const studio = studioModule ?? (await initHeroTheatreStudio());
  if (!studio) {
    return null;
  }
  studio.ui.restore();
  return studio;
}

/** Export the current Theatre project state as JSON for version control. */
export async function exportHeroTheatreState() {
  const studio = studioModule ?? (await initHeroTheatreStudio());
  if (!studio) {
    return null;
  }
  const { HERO_THEATRE_PROJECT_ID } = await import("./types");
  return studio.createContentOfSaveFile(HERO_THEATRE_PROJECT_ID);
}

export function isHeroTheatreStudioReady() {
  return studioReady;
}
