import Link from "next/link";

type HeroAction = {
  href: string;
  label: string;
};

type HeroStat = {
  label: string;
  value: string;
};

type HeroProps = {
  eyebrow?: string;
  proofBadge?: string;
  title: string;
  description: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  stats?: readonly HeroStat[];
  headingLevel?: "h1" | "h2";
};

export function Hero({
  eyebrow,
  proofBadge,
  title,
  description,
  primaryAction,
  secondaryAction,
  stats = [],
  headingLevel = "h1",
}: HeroProps) {
  const HeadingTag = headingLevel;

  return (
    <section className="hero-block card" data-ux-slot="Hero">
      <div className="hero-copy">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <HeadingTag>{title}</HeadingTag>
        <p>{description}</p>

        <div className="hero-actions">
          {primaryAction ? (
            <Link className="button primary" href={primaryAction.href}>
              {primaryAction.label}
            </Link>
          ) : null}
          {secondaryAction ? (
            <Link className="button" href={secondaryAction.href}>
              {secondaryAction.label}
            </Link>
          ) : null}
          {proofBadge ? <span className="proof-pill">{proofBadge}</span> : null}
        </div>
      </div>

      <div className="hero-stats" aria-label="Quick trust stats">
        {stats.map((stat) => (
          <article className="hero-stat" key={stat.label}>
            <p className="hero-stat-value">{stat.value}</p>
            <p className="hero-stat-label">{stat.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
