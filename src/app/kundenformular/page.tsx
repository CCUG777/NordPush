import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { KundenfragebogenForm } from "@/components/kundenfragebogen-form";

export const metadata: Metadata = {
  title: "Kundenfragebogen – Website & Webshop | NordPush",
  description:
    "Teile uns in wenigen Schritten mit, was du planst. Wir melden uns zeitnah mit einem konkreten Angebot.",
  robots: { index: false, follow: false },
};

export default function KundenformularPage() {
  return (
    <SiteShell>
      <section className="kf-page-hero">
        <div className="kf-page-hero-inner">
          <p className="eyebrow">Website &amp; Webshop</p>
          <h1>Kundenfragebogen</h1>
          <p className="kf-page-lede">
            Damit wir dein Projekt von Anfang an richtig einsch&auml;tzen k&ouml;nnen
            &mdash; f&uuml;ll den Fragebogen in ca.&nbsp;5&nbsp;Minuten aus.
            Wir melden uns innerhalb von 24&nbsp;h mit einer ersten
            Einsch&auml;tzung.
          </p>
        </div>
      </section>

      <KundenfragebogenForm />
    </SiteShell>
  );
}
