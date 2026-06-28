/** Stylized dark map of Melbourne CBD + Port Phillip Bay — no external tiles or API. */
export default function MelbourneStylizedMap() {
  return (
    <svg
      className="about-wall-map__svg"
      viewBox="0 0 1200 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="about-map-land" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#151d28" />
          <stop offset="100%" stopColor="#10161f" />
        </linearGradient>
        <linearGradient id="about-map-water" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0c1828" />
          <stop offset="100%" stopColor="#081018" />
        </linearGradient>
        <pattern
          id="about-map-blocks"
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <rect width="28" height="28" fill="none" stroke="rgba(148, 163, 184, 0.14)" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Land base */}
      <rect width="1200" height="900" fill="url(#about-map-land)" />

      {/* Port Phillip Bay */}
      <path
        d="M0 520 C180 470, 320 500, 460 545 C620 600, 760 640, 920 610 C1040 585, 1120 540, 1200 555 L1200 900 L0 900 Z"
        fill="url(#about-map-water)"
      />
      <path
        d="M0 520 C180 470, 320 500, 460 545 C620 600, 760 640, 920 610 C1040 585, 1120 540, 1200 555"
        fill="none"
        stroke="rgba(56, 189, 248, 0.22)"
        strokeWidth="2"
      />

      {/* Yarra hint */}
      <path
        d="M520 430 C560 470, 590 510, 610 560 C625 600, 640 630, 655 660"
        fill="none"
        stroke="rgba(56, 189, 248, 0.18)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Suburban block fill */}
      <rect x="120" y="80" width="960" height="420" fill="url(#about-map-blocks)" opacity="0.85" />

      {/* Major roads — Hoddle-style grid around CBD */}
      <g stroke="rgba(186, 230, 253, 0.28)" strokeWidth="3" strokeLinecap="round">
        <line x1="120" y1="250" x2="1080" y2="250" />
        <line x1="120" y1="340" x2="1080" y2="340" />
        <line x1="120" y1="430" x2="900" y2="430" />
        <line x1="280" y1="80" x2="280" y2="480" />
        <line x1="520" y1="80" x2="520" y2="480" />
        <line x1="760" y1="80" x2="760" y2="480" />
        <line x1="980" y1="80" x2="980" y2="430" />
      </g>

      {/* Secondary streets */}
      <g stroke="rgba(148, 163, 184, 0.16)" strokeWidth="1.5">
        {Array.from({ length: 9 }, (_, index) => {
          const y = 120 + index * 42;
          return <line key={`h-${y}`} x1="120" y1={y} x2="1080" y2={y} />;
        })}
        {Array.from({ length: 14 }, (_, index) => {
          const x = 160 + index * 68;
          return <line key={`v-${x}`} x1={x} y1="80" x2={x} y2="480" />;
        })}
      </g>

      {/* CBD highlight */}
      <rect
        x="470"
        y="250"
        width="180"
        height="130"
        rx="8"
        fill="rgba(56, 189, 248, 0.06)"
        stroke="rgba(56, 189, 248, 0.24)"
        strokeWidth="1.5"
      />

      {/* Lat / long crosshairs through pin */}
      <g stroke="rgba(56, 189, 248, 0.35)" strokeWidth="1" strokeDasharray="6 8">
        <line x1="120" y1="318" x2="1080" y2="318" />
        <line x1="648" y1="80" x2="648" y2="520" />
      </g>

      {/* Map label */}
      <text
        x="648"
        y="292"
        textAnchor="middle"
        fill="rgba(186, 230, 253, 0.55)"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="18"
        fontWeight="600"
        letterSpacing="0.28em"
      >
        MELBOURNE
      </text>
    </svg>
  );
}
