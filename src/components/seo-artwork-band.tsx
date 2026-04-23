type Node = {
  id: string;
  cx: number;
  cy: number;
  label?: string;
  emphasis?: boolean;
};

type Edge = {
  from: string;
  to: string;
  accent?: boolean;
};

const nodes: readonly Node[] = [
  { id: "seed", cx: 80, cy: 240, label: "Keyword-Seed", emphasis: true },
  { id: "n1", cx: 180, cy: 140 },
  { id: "n2", cx: 180, cy: 240 },
  { id: "n3", cx: 180, cy: 340 },
  { id: "n4", cx: 300, cy: 90 },
  { id: "n5", cx: 300, cy: 180 },
  { id: "n6", cx: 300, cy: 260 },
  { id: "n7", cx: 300, cy: 340 },
  { id: "n8", cx: 300, cy: 400 },
  { id: "n9", cx: 440, cy: 110 },
  { id: "n10", cx: 440, cy: 180 },
  { id: "n11", cx: 440, cy: 260 },
  { id: "n12", cx: 440, cy: 330 },
  { id: "n13", cx: 440, cy: 400 },
  { id: "serp", cx: 600, cy: 220, label: "SERP-Cluster" },
  { id: "pipeline", cx: 740, cy: 220, label: "Pipeline", emphasis: true },
  { id: "t1", cx: 600, cy: 100 },
  { id: "t2", cx: 600, cy: 350 },
];

const edges: readonly Edge[] = [
  { from: "seed", to: "n1" },
  { from: "seed", to: "n2", accent: true },
  { from: "seed", to: "n3" },
  { from: "n1", to: "n4" },
  { from: "n1", to: "n5" },
  { from: "n2", to: "n5", accent: true },
  { from: "n2", to: "n6" },
  { from: "n3", to: "n7" },
  { from: "n3", to: "n8" },
  { from: "n4", to: "n9" },
  { from: "n5", to: "n10", accent: true },
  { from: "n5", to: "n11" },
  { from: "n6", to: "n11" },
  { from: "n7", to: "n12" },
  { from: "n8", to: "n13" },
  { from: "n9", to: "t1" },
  { from: "n10", to: "serp", accent: true },
  { from: "n11", to: "serp" },
  { from: "n12", to: "serp" },
  { from: "n13", to: "t2" },
  { from: "t1", to: "pipeline" },
  { from: "serp", to: "pipeline", accent: true },
  { from: "t2", to: "pipeline" },
];

export function SeoArtworkBand() {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n] as const));

  return (
    <svg
      viewBox="0 0 820 480"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <linearGradient id="band-accent" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0066FF" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#0066FF" stopOpacity="1" />
          <stop offset="100%" stopColor="#0066FF" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Edges */}
      {edges.map((edge) => {
        const from = byId[edge.from];
        const to = byId[edge.to];
        if (!from || !to) return null;
        return (
          <line
            key={`${edge.from}-${edge.to}`}
            x1={from.cx}
            y1={from.cy}
            x2={to.cx}
            y2={to.cy}
            stroke={edge.accent ? "url(#band-accent)" : "#0A0A0A"}
            strokeOpacity={edge.accent ? 1 : 0.12}
            strokeWidth={edge.accent ? 1.5 : 1}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node) => (
        <g key={node.id}>
          {node.emphasis ? (
            <circle
              cx={node.cx}
              cy={node.cy}
              r="18"
              fill="none"
              stroke="#0066FF"
              strokeOpacity="0.18"
              strokeWidth="1"
            />
          ) : null}
          <circle
            cx={node.cx}
            cy={node.cy}
            r={node.emphasis ? 7 : 4}
            fill="#FFFFFF"
            stroke={node.emphasis ? "#0066FF" : "#0A0A0A"}
            strokeOpacity={node.emphasis ? 1 : 0.6}
            strokeWidth={node.emphasis ? 2 : 1.2}
          />
          {node.label ? (
            <text
              x={node.cx}
              y={node.cy + 36}
              fontFamily="ui-monospace, monospace"
              fontSize="10"
              fill="#0A0A0A"
              fillOpacity="0.7"
              textAnchor="middle"
              letterSpacing="0.1em"
            >
              {node.label.toUpperCase()}
            </text>
          ) : null}
        </g>
      ))}

      {/* Phase labels */}
      <text
        x="80"
        y="40"
        fontFamily="ui-monospace, monospace"
        fontSize="10"
        fill="#0A0A0A"
        fillOpacity="0.4"
        textAnchor="middle"
        letterSpacing="0.14em"
      >
        01 · INPUT
      </text>
      <text
        x="300"
        y="40"
        fontFamily="ui-monospace, monospace"
        fontSize="10"
        fill="#0A0A0A"
        fillOpacity="0.4"
        textAnchor="middle"
        letterSpacing="0.14em"
      >
        02 · CONTENT
      </text>
      <text
        x="440"
        y="40"
        fontFamily="ui-monospace, monospace"
        fontSize="10"
        fill="#0A0A0A"
        fillOpacity="0.4"
        textAnchor="middle"
        letterSpacing="0.14em"
      >
        03 · SIGNALS
      </text>
      <text
        x="600"
        y="40"
        fontFamily="ui-monospace, monospace"
        fontSize="10"
        fill="#0A0A0A"
        fillOpacity="0.4"
        textAnchor="middle"
        letterSpacing="0.14em"
      >
        04 · RANKINGS
      </text>
      <text
        x="740"
        y="40"
        fontFamily="ui-monospace, monospace"
        fontSize="10"
        fill="#0066FF"
        fillOpacity="0.85"
        textAnchor="middle"
        letterSpacing="0.14em"
      >
        05 · PIPELINE
      </text>

      {/* Separators */}
      {[160, 380, 520, 670].map((x) => (
        <line
          key={`sep-${x}`}
          x1={x}
          y1={60}
          x2={x}
          y2={440}
          stroke="#0A0A0A"
          strokeOpacity="0.04"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
      ))}
    </svg>
  );
}
