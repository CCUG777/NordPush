import Link from "next/link";
import type { ReactNode } from "react";

export type ServiceCard = {
  title: string;
  description: string;
  href: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  priceBadge?: string;
  illustration?: ReactNode;
};

type ServiceCardsProps = {
  heading?: string;
  cards: readonly ServiceCard[];
};

export function ServiceCards({ heading = "Service spotlights", cards }: ServiceCardsProps) {
  return (
    <section className="service-cards" data-ux-slot="ServiceCards" aria-label={heading}>
      <h2>{heading}</h2>
      <div className="service-cards-grid">
        {cards.map((card) => (
          <article className="service-card" key={card.href}>
            {card.illustration ? (
              <div className="service-card-illustration" aria-hidden="true">
                {card.illustration}
              </div>
            ) : null}
            <div className="service-card-body">
              <div className="service-card-headline">
                <h3>{card.title}</h3>
                {card.priceBadge ? <span className="price-badge">{card.priceBadge}</span> : null}
              </div>
              <p>{card.description}</p>
              <div className="service-card-actions">
                <Link href={card.href} className="text-link">
                  {card.primaryLabel ?? "Mehr erfahren →"}
                </Link>
                {card.secondaryLabel ? (
                  <Link href={card.href} className="text-link" style={{ opacity: 0.6 }}>
                    {card.secondaryLabel}
                  </Link>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
