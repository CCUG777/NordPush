type WaypointDividerProps = {
  label?: string;
  className?: string;
  variant?: "default" | "inverse";
};

/**
 * A horizontal rule with a centered compass-rose waypoint marker. Replaces
 * bare empty space between major sections with a deliberate cartographic beat.
 */
export function WaypointDivider({ label, className, variant = "default" }: WaypointDividerProps) {
  const isInverse = variant === "inverse";
  const rule = isInverse ? "rgba(255,255,255,0.12)" : "rgba(10,10,10,0.1)";
  const dot = isInverse ? "#ffffff" : "var(--ink-primary)";
  const tick = isInverse ? "rgba(255,255,255,0.5)" : "var(--ink-muted)";

  return (
    <div className={`waypoint-divider ${className ?? ""}`.trim()} aria-hidden="true">
      <span className="wp-rule" style={{ background: rule }} />
      <span className="wp-rose" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="8" fill="none" stroke={rule} strokeWidth="1" />
          <line x1="14" y1="0" x2="14" y2="4" stroke={dot as string} strokeWidth="1.4" strokeLinecap="round" />
          <line x1="14" y1="24" x2="14" y2="28" stroke={tick as string} strokeWidth="1" strokeLinecap="round" />
          <line x1="0" y1="14" x2="4" y2="14" stroke={tick as string} strokeWidth="1" strokeLinecap="round" />
          <line x1="24" y1="14" x2="28" y2="14" stroke={tick as string} strokeWidth="1" strokeLinecap="round" />
          <path d="M 14 6 L 16.5 14 L 14 12.5 L 11.5 14 Z" fill="var(--accent)" />
          <circle cx="14" cy="14" r="1.4" fill={dot as string} />
        </svg>
      </span>
      {label ? <span className="wp-label">{label}</span> : null}
      <span className="wp-rule" style={{ background: rule }} />
    </div>
  );
}
