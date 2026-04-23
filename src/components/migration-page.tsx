import type { ReactNode } from "react";
import { AuthorBox } from "@/components/author-box";
import { FAQAccordion, type FaqItem } from "@/components/faq-accordion";
import { Hero } from "@/components/hero";
import { ServiceCards, type ServiceCard } from "@/components/service-cards";
import { TrustBar } from "@/components/trust-bar";

type MigrationPageProps = {
  title: string;
  slug: string;
  canonicalPath: string;
  section: "services" | "blog" | "legal" | "author";
  children?: ReactNode;
};

type MigrationSection = MigrationPageProps["section"];

const sectionDescriptions: Record<MigrationSection, string> = {
  services: "Service template for parity migration with conversion-first UX blocks and FAQ/author continuity.",
  blog: "Blog template with IA-safe readability blocks and reusable conversion surfaces for migration parity.",
  legal: "Legal and conversion template with reusable trust, FAQ, and author surfaces for launch QA consistency.",
  author: "Author template with identity and proof modules that preserve structured profile semantics.",
};

const sectionCardSets: Record<MigrationSection, readonly ServiceCard[]> = {
  services: [
    {
      title: "SEO Beratung",
      description: "Strategic consulting with clear roadmap and executive-ready prioritization.",
      href: "/seo-beratung/",
      priceBadge: "Ab 1.490 EUR",
      primaryLabel: "Service öffnen",
      secondaryLabel: "Mehr zum Scope",
    },
    {
      title: "SEO Audit",
      description: "Technical and content diagnostics with implementation-ready fix clusters.",
      href: "/seo-audit/",
      primaryLabel: "Audit ansehen",
      secondaryLabel: "Audit Ablauf",
    },
    {
      title: "Content Marketing",
      description: "Search-intent content systems with scalable templates for teams.",
      href: "/content-marketing/",
      primaryLabel: "Content Modul",
      secondaryLabel: "Template prüfen",
    },
  ],
  blog: [
    {
      title: "Wissen Kategorie",
      description: "Filterable category listing with CTA rail and structured internal linking.",
      href: "/category/wissen/",
      primaryLabel: "Kategorie öffnen",
      secondaryLabel: "Listing-Muster",
    },
    {
      title: "Agentur Artikel",
      description: "Article scaffold with proof blocks, FAQ support, and author continuity.",
      href: "/agentur/",
      primaryLabel: "Artikel öffnen",
      secondaryLabel: "Lesefluss prüfen",
    },
    {
      title: "SEO Grundlagen",
      description: "Long-form content template tuned for hierarchy, scanability, and CTA cadence.",
      href: "/suchmaschinenoptimierung/",
      primaryLabel: "Template öffnen",
      secondaryLabel: "CTA Rail",
    },
  ],
  legal: [
    {
      title: "Impressum",
      description: "Policy layout with high-legibility rhythm and stable canonical surfaces.",
      href: "/impressum/",
      primaryLabel: "Seite öffnen",
      secondaryLabel: "Policy Struktur",
    },
    {
      title: "Datenschutz",
      description: "Compliance content scaffold with consistent IA and typography rules.",
      href: "/datenschutz/",
      primaryLabel: "Seite öffnen",
      secondaryLabel: "Lesbarkeit prüfen",
    },
    {
      title: "Kontakt",
      description: "Conversion-first entry with trust cues and low-friction contact pathways.",
      href: "/kontakt/",
      primaryLabel: "Kontakt öffnen",
      secondaryLabel: "Conversion Pattern",
    },
  ],
  author: [
    {
      title: "Über Uns",
      description: "Team identity template with expertise cues and profile continuity.",
      href: "/ueber-uns/",
      primaryLabel: "Profil öffnen",
      secondaryLabel: "Team Struktur",
    },
    {
      title: "Kontakt",
      description: "Author-connected conversion pathway with profile trust transfer.",
      href: "/kontakt/",
      primaryLabel: "Kontakt öffnen",
      secondaryLabel: "CTA Alignment",
    },
    {
      title: "Preise",
      description: "Offer page scaffold linked to author proof and service framing.",
      href: "/preise/",
      primaryLabel: "Preise öffnen",
      secondaryLabel: "Offer Surface",
    },
  ],
};

