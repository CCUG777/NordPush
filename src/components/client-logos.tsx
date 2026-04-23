export type LogoItem = {
  name: string;
  src: string;
};

type ClientLogosProps = {
  label: string;
  logos: readonly LogoItem[];
  variant?: "grid" | "marquee";
};

export function ClientLogos({ label, logos, variant = "marquee" }: ClientLogosProps) {
  if (variant === "marquee") {
    // Duplicate logos to allow seamless looping
    const doubled = [...logos, ...logos];
    return (
      <section className="trust-bar-marquee" aria-label={label} data-ux-slot="TrustBar">
        <p className="trust-bar-marquee-label">{label}</p>
        <div className="logo-marquee">
          <div className="logo-marquee-track" aria-hidden="false">
            {doubled.map((logo, idx) => (
              <div
                key={`${logo.name}-${idx}`}
                className="logo-marquee-item"
                aria-label={idx < logos.length ? logo.name : undefined}
                aria-hidden={idx >= logos.length ? "true" : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.src} alt={idx < logos.length ? logo.name : ""} loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="trust-bar" aria-label={label} data-ux-slot="TrustBar">
      <p className="trust-label eyebrow--plain">{label}</p>
      <div className="trust-logos">
        {logos.map((logo) => (
          <div key={logo.name} className="trust-logo" aria-label={logo.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo.src} alt={logo.name} loading="lazy" decoding="async" />
          </div>
        ))}
      </div>
    </section>
  );
}
