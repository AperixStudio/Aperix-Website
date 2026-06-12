# Background And Colour Palette Implementation Brief

Use this brief to recreate the current Aperix background, glass treatment, and colour palette in another project.

## Goal

Recreate the site-wide visual system:

- A fixed background atmosphere behind every page.
- Warm blurred colour fields under a frosted glass layer.
- Light and dark palettes controlled by CSS custom properties.
- Tailwind utilities mapped to those CSS variables.
- Glass panels, pills, buttons, and section background accents that all use the same token system.
- A theme bootstrap script that sets the correct theme before hydration to avoid a flash.

## Current Source Files

Port or recreate these files/pieces:

- `app/globals.css`
- `components/agency/SiteAtmosphere.tsx`
- `components/agency/ThemeToggle.tsx`
- The `themeInitScript` block in `app/layout.tsx`
- The `<SiteAtmosphere />` mount in `app/layout.tsx`

If the target project is not Next.js, keep the same CSS and React structure but move:

- The global CSS into the target app's global stylesheet.
- The theme bootstrap script into the HTML document/head/root layout.
- `<SiteAtmosphere />` near the root of the app, before page content.

## Core Palette

The base UI palette uses neutral surfaces with blue, lime, and sky accents.

```css
:root {
  --agency-bg: #f3f4f6;
  --agency-surface: #ffffff;
  --agency-surface2: #ffffff;
  --agency-border: #e5e7eb;
  --agency-border-dark: #a3a3a3;
  --agency-text: #171717;
  --agency-text-secondary: #404040;
  --agency-muted: #737373;
  --agency-accent: #0ea5e9;
  --agency-accent-dark: #0284c7;
  --agency-accent2: #84cc16;
  --agency-accent3: #38bdf8;
  --agency-ink: #171717;
}
```

Dark mode overrides:

```css
html[data-theme="dark"] {
  color-scheme: dark;
  --agency-bg: #171717;
  --agency-surface: #262626;
  --agency-surface2: #404040;
  --agency-border: #525252;
  --agency-border-dark: #a3a3a3;
  --agency-text: #ffffff;
  --agency-text-secondary: #f3f4f6;
  --agency-muted: #a3a3a3;
  --agency-accent: #38bdf8;
  --agency-accent-dark: #0ea5e9;
  --agency-accent2: #a3e635;
  --agency-accent3: #7dd3fc;
  --agency-ink: #ffffff;
}
```

## Atmosphere Palette

The background uses its own warmer palette. This prevents the whole site from becoming a plain grey/blue UI.

Light mode:

```css
:root {
  --agency-atmosphere-red: #d08a7a;
  --agency-atmosphere-blue: #c8d8e4;
  --agency-atmosphere-peach: #ecd4bc;
  --agency-atmosphere-ghost: #faf5ef;
  --agency-atmosphere-base: #fffaf6;
  --agency-glass-frost: rgba(255, 248, 242, 0.3);
  --agency-glass-frost-blur: 96px;
}
```

Dark mode:

```css
html[data-theme="dark"] {
  --agency-atmosphere-red: #a87868;
  --agency-atmosphere-blue: #7a98a8;
  --agency-atmosphere-peach: #a89078;
  --agency-atmosphere-ghost: #221e1c;
  --agency-atmosphere-base: #1a1614;
  --agency-glass-frost: rgba(255, 255, 255, 0.08);
  --agency-glass-frost-blur: 72px;
}
```

The main atmosphere gradient:

```css
:root {
  --agency-atmosphere-gradient: linear-gradient(
    125deg,
    color-mix(in oklab, var(--agency-atmosphere-red) 62%, var(--agency-atmosphere-ghost) 38%) 0%,
    color-mix(in oklab, var(--agency-atmosphere-red) 22%, var(--agency-atmosphere-ghost) 78%) 22%,
    var(--agency-atmosphere-ghost) 44%,
    color-mix(in oklab, var(--agency-atmosphere-peach) 50%, var(--agency-atmosphere-ghost) 50%) 68%,
    color-mix(in oklab, var(--agency-atmosphere-blue) 45%, var(--agency-atmosphere-peach) 55%) 100%
  );
}

html[data-theme="dark"] {
  --agency-atmosphere-gradient: linear-gradient(
    125deg,
    color-mix(in oklab, var(--agency-atmosphere-red) 44%, var(--agency-atmosphere-base) 56%) 0%,
    color-mix(in oklab, var(--agency-atmosphere-red) 14%, var(--agency-atmosphere-ghost) 86%) 24%,
    var(--agency-atmosphere-ghost) 46%,
    color-mix(in oklab, var(--agency-atmosphere-peach) 36%, var(--agency-atmosphere-ghost) 64%) 70%,
    color-mix(in oklab, var(--agency-atmosphere-blue) 28%, var(--agency-atmosphere-peach) 72%) 100%
  );
}
```

