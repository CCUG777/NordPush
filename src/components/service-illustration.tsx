type Variant =
  | "strategy"
  | "audit"
  | "technical"
  | "content"
  | "backlinks"
  | "b2b"
  | "local"
  | "keywords"
  | "monitoring"
  | "pagespeed";

type ServiceIllustrationProps = {
  variant: Variant;
};

const ink = "#0A0A0A";
const inkMid = "rgba(10,10,10,0.35)";
const inkSoft = "rgba(10,10,10,0.12)";
const accent = "#0040E0";
const aurora = "#14D9A1";

export function ServiceIllustration({ variant }: ServiceIllustrationProps) {
  return (
    <svg
      viewBox="0 0 320 180"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect width="320" height="180" fill="transparent" />
      {variant === "strategy" ? <Strategy /> : null}
      {variant === "audit" ? <Audit /> : null}
      {variant === "technical" ? <Technical /> : null}
      {variant === "content" ? <Content /> : null}
      {variant === "backlinks" ? <Backlinks /> : null}
      {variant === "b2b" ? <B2B /> : null}
      {variant === "local" ? <Local /> : null}
      {variant === "keywords" ? <Keywords /> : null}
      {variant === "monitoring" ? <Monitoring /> : null}
      {variant === "pagespeed" ? <PageSpeed /> : null}
    </svg>
  );
}

function Strategy() {
  return (
    <g>
      {/* Roadmap bar */}
      <line x1="32" y1="90" x2="288" y2="90" stroke={inkSoft} strokeWidth="1" />
      {[32, 96, 160, 224, 288].map((x) => (
        <circle key={x} cx={x} cy={90} r="4" fill="#FFF" stroke={ink} strokeOpacity="0.4" />
      ))}
      <circle cx="160" cy="90" r="6" fill={accent} />
      <rect x="148" y="54" width="24" height="24" rx="3" fill="#FFF" stroke={accent} />
      <line x1="160" y1="78" x2="160" y2="84" stroke={accent} strokeWidth="1.5" />
      <text
        x="32"
        y="122"
        fontFamily="ui-monospace, monospace"
        fontSize="8"
        fill={inkMid}
        letterSpacing="0.12em"
      >
        Q1
      </text>
      <text
        x="288"
        y="122"
        fontFamily="ui-monospace, monospace"
        fontSize="8"
        fill={inkMid}
        textAnchor="end"
        letterSpacing="0.12em"
      >
        Q4
      </text>
    </g>
  );
}

function Audit() {
  return (
    <g>
      {/* Layered stack with magnifier */}
      <rect x="60" y="40" width="160" height="20" rx="3" fill="#FFF" stroke={ink} strokeOpacity="0.25" />
      <rect x="60" y="68" width="160" height="20" rx="3" fill="#FFF" stroke={ink} strokeOpacity="0.25" />
      <rect x="60" y="96" width="160" height="20" rx="3" fill={accent} fillOpacity="0.08" stroke={accent} />
      <rect x="60" y="124" width="160" height="20" rx="3" fill="#FFF" stroke={ink} strokeOpacity="0.25" />
      <line x1="72" y1="50" x2="140" y2="50" stroke={ink} strokeOpacity="0.3" strokeWidth="1" />
      <line x1="72" y1="78" x2="120" y2="78" stroke={ink} strokeOpacity="0.3" strokeWidth="1" />
      <line x1="72" y1="106" x2="150" y2="106" stroke={accent} strokeWidth="1.5" />
      <line x1="72" y1="134" x2="110" y2="134" stroke={ink} strokeOpacity="0.3" strokeWidth="1" />
      <circle cx="234" cy="106" r="14" fill="#FFF" stroke={accent} strokeWidth="2" />
      <line x1="244" y1="116" x2="256" y2="128" stroke={accent} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function Technical() {
  return (
    <g>
      {/* Server / waterfall bars */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect
          key={i}
          x={40 + i * 30}
          y={60 + (i % 3) * 8}
          width={Math.min(60 + i * 6, 200)}
          height="6"
          rx="1"
          fill={i === 4 ? accent : ink}
          fillOpacity={i === 4 ? 1 : 0.2 - i * 0.02}
        />
      ))}
      {/* Gauge */}
      <g transform="translate(220, 118)">
        <path d="M -28 0 A 28 28 0 0 1 28 0" fill="none" stroke={inkSoft} strokeWidth="4" />
        <path d="M -28 0 A 28 28 0 0 1 16 -23" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        <text
          x="0"
          y="6"
          fontFamily="ui-monospace, monospace"
          fontSize="11"
          fill={ink}
          textAnchor="middle"
          fontWeight="500"
        >
          98
        </text>
      </g>
    </g>
  );
}

