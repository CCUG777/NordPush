import Link from "next/link";
import type { ReactNode } from "react";

export type FaqItem = {
  question: string;
  answer: string;
};

type FAQAccordionProps = {
  heading?: string;
  headingLevel?: 2 | 3;
  items: readonly FaqItem[];
  aside?: ReactNode;
};

/**
 * Native <details>/<summary> accordion — zero client-side JavaScript.
 *
 * Previous implementation was a "use client" component with shared
 * useState(openIndex) across all items: every toggle re-rendered every
 * item, and the whole block hydrated on page load. claude-seo re-audit
 * P3 flagged this as an INP risk on mid-tier Android.
 *
 * The <details> element provides expand/collapse behaviour natively,
 * handles keyboard + screen-reader accessibility by spec, and works
 * without JavaScript. As a side-effect, users can open multiple FAQs
 * simultaneously — usually what they want when comparing answers,
 * whereas the "only one open at a time" behaviour of the old impl
 * forced them to close-and-reopen.
 *
 * The component is now a server component (no "use client" directive),
 * so it participates in SSG/SSR without shipping any JS for FAQ logic.
 */
export function FAQAccordion({
  heading = "Häufige Fragen",
  headingLevel = 2,
  items,
  aside,
}: FAQAccordionProps) {
  if (items.length === 0) {
    return null;
  }

  const HeadingTag = headingLevel === 2 ? "h2" : "h3";

  return (
    <section className="faq-accordion" data-ux-slot="FAQAccordion">
      <div className="faq-inner">
        <aside className="faq-aside">
          <p className="eyebrow">FAQ</p>
          <HeadingTag>{heading}</HeadingTag>
          {aside ?? (
            <>
              <p>
                Du findest deine Frage nicht? Schreib uns – wir antworten innerhalb von 24 Stunden, meist deutlich
                schneller.
              </p>
              <Link href="/kontakt/" className="button">
                Frage stellen
              </Link>
            </>
          )}
        </aside>

        <div className="faq-list">
          {items.map((item, index) => (
            <details
              key={item.question}
              className="faq-item"
              data-faq-question={item.question}
              data-faq-answer={item.answer}
              // First item open by default — matches the old
              // `initialOpenIndex=0` behaviour.
              open={index === 0 || undefined}
            >
              <summary
                className="faq-question"
                // Announces the question as a heading to screen readers
                // so the FAQ list is navigable as a structured block,
                // matching the previous <h3><button> wrapping.
                role="heading"
                aria-level={3}
              >
                <span>{item.question}</span>
                <span aria-hidden="true" className="faq-caret">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <line x1="7" y1="2" x2="7" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