## SiteAtmosphere Component

Current component:

```tsx
export default function SiteAtmosphere() {
  return (
    <div aria-hidden="true" className="site-atmosphere">
      <div className="site-atmosphere__gradient" />
      <div className="site-atmosphere__blobs">
        <div className="site-atmosphere__blob site-atmosphere__blob--coral" />
        <div className="site-atmosphere__blob site-atmosphere__blob--peach" />
        <div className="site-atmosphere__blob site-atmosphere__blob--sky" />
        <div className="site-atmosphere__blob site-atmosphere__blob--rose" />
      </div>
      <div className="site-atmosphere__frost" />
      <div className="site-atmosphere__sheen" />
    </div>
  );
}
```

Mount it once at the app root:

```tsx
<body>
  <SiteAtmosphere />
  {children}
</body>
```

The element is `aria-hidden`, fixed, and pointer-events disabled. It should sit behind page content with `z-index: -1`.

## Background CSS

Core background:

```css
body {
  background-color: var(--agency-atmosphere-base);
  color: var(--agency-ink);
}

.site-atmosphere {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  isolation: isolate;
  background: var(--agency-atmosphere-base);
}

.site-atmosphere__gradient {
  position: absolute;
  inset: 0;
  background: var(--agency-atmosphere-gradient);
  background-attachment: fixed;
}
```

Blurred colour fields:

```css
.site-atmosphere__blobs {
  position: absolute;
  inset: -10%;
}

.site-atmosphere__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(72px);
}

.site-atmosphere__blob--coral {
  top: -6%;
  left: -4%;
  width: min(50vw, 440px);
  height: min(50vw, 440px);
  background: var(--agency-atmosphere-red);
  opacity: 0.72;
  animation: site-atmosphere-drift-a 34s ease-in-out infinite alternate;
}

.site-atmosphere__blob--peach {
  bottom: -8%;
  right: -2%;
  width: min(54vw, 480px);
  height: min(54vw, 480px);
  background: var(--agency-atmosphere-peach);
  opacity: 0.68;
  animation: site-atmosphere-drift-b 40s ease-in-out infinite alternate;
}

.site-atmosphere__blob--sky {
  top: 32%;
  right: 14%;
  width: min(38vw, 340px);
  height: min(38vw, 340px);
  background: var(--agency-atmosphere-blue);
  opacity: 0.58;
  animation: site-atmosphere-drift-c 44s ease-in-out infinite alternate;
}

.site-atmosphere__blob--rose {
  bottom: 22%;
  left: 10%;
  width: min(36vw, 320px);
  height: min(36vw, 320px);
  background: color-mix(in oklab, var(--agency-atmosphere-red) 65%, var(--agency-atmosphere-peach) 35%);
  opacity: 0.55;
  animation: site-atmosphere-drift-d 38s ease-in-out infinite alternate;
}
```

Frost, sheen, and noise:

```css
.site-atmosphere__frost {
  position: absolute;
  inset: 0;
  background: var(--agency-glass-frost);
  backdrop-filter: blur(var(--agency-glass-frost-blur)) saturate(1.55) brightness(1.03);
  -webkit-backdrop-filter: blur(var(--agency-glass-frost-blur)) saturate(1.55) brightness(1.03);
  box-shadow: inset 0 1.5px 0 rgba(255, 255, 255, 0.55);
}

.site-atmosphere__sheen {
  position: absolute;
  inset: 0;
  opacity: 0.35;
  background:
    linear-gradient(125deg, rgba(255, 255, 255, 0.28) 0%, transparent 40%),
    radial-gradient(ellipse 110% 70% at 50% -18%, rgba(255, 255, 255, 0.18), transparent 58%);
}

.site-atmosphere::after {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px 180px;
  mix-blend-mode: multiply;
}
```

