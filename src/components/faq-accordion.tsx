"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";

export type FaqItem = {
  question: string;
  answer: string;
};

type FAQAccordionProps = {
  heading?: string;
  headingLevel?: 2 | 3;
  initialOpenIndex?: number;
  items: readonly FaqItem[];
  aside?: ReactNode;
};

export function FAQAccordion({
  heading = "Häufige Fragen",
  headingLevel = 2,
  initialOpenIndex = 0,
  items,
  aside,
}: FAQAccordionProps) {
  const initialIndex = initialOpenIndex >= 0 && initialOpenIndex < items.length ? initialOpenIndex : 0;
  const [openIndex, setOpenIndex] = useState(initialIndex);
  const rootId = useId();

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
          {items.map((item, index) => {
            const buttonId = `${rootId}-question-${index}`;
            const panelId = `${rootId}-panel-${index}`;
            const isOpen = openIndex === index;

            return (
              <article key={item.question} className="faq-item" data-faq-question={item.question}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    className="faq-question"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <span>{item.question}</span>
                    <span aria-hidden="true" className="faq-caret">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <line x1="7" y1="2" x2="7" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="faq-answer"
                  data-faq-answer={item.answer}
                  hidden={!isOpen}
                >
                  <p>{item.answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
