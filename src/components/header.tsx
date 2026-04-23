"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type NavLink = {
  href: string;
  label: string;
};

type MegaCategory = {
  title: string;
  links: readonly NavLink[];
};

const megaCategories: readonly MegaCategory[] = [
  {
    title: "Strategie",
    links: [
      { href: "/seo-beratung/", label: "SEO Beratung" },
      { href: "/seo-audit/", label: "SEO Audit" },
      { href: "/seo-strategie/", label: "SEO Strategie" },
      { href: "/seo-konkurrenzanalyse/", label: "Konkurrenzanalyse" },
      { href: "/keyword-recherche/", label: "Keyword Recherche" },
    ],
  },
  {
    title: "Technik & OnPage",
    links: [
      { href: "/technisches-seo-audit/", label: "Technisches SEO Audit" },
      { href: "/seo-relaunch/", label: "SEO Relaunch" },
      { href: "/pagespeed-optimierung/", label: "PageSpeed Optimierung" },
      { href: "/wordpress-seo/", label: "WordPress SEO" },
      { href: "/e-commerce-seo/", label: "E-Commerce SEO" },
    ],
  },
  {
    title: "Betreuung",
    links: [
      { href: "/seo-betreuung/", label: "SEO Betreuung" },
      { href: "/b2b-seo-agentur/", label: "B2B SEO" },
      { href: "/seo-monitoring/", label: "SEO Monitoring" },
      { href: "/internationales-seo/", label: "Internationales SEO" },
      { href: "/seo-fuer-lokale-unternehmen/", label: "Lokale SEO" },
    ],
  },
  {
    title: "Content & Ausbau",
    links: [
      { href: "/content-marketing/", label: "Content Marketing" },
      { href: "/seo-texte-schreiben/", label: "SEO Texte" },
      { href: "/backlinks/", label: "Backlinks" },
      { href: "/geo-optimierung/", label: "GEO Optimierung" },
      { href: "/google-unternehmensprofil/", label: "Google Unternehmensprofil" },
    ],
  },
];

export function Header() {
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const megaRef = useRef<HTMLLIElement>(null);
  const mobileRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  // Close mega + mobile on route change
  useEffect(() => {
    setMegaOpen(false);
    if (mobileRef.current) mobileRef.current.open = false;
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMegaOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const openMega = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setMegaOpen(true);
  }, []);

  const closeMega = useCallback(() => {
    // Small delay so the cursor can cross the gap between trigger and panel
    closeTimer.current = setTimeout(() => setMegaOpen(false), 120);
  }, []);

  return (
    <header className="site-header" data-ux-slot="Header">
      <div className="site-header-utility">
        <div className="shell-inner">
          <span className="utility-trust">Websites und SEO für Unternehmen mit Anspruch an Substanz und Klarheit</span>
        </div>
      </div>

      <div className="site-header-main">
        <div className="shell-inner">
          <Link href="/" className="brand" aria-label="NordPush Startseite">
            <Image
              src="/logos/nordpush-logo.svg"
              alt="NordPush"
              width={168}
              height={32}
              priority
              className="brand-logo"
            />
          </Link>

          <nav aria-label="Primäre Website-Navigation" className="primary-nav">
            <ul className="primary-nav-list">
              <li
                ref={megaRef}
                className={`has-mega${megaOpen ? " mega-open" : ""}`}
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
              >
                <button
                  type="button"
                  className="mega-trigger"
                  aria-haspopup="true"
                  aria-expanded={megaOpen}
                  onClick={() => setMegaOpen((v) => !v)}
                >
                  SEO
                  <span aria-hidden="true" className="mega-caret">
                    ▾
                  </span>
                </button>
                <div className="services-mega" aria-label="SEO-Leistungsübersicht">
                  {megaCategories.map((category) => (
                    <div key={category.title} className="mega-column">
                      <p className="mega-column-title">{category.title}</p>
                      <ul>
                        {category.links.map((link) => (
                          <li key={link.href}>
                            <Link href={link.href}>{link.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </li>
              <li>
                <Link href="/websites/">Websites</Link>
              </li>
              <li>
                <Link href="/ueber-uns/">Agentur</Link>
              </li>
              <li>
                <Link href="/category/wissen/">Wissen</Link>
              </li>
              <li>
                <Link href="/kontakt/">Kontakt</Link>
              </li>
            </ul>
          </nav>

          <div className="header-cta-pair">
            <Link href="/preise/" className="button">
              Preise
            </Link>
            <Link href="/kontakt/" className="button primary">
              Ersteinschätzung
            </Link>
          </div>

          <details ref={mobileRef} className="mobile-menu">
            <summary>Menü</summary>
            <nav className="mobile-menu-sheet" aria-label="Mobile Navigation">
              <details className="mobile-services" open>
                <summary>SEO</summary>
                {megaCategories.map((category) => (
                  <div key={`mobile-${category.title}`} className="mobile-mega-column">
                    <p className="mobile-mega-title">{category.title}</p>
                    <ul>
                      {category.links.map((link) => (
                        <li key={`mobile-${link.href}`}>
                          <Link href={link.href}>{link.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </details>
              <ul className="mobile-top-links">
                <li>
                  <Link href="/websites/">Websites</Link>
                </li>
                <li>
                  <Link href="/ueber-uns/">Agentur</Link>
                </li>
                <li>
                  <Link href="/category/wissen/">Wissen</Link>
                </li>
                <li>
                  <Link href="/kontakt/">Kontakt</Link>
                </li>
                <li>
                  <Link href="/preise/">Preise</Link>
                </li>
              </ul>
              <Link href="/kontakt/" className="button primary mobile-menu-cta">
                Kostenlose Ersteinschätzung
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