const sectionFaqSets: Record<MigrationSection, readonly FaqItem[]> = {
  services: [
    {
      question: "Was ist in diesem Service-Template bereits umgesetzt?",
      answer: "Hero, TrustBar, ServiceCards, FAQ and AuthorBox are wired with responsive layout and token contract styles.",
    },
    {
      question: "Bleibt die SEO-Struktur unverändert?",
      answer: "Yes. Canonical paths, metadata generation, and JSON-LD insertion points remain unchanged in the route layer.",
    },
    {
      question: "Kann dieses Template für lokale SEO-Seiten genutzt werden?",
      answer: "Yes. The same component stack is reusable for local variants while preserving route-specific schema handling.",
    },
  ],
  blog: [
    {
      question: "Unterstützt das Blog-Template weiterhin klare Leseführung?",
      answer: "Yes. Heading rhythm, spacing, and card hierarchy were adjusted for scanability on desktop and mobile.",
    },
    {
      question: "Wo liegt die Conversion-Fläche im Blog-Kontext?",
      answer: "Primary and secondary CTA surfaces remain visible via hero/actions and linked service cards.",
    },
    {
      question: "Ist die FAQ-Fläche schema-fähig vorbereitet?",
      answer: "Yes. FAQ entries expose stable data hooks and preserve the structured-data integration slot.",
    },
  ],
  legal: [
    {
      question: "Warum nutzen auch Legal-Routen UX-Komponenten?",
      answer: "Shared components keep typography, spacing, and trust surfaces consistent across all migration templates.",
    },
    {
      question: "Werden Compliance-Texte inhaltlich geändert?",
      answer: "No. This implementation focuses on layout and component wiring, not source content rewrite.",
    },
    {
      question: "Bleiben Canonical und Routing intakt?",
      answer: "Yes. Existing canonical path generation and route behavior are untouched.",
    },
  ],
  author: [
    {
      question: "Warum ist die AuthorBox auch auf Author-Templates sichtbar?",
      answer: "It preserves a consistent identity and expertise module across service and content contexts.",
    },
    {
      question: "Ist die Profilseite weiterhin schema-konform?",
      answer: "Yes. Structured-data generation remains in the page route and is not altered by the UI component wiring.",
    },
    {
      question: "Wie bleibt die mobile Darstellung stabil?",
      answer: "Breakpoints and spacing tokens enforce single-column flow and full-width CTAs at small screen sizes.",
    },
  ],
};

export function MigrationPage({ title, slug, canonicalPath, section, children }: MigrationPageProps) {
  return (
    <article className="migration-page" data-route-section={section} data-route-slug={slug}>
      <Hero
        eyebrow="Migration baseline"
        title={title}
        description={sectionDescriptions[section]}
        primaryAction={{ href: canonicalPath, label: "Template prüfen" }}
        secondaryAction={{ href: "/kontakt/", label: "Kontakt öffnen" }}
        proofBadge="1:1 URL parity active"
        stats={[
          { value: "1200px", label: "Layout max width" },
          { value: "64-96px", label: "Section rhythm" },
          { value: "AA", label: "Contrast target" },
        ]}
      />

      <p className="canonical-path">
        Canonical path: <code>{canonicalPath}</code>
      </p>

      <TrustBar
        items={["B2B SaaS", "Scale-up Ops", "Local Leaders", "Industrial Teams", "E-Commerce Growth"]}
      />

      <section className="card migration-hooks">
        <h2>Implementation hooks</h2>
        <ul>
          <li>Breadcrumb scaffold is mounted from shared shell.</li>
          <li>FAQ slot keeps schema integration compatibility in route templates.</li>
          <li>Author slot remains available for service and article trust blocks.</li>
          <li data-ux-token-scope="nor-7">Global color and typography tokens are loaded from UX contract.</li>
        </ul>
      </section>

      <ServiceCards heading="Section spotlight cards" cards={sectionCardSets[section]} />
      <FAQAccordion heading="Template FAQs" items={sectionFaqSets[section]} />

      <AuthorBox
        name="Lukas Ehrk"
        role="Technisches SEO & UX"
        expertise={["Technical SEO migrations", "Conversion-oriented IA", "Performance-first component systems"]}
        profileHref="/author/ueber-uns/"
        note="Author/reviewer block placeholder is now implemented as reusable UI component."
      />

      {children ? <section className="card migration-notes">{children}</section> : null}
    </article>
  );
}