function Content() {
  return (
    <g>
      {/* Document cluster */}
      <rect x="40" y="44" width="100" height="96" rx="4" fill="#FFF" stroke={ink} strokeOpacity="0.3" />
      <rect x="52" y="58" width="60" height="4" rx="1" fill={ink} fillOpacity="0.85" />
      <rect x="52" y="70" width="76" height="3" rx="1" fill={ink} fillOpacity="0.2" />
      <rect x="52" y="80" width="76" height="3" rx="1" fill={ink} fillOpacity="0.2" />
      <rect x="52" y="90" width="50" height="3" rx="1" fill={ink} fillOpacity="0.2" />

      <rect x="164" y="36" width="100" height="96" rx="4" fill="#FFF" stroke={accent} />
      <rect x="176" y="50" width="60" height="4" rx="1" fill={ink} fillOpacity="0.85" />
      <rect x="176" y="62" width="76" height="3" rx="1" fill={ink} fillOpacity="0.2" />
      <rect x="176" y="72" width="76" height="3" rx="1" fill={ink} fillOpacity="0.2" />
      <rect x="176" y="82" width="50" height="3" rx="1" fill={accent} />

      <line x1="140" y1="92" x2="164" y2="84" stroke={accent} strokeWidth="1.5" />
    </g>
  );
}

function Backlinks() {
  return (
    <g>
      {/* Network of nodes with one accent link */}
      <circle cx="80" cy="90" r="22" fill="#FFF" stroke={accent} strokeWidth="1.5" />
      <circle cx="80" cy="90" r="4" fill={accent} />
      {[
        [180, 50],
        [220, 90],
        [180, 140],
        [260, 60],
        [280, 130],
      ].map(([cx, cy], i) => (
        <g key={`bl-${cx}-${cy}`}>
          <line
            x1="80"
            y1="90"
            x2={cx}
            y2={cy}
            stroke={i === 1 ? accent : ink}
            strokeOpacity={i === 1 ? 1 : 0.2}
            strokeWidth={i === 1 ? 1.5 : 1}
          />
          <circle cx={cx} cy={cy} r="5" fill="#FFF" stroke={ink} strokeOpacity="0.5" />
        </g>
      ))}
    </g>
  );
}

function B2B() {
  return (
    <g>
      {/* Funnel with 3 stages */}
      <path
        d="M 60 50 L 260 50 L 220 100 L 100 100 Z"
        fill="#FFF"
        stroke={ink}
        strokeOpacity="0.25"
      />
      <path
        d="M 100 100 L 220 100 L 200 140 L 120 140 Z"
        fill={accent}
        fillOpacity="0.06"
        stroke={accent}
        strokeOpacity="0.8"
      />
      <path
        d="M 120 140 L 200 140 L 180 168 L 140 168 Z"
        fill={accent}
        stroke={accent}
      />
      {/* Decision dots */}
      {[90, 140, 190, 240].map((cx) => (
        <circle key={cx} cx={cx} cy={30} r="3" fill={ink} fillOpacity="0.4" />
      ))}
      <line x1="88" y1="33" x2="240" y2="33" stroke={ink} strokeOpacity="0.14" strokeWidth="1" strokeDasharray="2 3" />
    </g>
  );
}

function Local() {
  return (
    <g>
      {/* Map pin with coordinate reticle */}
      <circle cx="160" cy="88" r="44" fill="none" stroke={inkSoft} strokeWidth="1" strokeDasharray="2 4" />
      <circle cx="160" cy="88" r="28" fill="none" stroke={inkSoft} strokeWidth="1" />
      <path d="M 160 60 L 160 116 M 132 88 L 188 88" stroke={inkMid} strokeWidth="1" />
      {/* Pin */}
      <path d="M 160 50 C 146 50 136 60 136 74 C 136 92 160 120 160 120 C 160 120 184 92 184 74 C 184 64 174 50 160 50 Z" fill={accent} />
      <circle cx="160" cy="74" r="7" fill="#FFF" />
      {/* Label tag */}
      <g transform="translate(198, 60)">
        <rect x="0" y="0" width="90" height="20" rx="3" fill="#FFF" stroke={inkSoft} />
        <circle cx="10" cy="10" r="3" fill={aurora} />
        <rect x="20" y="5" width="56" height="3" rx="1" fill={ink} fillOpacity="0.85" />
        <rect x="20" y="12" width="42" height="2" rx="1" fill={ink} fillOpacity="0.3" />
      </g>
      <g transform="translate(40, 132)">
        <rect x="0" y="0" width="110" height="14" rx="2" fill="#FFF" stroke={inkSoft} />
        <rect x="6" y="4" width="64" height="2.5" rx="1" fill={ink} fillOpacity="0.6" />
        <rect x="6" y="9" width="90" height="2" rx="1" fill={ink} fillOpacity="0.24" />
      </g>
    </g>
  );
}

