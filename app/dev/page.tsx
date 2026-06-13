import Link from "next/link";

const playgrounds = [
  {
    href: "/dev/hero-canvas",
    title: "Hero Canvas",
    description: "Scroll-driven vintage computer with monitor video texture.",
    config: "lib/heroCanvasConfig.js",
  },
  {
    href: "/dev/desk-evolution",
    title: "Site evolution",
    description: "Blueprint → wireframe → live site canvas preview with scroll scrubber.",
    config: "lib/deskEvolutionScreen.js",
  },
  {
    href: "/dev/act-3-reveal",
    title: "Act 3 reveal",
    description: "iPhone + monitor scroll reveal with Leva pose and camera tuning.",
    config: "lib/act3RevealConfig.js",
  },
  {
    href: "/dev/rocket",
    title: "Rocket",
    description: "Legacy rocket GLB playground (superseded by desk evolution on homepage).",
    config: "lib/RocketConfig.js",
  },
];

export default function DevIndexPage() {
  return (
    <div className="min-h-screen bg-agency-bg px-6 py-16 text-agency-text">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-agency-muted">
          Three.js workspace
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold text-agency-ink">
          Dev playgrounds
        </h1>
        <p className="mt-4 text-agency-text-secondary">
          Leva panels + progress scrubbers for tuning scroll scenes. Export JSON
          into the matching config file when values look right.
        </p>

        <ul className="mt-10 space-y-4">
          {playgrounds.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-2xl border border-agency-border bg-agency-surface p-5 transition-colors hover:border-agency-accent"
              >
                <h2 className="font-display text-xl font-semibold text-agency-ink">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm text-agency-muted">{item.description}</p>
                <p className="mt-3 font-mono text-xs text-agency-text-secondary">
                  {item.config}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm text-agency-muted">
          Add GLB/MP4 assets to <code className="font-mono">/public</code> — see{" "}
          <code className="font-mono">public/dev-assets.md</code>.
        </p>
      </div>
    </div>
  );
}
