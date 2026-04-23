export function HeroArtwork() {
  return (
    <svg
      viewBox="0 0 560 560"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <linearGradient id="hero-curve" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#0066FF" stopOpacity="0.15" />
          <stop offset="60%" stopColor="#0066FF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0066FF" stopOpacity="1" />
        </linearGradient>
        <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0066FF" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
        </radialGradient>
        <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0A0A0A" strokeOpacity="0.04" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="560" height="560" fill="url(#hero-grid)" />
      <circle cx="420" cy="180" r="220" fill="url(#hero-glow)" />

      {/* Horizontal baseline axis */}
      <line x1="40" y1="440" x2="520" y2="440" stroke="#0A0A0A" strokeOpacity="0.14" strokeWidth="1" />
      <line x1="40" y1="440" x2="40" y2="100" stroke="#0A0A0A" strokeOpacity="0.14" strokeWidth="1" />

      {/* Axis ticks */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line
          key={`tick-${i}`}
          x1={40 + i * 80}
          y1={440}
          x2={40 + i * 80}
          y2={445}
          stroke="#0A0A0A"
          strokeOpacity="0.18"
          strokeWidth="1"
        />
      ))}

      {/* Ghost / benchmark curve (flat dotted) */}
      <path
        d="M 40 400 Q 160 395 280 385 T 520 360"
        fill="none"
        stroke="#0A0A0A"
        strokeOpacity="0.18"
        strokeWidth="1.5"
        strokeDasharray="3 5"
      />

      {/* Background node network */}
      {[
        [110, 300],
        [180, 240],
        [230, 330],
        [310, 210],
        [360, 290],
        [420, 170],
        [460, 250],
      ].map(([cx, cy], i, arr) => {
        const next = arr[i + 1];
        return (
          <g key={`node-${cx}-${cy}`}>
            {next ? (
              <line
                x1={cx}
                y1={cy}
                x2={next[0]}
                y2={next[1]}
                stroke="#0A0A0A"
                strokeOpacity="0.08"
                strokeWidth="1"
              />
            ) : null}
            <circle cx={cx} cy={cy} r="3" fill="#0A0A0A" fillOpacity="0.14" />
          </g>
        );
      })}

      {/* Primary ascending accent curve — the headline statement */}
      <path
        d="M 40 410 C 120 400, 180 390, 220 360 S 300 260, 360 220 S 460 130, 520 90"
        fill="none"
        stroke="url(#hero-curve)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Data points on the primary curve */}
      {[
        [40, 410],
        [140, 394],
        [220, 360],
        [300, 280],
        [360, 220],
        [440, 150],
        [520, 90],
      ].map(([cx, cy], i) => (
        <g key={`pt-${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r="6" fill="#FFFFFF" stroke="#0066FF" strokeWidth="2" />
          {i === 6 ? (
            <circle cx={cx} cy={cy} r="12" fill="none" stroke="#0066FF" strokeOpacity="0.2" strokeWidth="2">
              <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite" />
              <animate
                attributeName="stroke-opacity"
                values="0.3;0;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          ) : null}
        </g>
      ))}

      {/* SERP cluster badges in upper-right */}
      <g transform="translate(380, 60)">
        <rect x="0" y="0" width="130" height="22" rx="4" fill="#FFFFFF" stroke="#0A0A0A" strokeOpacity="0.12" />
        <circle cx="10" cy="11" r="3" fill="#0066FF" />
        <rect x="22" y="6" width="60" height="4" rx="1" fill="#0A0A0A" fillOpacity="0.85" />
        <rect x="22" y="14" width="88" height="3" rx="1" fill="#0A0A0A" fillOpacity="0.3" />
      </g>
      <g transform="translate(360, 92)">
        <rect x="0" y="0" width="150" height="22" rx="4" fill="#FFFFFF" stroke="#0A0A0A" strokeOpacity="0.12" />
        <circle cx="10" cy="11" r="3" fill="#0A0A0A" fillOpacity="0.3" />
        <rect x="22" y="6" width="76" height="4" rx="1" fill="#0A0A0A" fillOpacity="0.85" />
        <rect x="22" y="14" width="110" height="3" rx="1" fill="#0A0A0A" fillOpacity="0.3" />
      </g>
      <g transform="translate(340, 124)">
        <rect x="0" y="0" width="170" height="22" rx="4" fill="#FFFFFF" stroke="#0A0A0A" strokeOpacity="0.12" />
        <circle cx="10" cy="11" r="3" fill="#0A0A0A" fillOpacity="0.3" />
        <rect x="22" y="6" width="54" height="4" rx="1" fill="#0A0A0A" fillOpacity="0.85" />
        <rect x="22" y="14" width="130" height="3" rx="1" fill="#0A0A0A" fillOpacity="0.3" />
      </g>

      {/* Axis labels (mono) */}
      <text
        x="40"
        y="468"
        fontFamily="ui-monospace, monospace"
        fontSize="9"
        fill="#0A0A0A"
        fillOpacity="0.45"
        letterSpacing="0.1em"
      >
        M1
      </text>
      <text
        x="520"
        y="468"
        fontFamily="ui-monospace, monospace"
        fontSize="9"
        fill="#0A0A0A"
        fillOpacity="0.45"
        textAnchor="end"
        letterSpacing="0.1em"
      >
        M12
      </text>
      <text
        x="28"
        y="104"
        fontFamily="ui-monospace, monospace"
        fontSize="9"
        fill="#0A0A0A"
        fillOpacity="0.45"
        textAnchor="end"
        letterSpacing="0.1em"
      >
        #1
      </text>
      <text
        x="28"
        y="444"
        fontFamily="ui-monospace, monospace"
        fontSize="9"
        fill="#0A0A0A"
        fillOpacity="0.45"
        textAnchor="end"
        letterSpacing="0.1em"
      >
        #100
      </text>
    </svg>
  );
}
