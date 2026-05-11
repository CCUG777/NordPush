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
  /** Optional 13px line shown below the action row — e.g. for
   *  objection-handling microcopy like "Antwort innerhalb 24 h …". */
  primaryMicrocopy?: string;
  /** data-cta key prefix for analytics — e.g. "hero-service" yields
   *  data-cta="hero-service-primary" / "-secondary" on each link. */
  ctaScope?: string;
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
  primaryMicrocopy,
  ctaScope = "hero",
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
            <Link
              className="button primary"
              href={primaryAction.href}
              data-cta={`${ctaScope}-primary`}
            >
              {primaryAction.label}
            </Link>
          ) : null}
          {secondaryAction ? (
            <Link
              className="home-refresh-secondary-link"
              href={secondaryAction.href}
              data-cta={`${ctaScope}-secondary`}
            >
              {secondaryAction.label} <span aria-hidden="true">→</span>
            </Link>
          ) : null}
          {proofBadge ? <span className="proof-pill">{proofBadge}</span> : null}
        </div>

        {primaryMicrocopy ? (
          <p className="home-refresh-microcopy hero-microcopy">{primaryMicrocopy}</p>
        ) : null}
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