Dark-mode atmosphere refinements:

```css
html[data-theme="dark"] .site-atmosphere__blob {
  filter: blur(80px);
  opacity: 0.42;
}

html[data-theme="dark"] .site-atmosphere__frost {
  backdrop-filter: blur(var(--agency-glass-frost-blur)) saturate(1.2) brightness(0.96);
  -webkit-backdrop-filter: blur(var(--agency-glass-frost-blur)) saturate(1.2) brightness(0.96);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

html[data-theme="dark"] .site-atmosphere__sheen {
  opacity: 0.28;
}

html[data-theme="dark"] .site-atmosphere::after {
  opacity: 0.055;
  mix-blend-mode: soft-light;
}
```

Motion:

```css
@keyframes site-atmosphere-drift-a {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  100% { transform: translate3d(4%, 6%, 0) scale(1.06); }
}

@keyframes site-atmosphere-drift-b {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  100% { transform: translate3d(-5%, 3%, 0) scale(1.05); }
}

@keyframes site-atmosphere-drift-c {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  100% { transform: translate3d(3%, -4%, 0) scale(1.07); }
}

@keyframes site-atmosphere-drift-d {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  100% { transform: translate3d(-3%, 5%, 0) scale(1.04); }
}
```

Mobile and reduced-motion:

```css
@media (pointer: coarse) {
  .site-atmosphere__blob {
    filter: blur(56px);
    opacity: 0.5;
  }

  .site-atmosphere__frost {
    --agency-glass-frost-blur: 56px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Glass UI Tokens

These tokens keep panels and pills visually connected to the atmospheric background.

```css
:root {
  --agency-glass-border: rgba(255, 255, 255, 0.72);
  --agency-glass-bg: rgba(255, 255, 255, 0.6);
  --agency-glass-soft-border: rgba(23, 23, 23, 0.08);
  --agency-glass-soft-bg: rgba(255, 255, 255, 0.88);
  --agency-glass-shadow: 0 8px 32px rgba(23, 23, 23, 0.08), 0 1.5px 0 rgba(255, 255, 255, 0.8) inset;
}

html[data-theme="dark"] {
  --agency-glass-border: rgba(255, 255, 255, 0.12);
  --agency-glass-bg: rgba(38, 38, 38, 0.72);
  --agency-glass-soft-border: rgba(255, 255, 255, 0.08);
  --agency-glass-soft-bg: rgba(23, 23, 23, 0.68);
  --agency-glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.38), 0 1.5px 0 rgba(255, 255, 255, 0.08) inset;
}
```

Reusable glass classes:

```css
.agency-panel-wrap {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--agency-glass-border);
  border-radius: 2rem;
  background: var(--agency-glass-bg);
  box-shadow: var(--agency-glass-shadow);
  backdrop-filter: blur(28px) saturate(1.65);
  -webkit-backdrop-filter: blur(28px) saturate(1.65);
}

.agency-glass-pill {
  border: 1px solid var(--agency-glass-border);
  background: var(--agency-glass-bg);
  box-shadow: var(--agency-glass-shadow);
  backdrop-filter: blur(40px) saturate(1.8) brightness(1.04);
  -webkit-backdrop-filter: blur(40px) saturate(1.8) brightness(1.04);
}

