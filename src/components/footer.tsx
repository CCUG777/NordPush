import Image from "next/image";
import Link from "next/link";

type FooterLink = {
  href: string;
  label: string;
};

type FooterGroup = {
  title: string;
  links: readonly FooterLink[];
};

const footerGroups: readonly FooterGroup[] = [
  {
    title: "SEO",
    links: [
      { href: "/seo-strategie/", label: "SEO Strategie" },
      { href: "/technisches-seo-audit/", label: "Technisches SEO" },
      { href: "/content-marketing/", label: "Content Marketing" },
      { href: "/seo-betreuung/", label: "SEO Betreuung" },
    ],
  },
  {
    title: "Websites",
    links: [
      { href: "/websites/", label: "Übersicht" },
      { href: "/websites/#wordpress", label: "WordPress" },
      { href: "/websites/#landingpages", label: "Landingpages" },
      { href: "/websites/#shops", label: "Online-Shops" },
      { href: "/websites/#wartung", label: "Website-Wartung" },
    ],
  },
  {
    title: "Agentur",
    links: [
      { href: "/ueber-uns/", label: "Über uns" },
      { href: "/preise/", label: "Preise" },
      { href: "/kontakt/", label: "Kontakt" },
      { href: "/seo-neumuenster/", label: "SEO in Neumünster" },
    ],
  },
  {
    title: "Wissen",
    links: [
      { href: "/category/wissen/", label: "Wissensbereich" },
      { href: "/agentur/", label: "Agentur-Blog" },
      { href: "/suchmaschinenoptimierung/", label: "SEO Grundlagen" },
    ],
  },
  {
    title: "Rechtliches",
    links: [
      { href: "/impressum/", label: "Impressum" },
      { href: "/datenschutz/", label: "Datenschutz" },
      { href: "/agb/", label: "AGB" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" data-ux-slot="Footer">
      <div className="shell-inner">
        <div className="footer-topline">
          <div className="footer-brand-block">
            <p className="footer-brand">
              <Image
                src="/logos/nordpush-logo.svg"
                alt="NordPush"
                width={200}
                height={38}
                className="brand-logo brand-logo--invert"
              />
            </p>
            <p className="footer-tagline">
              Websites und SEO aus einer Hand — für Unternehmen, die Nachfrage, Technik und Conversion nicht
              länger getrennt behandeln wollen.
            </p>
          </div>

          <div className="footer-top-actions">
            <Link href="/kontakt/" className="button primary">
              Projekt anfragen
            </Link>
          </div>
        </div>

        <div className="footer-groups">
          {footerGroups.map((group) => (
            <section key={group.title} className="footer-group">
              <h2>{group.title}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="footer-contact">
            <h2>Kontakt</h2>
            <address>
              Common Consulting UG
              <br />
              Biberweg 6
              <br />
              24539 Neumünster
              <br />
              <a href="mailto:support@nordpush.de">support@nordpush.de</a>
            </address>
          </section>
        </div>

        <div className="footer-meta">
          <p>© {year} Common Consulting UG</p>
          <p>NordPush · SEO & Website-Agentur aus Neumünster</p>
        </div>
      </div>
    </footer>
  );
}