function Keywords() {
  return (
    <g>
      {/* Keyword cloud — pills of varying emphasis */}
      {[
        [48, 44, 72, "kaufen"],
        [132, 44, 78, "vergleich"],
        [224, 44, 64, "preis"],
        [32, 74, 58, "seo"],
        [100, 74, 86, "bewertung"],
        [200, 74, 90, "optimierung"],
        [62, 104, 70, "rank 1"],
        [148, 104, 60, "test"],
        [218, 104, 80, "günstig"],
        [56, 134, 82, "webdesign"],
        [152, 134, 72, "wachstum"],
        [238, 134, 66, "guide"],
      ].map(([x, y, w, lbl], i) => {
        const focused = i === 4 || i === 8;
        return (
          <g key={`kw-${i}`} transform={`translate(${x}, ${y})`}>
            <rect
              width={w as number}
              height="18"
              rx="9"
              fill={focused ? accent : "#FFF"}
              stroke={focused ? accent : inkSoft}
              strokeWidth="1"
              fillOpacity={focused ? 1 : 1}
            />
            <text
              x={(w as number) / 2}
              y="12"
              fontFamily="ui-monospace, monospace"
              fontSize="7"
              textAnchor="middle"
              fill={focused ? "#FFF" : ink}
              fillOpacity={focused ? 1 : 0.75}
              letterSpacing="0.08em"
            >
              {String(lbl).toUpperCase()}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function Monitoring() {
  return (
    <g>
      {/* Dashboard — stacked panel + live pulse */}
      <rect x="30" y="30" width="260" height="120" rx="6" fill="#FFF" stroke={inkSoft} />
      {/* Title bar */}
      <rect x="30" y="30" width="260" height="18" rx="6" fill={ink} fillOpacity="0.04" />
      <circle cx="44" cy="39" r="2" fill={ink} fillOpacity="0.3" />
      <circle cx="54" cy="39" r="2" fill={ink} fillOpacity="0.3" />
      <circle cx="64" cy="39" r="2" fill={aurora} />
      {/* Sparkline */}
      <path d="M 44 110 Q 70 96 94 100 T 140 80 T 190 70 T 240 50" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <circle cx="240" cy="50" r="3.5" fill={accent} />
      <circle cx="240" cy="50" r="8" fill="none" stroke={accent} strokeOpacity="0.3">
        <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Metric tiles */}
      <g transform="translate(44, 120)">
        <rect width="68" height="22" rx="3" fill={accent} fillOpacity="0.08" stroke={accent} strokeOpacity="0.5" />
        <text x="8" y="10" fontFamily="ui-monospace, monospace" fontSize="6" fill={ink} fillOpacity="0.55" letterSpacing="0.1em">RANK</text>
        <text x="8" y="18" fontFamily="ui-monospace, monospace" fontSize="8" fill={ink} fontWeight="600">↑ 14</text>
      </g>
      <g transform="translate(120, 120)">
        <rect width="68" height="22" rx="3" fill="#FFF" stroke={inkSoft} />
        <text x="8" y="10" fontFamily="ui-monospace, monospace" fontSize="6" fill={ink} fillOpacity="0.55" letterSpacing="0.1em">CTR</text>
        <text x="8" y="18" fontFamily="ui-monospace, monospace" fontSize="8" fill={ink} fontWeight="600">4.8%</text>
      </g>
      <g transform="translate(196, 120)">
        <rect width="80" height="22" rx="3" fill="#FFF" stroke={inkSoft} />
        <text x="8" y="10" fontFamily="ui-monospace, monospace" fontSize="6" fill={ink} fillOpacity="0.55" letterSpacing="0.1em">TRAFFIC</text>
        <text x="8" y="18" fontFamily="ui-monospace, monospace" fontSize="8" fill={aurora} fontWeight="600">+184%</text>
      </g>
    </g>
  );
}

function PageSpeed() {
  return (
    <g>
      {/* Semi-circle gauge + stacked waterfall */}
      <g transform="translate(160, 108)">
        <path d="M -56 0 A 56 56 0 0 1 56 0" fill="none" stroke={inkSoft} strokeWidth="8" strokeLinecap="round" />
        <path d="M -56 0 A 56 56 0 0 1 50 -25" fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round" />
        <text x="0" y="-6" fontFamily="Georgia, serif" fontSize="28" textAnchor="middle" fill={ink} fontWeight="500" fontStyle="italic">98</text>
        <text x="0" y="12" fontFamily="ui-monospace, monospace" fontSize="7" textAnchor="middle" fill={ink} fillOpacity="0.5" letterSpacing="0.14em">PAGESPEED</text>
      </g>
      {/* Waterfall bars */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={`wf-${i}`} transform={`translate(40, ${38 + i * 10})`}>
          <rect width="240" height="4" rx="1" fill={ink} fillOpacity="0.06" />
          <rect
            x={i * 18}
            width={60 + i * 12}
            height="4"
            rx="1"
            fill={i === 2 ? aurora : accent}
            fillOpacity={i === 2 ? 1 : 0.7 - i * 0.1}
          />
        </g>
      ))}
    </g>
  );
}
