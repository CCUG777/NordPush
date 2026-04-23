/**
 * Impressum — gesetzliche Pflichtangaben nach § 5 TMG.
 *
 * Rendering-Pattern analog zu <AgbContent />: dedizierte Komponente mit
 * ruhiger Legal-Typografie, keine Sales-Hero und keine CTA-Buttons (die
 * gehören nicht auf eine reine Pflichtangaben-Seite).
 *
 * Falls sich Firmendaten ändern (Registernummer, USt-Id, Vertretung) — nur
 * diese Datei editieren. Die Legacy-WordPress-Version in
 * `src/data/extracted-pages.ts` wird auf /impressum/ nicht mehr verwendet.
 */
export function ImpressumContent() {
  return (
    <article className="content-page legal-page" data-route-path="/impressum/">
      <header className="legal-header">
        <p className="eyebrow">Rechtliches</p>
        <h1>Impressum</h1>
        <p className="legal-lede">
          Angaben gemäß § 5 TMG. Stand: April 2026.
        </p>
      </header>

      <section className="legal-body">
        <div className="legal-block">
          <h2>Anbieter</h2>
          <address>
            Common Consulting UG (haftungsbeschränkt)
            <br />
            Biberweg 6
            <br />
            24539 Neumünster
            <br />
            Deutschland
          </address>
        </div>

        <div className="legal-block">
          <h2>Vertretungsberechtigte</h2>
          <p>Cornelia Witt (Geschäftsführerin)</p>
        </div>

        <div className="legal-block">
          <h2>Kontakt</h2>
          <dl className="legal-dl">
            <dt>Telefon</dt>
            <dd>
              <a href="tel:+491713117971">0171 / 311 79 71</a>
            </dd>
            <dt>E-Mail</dt>
            <dd>
              <a href="mailto:business@nordpush.de">business@nordpush.de</a>
            </dd>
            <dt>Support</dt>
            <dd>
              <a href="mailto:info@nordpush.de">info@nordpush.de</a>
            </dd>
          </dl>
        </div>

        <div className="legal-block">
          <h2>Registereintrag</h2>
          <dl className="legal-dl">
            <dt>Handelsregister</dt>
            <dd>HRB 23719 KI</dd>
            <dt>Registergericht</dt>
            <dd>Amtsgericht Kiel</dd>
            <dt>Steuernummer</dt>
            <dd>20/291/53144</dd>
            <dt>Umsatzsteuer-ID</dt>
            <dd>DE454984741</dd>
          </dl>
        </div>

        <div className="legal-block">
          <h2>EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
              ec.europa.eu/consumers/odr
            </a>
            . Unsere E-Mail-Adresse findest du oben unter &bdquo;Kontakt&ldquo;.
          </p>
        </div>

        <div className="legal-block">
          <h2>Verbraucherstreitbeilegung</h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </div>

        <div className="legal-footer-note">
          <p>
            Inhaltliche Verantwortlichkeit und Haftung für Inhalte nach § 7 Abs. 1 TMG bei der
            Common Consulting UG. Bei Fragen zur Website oder den Inhalten erreichst du uns unter{" "}
            <a href="mailto:info@nordpush.de">info@nordpush.de</a>.
          </p>
        </div>
      </section>
    </article>
  );
}
