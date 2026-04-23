type TrustBarProps = {
  heading?: string;
  items?: readonly string[];
};

const defaultTrustItems = [
  "B2B SaaS",
  "E-Commerce",
  "Industrial Manufacturers",
  "Scale-ups",
  "Local Champions",
];

export function TrustBar({ heading = "Trusted by growth-focused teams", items = defaultTrustItems }: TrustBarProps) {
  const marqueeItems = [...items, ...items];

  return (
    <section className="trust-bar card" data-ux-slot="TrustBar" aria-label={heading}>
      <p className="trust-label">{heading}</p>
      <div className="trust-marquee">
        <ul>
          {marqueeItems.map((item, index) => (
            <li key={`${item}-${index}`} className="trust-pill">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