.agency-glass-pill--soft {
  border-color: var(--agency-glass-soft-border);
  background: var(--agency-glass-soft-bg);
}
```

## Tailwind Mapping

This project uses Tailwind v4 `@theme inline` to expose CSS variables as utilities.

```css
@theme inline {
  --color-background: var(--agency-bg);
  --color-foreground: var(--agency-text);

  --color-agency-bg: var(--agency-bg);
  --color-agency-surface: var(--agency-surface);
  --color-agency-surface2: var(--agency-surface2);
  --color-agency-border: var(--agency-border);
  --color-agency-border-dark: var(--agency-border-dark);
  --color-agency-text: var(--agency-text);
  --color-agency-text-secondary: var(--agency-text-secondary);
  --color-agency-muted: var(--agency-muted);
  --color-agency-accent: var(--agency-accent);
  --color-agency-accent-dark: var(--agency-accent-dark);
  --color-agency-accent2: var(--agency-accent2);
  --color-agency-accent3: var(--agency-accent3);
  --color-agency-ink: var(--agency-ink);
}
```

Example usage:

- `bg-agency-bg`
- `bg-agency-surface`
- `text-agency-ink`
- `text-agency-muted`
- `border-agency-border`
- `text-agency-accent`

If the target project does not use Tailwind v4, create equivalent theme tokens in its design system or use raw CSS variables like `color: var(--agency-ink)`.

## Buttons And Section Accents

Primary button:

```css
.agency-button-primary {
  border: 1px solid color-mix(in oklab, var(--agency-accent-dark) 55%, transparent 45%);
  background: linear-gradient(135deg, var(--agency-accent), var(--agency-accent-dark));
  color: #ffffff;
  box-shadow:
    0 14px 32px color-mix(in oklab, var(--agency-accent) 28%, transparent 72%),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}
```

Secondary button:

```css
.agency-button-secondary {
  border: 1px solid color-mix(in oklab, var(--agency-border-dark) 70%, transparent 30%);
  background: color-mix(in oklab, var(--agency-surface) 88%, transparent 12%);
  color: var(--agency-ink);
}
```

Winding section accent:

```css
.winding-section {
  position: relative;
  width: 100%;
}

.winding-section::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0.65;
  background:
    radial-gradient(circle at var(--winding-x) 10%, color-mix(in oklab, var(--agency-accent) 14%, transparent 86%), transparent 36%),
    linear-gradient(
      135deg,
      transparent 0%,
      color-mix(in oklab, var(--agency-glass-bg) 70%, transparent 30%) 48%,
      transparent 100%
    );
  clip-path: polygon(0 5%, 100% 0, 100% 95%, 0 100%);
}

.winding-section-left {
  --winding-x: 8%;
}

.winding-section-right {
  --winding-x: 92%;
}
```

## Theme Bootstrap

Run this before the app paints to prevent a light/dark flash.

```tsx
const themeInitScript = `
  (() => {
    try {
      const stored = window.localStorage.getItem("aperix-theme");
      const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      const theme = stored === "dark" || stored === "light" ? stored : system;
      document.documentElement.dataset.theme = theme;
    } catch {
      document.documentElement.dataset.theme = "light";
    }
  })();
`;
```

In Next.js layout:

```tsx
<html lang="en" suppressHydrationWarning>
  <body suppressHydrationWarning>
    <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
    <SiteAtmosphere />
    {children}
  </body>
</html>
```

## Theme Toggle

The current toggle:

- Reads `localStorage` key `aperix-theme`.
- Falls back to `prefers-color-scheme`.
- Applies the theme by setting `document.documentElement.dataset.theme`.
- Uses a safe initial React state to avoid hydration mismatch.

If implementing in another brand/project, rename the storage key:

```ts
const STORAGE_KEY = "project-theme";
```

Core apply function:

```ts
function applyTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);
}
```

## Implementation Checklist

1. Copy the `:root` palette variables.
2. Copy the `html[data-theme="dark"]` overrides.
3. Copy the atmosphere variables and gradient definitions.
4. Add `SiteAtmosphere` at the app root.
5. Copy the `.site-atmosphere*` CSS.
6. Set `body` background to `var(--agency-atmosphere-base)`.
7. Add Tailwind theme mappings or equivalent design-system tokens.
8. Copy glass panel/pill classes if the project uses frosted UI.
9. Copy button classes if CTAs should match the Aperix treatment.
10. Add the theme bootstrap script before app content.
11. Add or adapt `ThemeToggle`.
12. Test light mode, dark mode, mobile, and reduced motion.

## Notes For Future Codex Implementation

When implementing this in a new project:

- Inspect the target styling stack first.
- Keep the background atmosphere fixed and separate from page sections.
- Do not put the gradient directly on every section; sections should stay transparent or use glass surfaces so the atmosphere can show through.
- Rename `agency-*` tokens if the target brand has its own naming convention.
- Preserve the token structure even if the colours change.
- Make dark mode an override of the same variables, not a duplicate stylesheet.
- Check contrast for text on glass surfaces after changing brand colours.
