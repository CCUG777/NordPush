type NordPushMarkProps = {
  size?: number;
  className?: string;
  title?: string;
};

export function NordPushMark({ size = 32, className, title }: NordPushMarkProps) {
  const labelled = Boolean(title);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={labelled ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id="np-needle" x1="20" y1="22" x2="20" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0040E0" />
          <stop offset="60%" stopColor="#1A7BFF" />
          <stop offset="100%" stopColor="#14D9A1" />
        </linearGradient>
      </defs>

      {/* Compass ring */}
      <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.25" />

      {/* Cardinal ticks */}
      <line x1="20" y1="2.5" x2="20" y2="5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="2.5" y1="20" x2="5" y2="20" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" strokeLinecap="round" />
      <line x1="35" y1="20" x2="37.5" y2="20" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" strokeLinecap="round" />
      <line x1="20" y1="34.5" x2="20" y2="37.5" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" strokeLinecap="round" />

      {/* North blade — aurora-gradient sharp kite */}
      <path d="M 20 6 L 25.5 22 L 20 18.5 L 14.5 22 Z" fill="url(#np-needle)" />

      {/* South counterweight — ink */}
      <path d="M 20 34 L 16 22 L 20 22.5 L 24 22 Z" fill="currentColor" fillOpacity="0.28" />

      {/* Pivot */}
      <circle cx="20" cy="22" r="1.7" fill="currentColor" />
      <circle cx="20" cy="22" r="0.7" fill="#FFFFFF" />
    </svg>
  );
}
