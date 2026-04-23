type SparklineProps = {
  data: readonly number[];
  className?: string;
  stroke?: string;
  fill?: string;
  showDot?: boolean;
  height?: number;
};

/**
 * A tiny rising curve. Takes an array of values, renders a smooth path with an
 * optional end-dot. Used in hero stats, stat callouts, testimonial cards.
 */
export function Sparkline({
  data,
  className,
  stroke = "currentColor",
  fill = "transparent",
  showDot = true,
  height = 28,
}: SparklineProps) {
  if (data.length < 2) return null;

  const width = 80;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y] as const;
  });

  const d = points
    .map(([x, y], i) => {
      if (i === 0) return `M ${x.toFixed(2)} ${y.toFixed(2)}`;
      const [px, py] = points[i - 1];
      const mx = (px + x) / 2;
      return `C ${mx.toFixed(2)} ${py.toFixed(2)}, ${mx.toFixed(2)} ${y.toFixed(2)}, ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  const last = points[points.length - 1];

  return (
    <svg
      className={`sparkline ${className ?? ""}`.trim()}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {fill !== "transparent" ? (
        <path
          d={`${d} L ${width} ${height} L 0 ${height} Z`}
          fill={fill}
          opacity="0.15"
        />
      ) : null}
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {showDot ? <circle cx={last[0]} cy={last[1]} r="2.4" fill={stroke} /> : null}
    </svg>
  );
}
