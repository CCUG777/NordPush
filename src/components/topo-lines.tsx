type TopoLinesProps = {
  className?: string;
  variant?: "default" | "inverse" | "accent";
  seed?: number;
};

/**
 * Topographic isoline decorator. Renders organic concentric bezier loops as a
 * subtle cartographic texture. Purely decorative — positions absolutely inside
 * its parent, so the parent should be `position: relative`.
 */
export function TopoLines({ className, variant = "default", seed = 0 }: TopoLinesProps) {
  const stroke =
    variant === "inverse"
      ? "rgba(255,255,255,0.06)"
      : variant === "accent"
      ? "rgba(0,64,224,0.08)"
      : "rgba(10,10,10,0.05)";
  const strokeStrong =
    variant === "inverse"
      ? "rgba(255,255,255,0.1)"
      : variant === "accent"
      ? "rgba(20,217,161,0.18)"
      : "rgba(10,10,10,0.08)";

  const loops = buildLoops(seed);

  return (
    <svg
      className={className}
      viewBox="0 0 800 400"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      {loops.map((d, i) => (
        <path
          key={`topo-${i}`}
          d={d}
          fill="none"
          stroke={i === Math.floor(loops.length / 2) ? strokeStrong : stroke}
          strokeWidth={i === Math.floor(loops.length / 2) ? 1.2 : 0.9}
        />
      ))}
    </svg>
  );
}

function buildLoops(seed: number): string[] {
  // Deterministic pseudo-random — so SSR and client render identically
  const rand = mulberry32(seed + 1337);
  const cx = 520;
  const cy = 220;
  const loops: string[] = [];
  for (let i = 0; i < 11; i++) {
    const r = 40 + i * 28;
    const wobble = 0.08 + i * 0.015;
    const a = r * (1 + (rand() - 0.5) * wobble);
    const b = r * (1 + (rand() - 0.5) * wobble);
    const c = r * (1 + (rand() - 0.5) * wobble);
    const d = r * (1 + (rand() - 0.5) * wobble);
    loops.push(
      `M ${cx - a} ${cy} C ${cx - a} ${cy - b * 0.8}, ${cx - c * 0.4} ${cy - b}, ${cx} ${cy - b} S ${cx + a} ${cy - c * 0.8}, ${cx + a} ${cy} S ${cx + c * 0.4} ${cy + d}, ${cx} ${cy + d} S ${cx - a} ${cy + c * 0.8}, ${cx - a} ${cy} Z`
    );
  }
  return loops;
}

function mulberry32(a: number): () => number {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
