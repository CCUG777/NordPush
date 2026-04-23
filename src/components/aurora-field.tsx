type AuroraFieldProps = {
  className?: string;
  variant?: "light" | "dark";
  intensity?: "subtle" | "full";
};

/**
 * Atmospheric aurora background — three blurred gradient blobs that drift slowly
 * (CSS animation on the SVG filter + transform). Respects prefers-reduced-motion.
 * Positions absolutely inside its parent, so parent should be `position: relative`.
 */
export function AuroraField({ className, variant = "light", intensity = "full" }: AuroraFieldProps) {
  const isDark = variant === "dark";
  const subtle = intensity === "subtle";
  const fadeCanvas = isDark ? "#0B1020" : "transparent";

  return (
    <svg
      className={`aurora-field${isDark ? " aurora-field--dark" : ""}${subtle ? " aurora-field--subtle" : ""} ${className ?? ""}`.trim()}
      viewBox="0 0 1200 600"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      <defs>
        <radialGradient id="au-blob1" cx="50%" cy="50%" r="50%">
          <stop
            offset="0%"
            stopColor={isDark ? "#2E5BFF" : "#0040E0"}
            stopOpacity={subtle ? 0.16 : isDark ? 0.55 : 0.28}
          />
          <stop offset="100%" stopColor="#0040E0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="au-blob2" cx="50%" cy="50%" r="50%">
          <stop
            offset="0%"
            stopColor={isDark ? "#2AE6B8" : "#14D9A1"}
            stopOpacity={subtle ? 0.14 : isDark ? 0.45 : 0.24}
          />
          <stop offset="100%" stopColor="#14D9A1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="au-blob3" cx="50%" cy="50%" r="50%">
          <stop
            offset="0%"
            stopColor="#FF8A3D"
            stopOpacity={subtle ? 0.1 : isDark ? 0.28 : 0.18}
          />
          <stop offset="100%" stopColor="#FF8A3D" stopOpacity="0" />
        </radialGradient>
        <filter id="au-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="40" />
        </filter>
      </defs>

      {isDark ? <rect width="1200" height="600" fill={fadeCanvas} /> : null}

      <g filter="url(#au-blur)">
        <circle className="au-a" cx="260" cy="200" r="280" fill="url(#au-blob1)" />
        <circle className="au-b" cx="820" cy="360" r="320" fill="url(#au-blob2)" />
        <circle className="au-c" cx="1040" cy="140" r="240" fill="url(#au-blob3)" />
      </g>
    </svg>
  );
}
