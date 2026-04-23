import Link from "next/link";

/**
 * Allgemeine Geschäftsbedingungen — Entwurfs-Template mit Abo-Klauseln.
 *
 * ⚠️ WICHTIG: Dieser Entwurf ist rechtlich NICHT geprüft. Vor dem Live-Gang
 * MUSS eine Kanzlei (Fachrichtung IT-/Vertragsrecht) den Text prüfen und
 * ggf. anpassen — insbesondere die Abo-, Eigentumsvorbehalt- und
 * Haftungsklauseln. Die §§-Nummern bleiben, der Wortlaut kann sich ändern.
 *
 * Entwurfsstand berücksichtigt:
 *   - B2B-Geschäft (keine Verbraucher-Klauseln — siehe § 1.2)
 *   - Website-Einmalleistungen (Cash)
 *   - Website-Abos mit Hosting + Wartung (Mindestlaufzeit 24 Monate)
 *   - SEO-Retainer-Abos
 *   - Bundle-Abos (Website + SEO)
 */
export function AgbContent() {
  return (
    <article className="content-page agb-page" data-route-path="/agb/">
      <header className="agb-header">
        <p className="eyebrow">Rechtliches</p>
        <h1>Allgemeine Geschäftsbedingungen</h1>
        <p className="agb-lede">
          Gültig ab Vertragsabschluss. Stand: April 2026. Diese AGB regeln die Zusammenarbeit
          zwischen NordPush (Common Consulting UG) und unseren Auftraggebern.
        </p>
      </header>

      <section className="agb-body">
        <h2>§ 1 · Geltungsbereich und Vertragspartner</h2>
        <p>
          <strong>1.1 Anbieter.</strong> Diese Allgemeinen Geschäftsbedingungen (nachfolgend
          &bdquo;AGB&ldquo;) gelten für alle Vertragsverhältnisse zwischen der Common Consulting UG
          (haftungsbeschränkt), Biberweg 6, 24539 Neumünster (nachfolgend &bdquo;NordPush&ldquo;
          oder &bdquo;Auftragnehmer&ldquo;) und ihren Auftraggebern.
        </p>
        <p>
          <strong>1.2 Zielgruppe.</strong> NordPush bietet ihre Leistungen ausschließlich an
          Unternehmer im Sinne von § 14 BGB, juristische Personen des öffentlichen Rechts und
          öffentlich-rechtliche Sondervermögen an. Verträge mit Verbrauchern (§ 13 BGB) werden
          nicht geschlossen.
        </p>
        <p>
          <strong>1.3 Vorrang.</strong> Abweichende, entgegenstehende oder ergänzende AGB des
          Auftraggebers werden nur Vertragsbestandteil, wenn NordPush ihrer Geltung ausdrücklich
          schriftlich zugestimmt hat.
        </p>

        <h2>§ 2 · Vertragsschluss</h2>
        <p>
          <strong>2.1</strong> Angebote von NordPush sind freibleibend. Ein Vertrag kommt durch
          Auftragsbestätigung per E-Mail oder durch Beginn der Leistungserbringung zustande.
        </p>
        <p>
          <strong>2.2</strong> Das Leistungsspektrum und der konkrete Umfang der beauftragten
          Leistung ergeben sich aus dem individuellen Angebot und, ergänzend, aus diesen AGB.
          Bei Widersprüchen hat das Angebot Vorrang.
        </p>

        <h2>§ 3 · Leistungsumfang</h2>
        <p>
          <strong>3.1 Website-Projekte (Cash).</strong> NordPush erbringt Konzeption, Design,
          Entwicklung und Abnahme einer Website im Umfang des jeweiligen Angebots gegen eine
          einmalige Vergütung. Nach Abnahme gehen Code, Content und sämtliche Nutzungsrechte auf
          den Auftraggeber über (siehe § 9).
        </p>
        <p>
          <strong>3.2 Website-Abos.</strong> Beim Abo-Modell stellt NordPush die Website auf ihrer
          Infrastruktur bereit und übernimmt laufend Hosting, Wartung, Sicherheits-Updates,
          Backups und die im Angebot definierten Änderungskontingente. Die Mindestlaufzeit beträgt
          24 Monate, sofern nicht anders vereinbart.
        </p>
        <p>
          <strong>3.3 SEO-Retainer.</strong> SEO-Retainer sind Dauerleistungen mit definiertem
          monatlichen Leistungsumfang (Beratung, Monitoring, Content, Backlinks — je nach Tarif).
          Die Mindestlaufzeit beträgt 6 Monate, sofern nicht anders vereinbart.
        </p>
        <p>
          <strong>3.4 Bundles.</strong> Bundles (Website-Abo + SEO-Retainer) unterliegen einer
          einheitlichen Mindestlaufzeit von 12 Monaten, danach Kündigung mit einer Frist von
          3 Monaten zum Monatsende möglich.
        </p>
        <p>
          <strong>3.5 Keine Erfolgsgarantie.</strong> NordPush schuldet Dienst- bzw.
          Werkleistungen, jedoch keinen bestimmten Erfolg — insbesondere keine konkreten
          Ranking-, Traffic- oder Umsatz-Zielerreichungen. Dies ist auch bei SEO-Leistungen
          nicht zu gewährleisten, da Suchmaschinen ihre Algorithmen eigenständig anpassen.
        </p>

        <h2>§ 4 · Preise, Zahlungsbedingungen, Lastschrift</h2>
        <p>
          <strong>4.1</strong> Es gelten die im Angebot bzw. im jeweiligen Auftragsbestätigungs-
          Dokument aufgeführten Preise. Alle Preise verstehen sich zuzüglich der gesetzlichen
          Umsatzsteuer.
        </p>
        <p>
          <strong>4.2 Cash-Projekte.</strong> Rechnungen sind innerhalb von 14 Tagen nach
          Rechnungsstellung ohne Abzug zur Zahlung fällig. NordPush kann bei Projektbeginn eine
          Anzahlung von bis zu 50 % des Auftragsvolumens verlangen.
        </p>
        <p>
          <strong>4.3 Abos.</strong> Abo-Gebühren sind monatlich im Voraus fällig und werden per
          SEPA-Basislastschrift eingezogen. Der Auftraggeber erteilt bei Vertragsabschluss ein
          entsprechendes SEPA-Mandat.
        </p>
        <p>
          <strong>4.4 Zahlungsverzug.</strong> Bei Zahlungsverzug ist NordPush berechtigt,
          Verzugszinsen in gesetzlicher Höhe zu berechnen. Bei zwei aufeinanderfolgenden
          Rücklastschriften oder ausbleibenden Zahlungen kann NordPush die im Rahmen eines Abos
          bereitgestellte Website nach vorheriger Ankündigung temporär pausieren, bis der
          Rückstand ausgeglichen ist.
        </p>

        <h2>§ 5 · Mitwirkungspflichten des Auftraggebers</h2>
        <p>
          <strong>5.1</strong> Der Auftraggeber stellt NordPush rechtzeitig alle für die
          Leistungserbringung erforderlichen Unterlagen, Zugänge und Informationen zur Verfügung
          (insbesondere Content, Markenrichtlinien, Domain- und Hosting-Zugänge, Analytics-
          Anbindungen).
        </p>
        <p>
          <strong>5.2</strong> Der Auftraggeber gewährleistet, dass alle von ihm bereitgestellten
          Inhalte (Texte, Bilder, Videos, Logos) frei von Rechten Dritter sind bzw. er über die
          erforderlichen Nutzungs- und Verwertungsrechte verfügt.
        </p>
        <p>
          <strong>5.3</strong> Verzögerungen durch ausbleibende Mitwirkung des Auftraggebers
          berechtigen NordPush zur Verlängerung vereinbarter Fristen um die entsprechende
          Zeitspanne.
        </p>

        <h2>§ 6 · Laufzeit und Kündigung (Abo-Modelle)</h2>
        <p>
          <strong>6.1 Mindestlaufzeit.</strong> Website-Abos haben eine Mindestlaufzeit von
          24 Monaten ab Launch. SEO-Retainer haben eine Mindestlaufzeit von 6 Monaten. Bundles
          (Website + SEO) haben eine Mindestlaufzeit von 12 Monaten.
        </p>
        <p>
          <strong>6.2 Verlängerung.</strong> Nach Ablauf der Mindestlaufzeit verlängert sich das
          Abo um jeweils einen weiteren Monat, sofern es nicht mit einer Frist von einem Monat
          zum Monatsende gekündigt wird.
        </p>
        <p>
          <strong>6.3 Außerordentliche Kündigung.</strong> Das Recht zur außerordentlichen
          Kündigung aus wichtigem Grund bleibt für beide Parteien unberührt. Ein wichtiger Grund
          liegt für NordPush insbesondere bei dauerhaftem Zahlungsverzug oder bei Verletzung
          wesentlicher Mitwirkungspflichten vor.
        </p>
        <p>
          <strong>6.4 Form.</strong> Kündigungen bedürfen der Textform (E-Mail an
          <a href="mailto:info@nordpush.de"> info@nordpush.de</a> genügt).
        </p>

        <h2>§ 7 · Beendigung des Website-Abos, Export und Ablöse</h2>
        <p>
          <strong>7.1 Export.</strong> Bei ordentlicher Beendigung eines Website-Abos stellt
          NordPush dem Auftraggeber auf Wunsch ein vollständiges Export-Paket zur Verfügung
          (Quellcode, Datenbank, Media-Assets, Dokumentation). Der Export erfolgt innerhalb von
          14 Tagen nach Vertragsende.
        </p>
        <p>
          <strong>7.2 Eigentumsvorbehalt während der Laufzeit.</strong> Während der Abo-Laufzeit
          bleiben die im Rahmen des Abos entwickelten Code-Bestandteile (Theme, Templates,
          Konfigurationen) im Eigentum von NordPush. Der Auftraggeber erhält ein nicht-exklusives,
          nicht übertragbares Nutzungsrecht für die Laufzeit des Abos.
        </p>
        <p>
          <strong>7.3 Übernahme.</strong> Nach Ablauf der Mindestlaufzeit kann der Auftraggeber
          die Website durch Zahlung einer Übernahme-Pauschale von 25 % der ursprünglichen
          Cash-Listenpreises vollständig übernehmen. Nach Zahlung der Ablöse gehen sämtliche
          Nutzungs- und Verwertungsrechte auf den Auftraggeber über.
        </p>
        <p>
          <strong>7.4 Pause bei Zahlungsausfall.</strong> Bei nicht ausgeglichenem Zahlungsrückstand
          über mehr als 60 Tage ist NordPush nach vorheriger schriftlicher Ankündigung mit
          mindestens 14 Tagen Vorlauf berechtigt, die Website temporär offline zu nehmen, bis der
          Rückstand beglichen ist oder das Abo ordentlich beendet wird.
        </p>

        <h2>§ 8 · Gewährleistung</h2>
        <p>
          <strong>8.1</strong> NordPush gewährleistet, dass die erbrachten Leistungen frei von
          Mängeln sind, die den Wert oder die Tauglichkeit zum gewöhnlichen oder vertraglich
          vorausgesetzten Gebrauch nicht unerheblich mindern.
        </p>
        <p>
          <strong>8.2 Werkvertragliche Leistungen.</strong> Bei Werkleistungen (insbesondere
          Website-Projekten) gilt die gesetzliche Gewährleistungsfrist von einem Jahr ab Abnahme.
          NordPush wird bei berechtigten Mängelrügen kostenfrei nachbessern oder Ersatz leisten.
        </p>
        <p>
          <strong>8.3 Dauerschuldverhältnisse.</strong> Bei Abos und Retainern wird die Leistung
          fortlaufend erbracht; Mängelrügen sind unverzüglich per E-Mail anzuzeigen.
        </p>

        <h2>§ 9 · Urheber- und Nutzungsrechte</h2>
        <p>
          <strong>9.1 Cash-Projekte.</strong> Mit vollständiger Zahlung der vereinbarten Vergütung
          räumt NordPush dem Auftraggeber das ausschließliche, zeitlich, räumlich und inhaltlich
          unbeschränkte Nutzungs- und Verwertungsrecht an allen im Rahmen des Projekts
          geschaffenen Werkleistungen (Code, Design, Texte, sofern von NordPush erstellt) ein.
        </p>
        <p>
          <strong>9.2 Abo-Modelle.</strong> Während der Abo-Laufzeit verbleiben Nutzungsrechte bei
          NordPush und werden dem Auftraggeber zur Nutzung zur Verfügung gestellt (siehe § 7.2).
          Nach Übernahme-Pauschale (§ 7.3) oder nach Ablauf einer Abo-Laufzeit mit vollständiger
          Zahlung aller Raten wird das Nutzungsrecht in ein ausschließliches Nutzungsrecht gemäß
          § 9.1 umgewandelt.
        </p>
        <p>
          <strong>9.3 Referenzrecht.</strong> NordPush ist berechtigt, den Auftraggeber als
          Referenz (inkl. Logo und Projektübersicht) auf ihrer Website und in Marketingmaterialien
          zu nennen. Der Auftraggeber kann diesem Referenzrecht jederzeit widersprechen.
        </p>

        <h2>§ 10 · Haftung</h2>
        <p>
          <strong>10.1</strong> NordPush haftet uneingeschränkt für Schäden aus der Verletzung
          des Lebens, des Körpers oder der Gesundheit sowie für Schäden, die auf Vorsatz oder
          grober Fahrlässigkeit beruhen.
        </p>
        <p>
          <strong>10.2</strong> Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten
          (Kardinalpflichten) ist die Haftung auf den bei Vertragsabschluss typischerweise
          vorhersehbaren, vertragstypischen Schaden begrenzt. Bei leicht fahrlässiger Verletzung
          nicht wesentlicher Vertragspflichten ist die Haftung ausgeschlossen.
        </p>
        <p>
          <strong>10.3</strong> Die Haftung für Datenverluste ist auf den typischen
          Wiederherstellungsaufwand beschränkt, der bei regelmäßiger und gefahrentsprechender
          Anfertigung von Sicherungskopien eingetreten wäre.
        </p>

        <h2>§ 11 · Datenschutz</h2>
        <p>
          NordPush verarbeitet personenbezogene Daten nur im Rahmen der gesetzlichen
          Bestimmungen (DSGVO, BDSG). Details finden sich in unserer{" "}
          <Link href="/datenschutz/" className="text-link">
            Datenschutzerklärung
          </Link>
          . Bei der Verarbeitung personenbezogener Daten im Kundenauftrag (z. B. Hosting einer
          Website mit Kontaktformular) schließen die Parteien einen separaten
          Auftragsverarbeitungsvertrag (AVV) ab.
        </p>

        <h2>§ 12 · Schlussbestimmungen</h2>
        <p>
          <strong>12.1 Anwendbares Recht.</strong> Es gilt das Recht der Bundesrepublik Deutschland
          unter Ausschluss des UN-Kaufrechts.
        </p>
        <p>
          <strong>12.2 Gerichtsstand.</strong> Ausschließlicher Gerichtsstand für alle
          Streitigkeiten aus diesem Vertragsverhältnis ist Neumünster, soweit der Auftraggeber
          Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches
          Sondervermögen ist.
        </p>
        <p>
          <strong>12.3 Salvatorische Klausel.</strong> Sollte eine Bestimmung dieser AGB ganz oder
          teilweise unwirksam sein oder werden, so wird dadurch die Wirksamkeit der übrigen
          Bestimmungen nicht berührt. An die Stelle der unwirksamen Bestimmung tritt die gesetzlich
          zulässige Regelung, die dem wirtschaftlich Gewollten am nächsten kommt.
        </p>
        <p>
          <strong>12.4 Textform.</strong> Änderungen und Ergänzungen dieser AGB sowie
          Nebenabreden bedürfen der Textform. Dies gilt auch für die Abbedingung des
          Textformerfordernisses selbst.
        </p>

        <div className="agb-footer-note">
          <p>
            <strong>Hinweis:</strong> Bei Rückfragen zu diesen AGB oder zur konkreten
            Ausgestaltung eines Vertrags erreichst du uns jederzeit unter{" "}
            <a href="mailto:info@nordpush.de">info@nordpush.de</a>.
          </p>
        </div>
      </section>
    </article>
  );
}
