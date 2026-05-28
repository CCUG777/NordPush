"use client";

import { useState, useRef, useCallback, Fragment } from "react";

/* ── Submission endpoint — internal API route, same SMTP as /api/contact ── */
const API_URL = "/api/fragebogen";

const STEP_LABELS = [
  "Kontakt",
  "Projekt",
  "Design",
  "Technik",
  "Zeitplan",
  "Absenden",
] as const;
const TOTAL = STEP_LABELS.length;

/* ── Form state shape ──────────────────────────────────────────────────────── */
interface KfForm {
  // Step 0
  f_firma: string;
  f_ap: string;
  f_email: string;
  f_tel: string;
  f_branche: string;
  f_standort: string;
  f_url: string;
  // Step 1
  c_typ: string;
  f_sonstiges_typ: string;
  c_anzahl: string;
  c_shop: string;
  c_cms: string;
  c_ziel: string[];
  f_zg: string;
  f_usps: string;
  f_konkurrenz: string;
  // Step 2
  c_stil: string;
  f_stil_anm: string;
  f_farbe: string;
  f_ref: string;
  c_inhalte: string[];
  f_seiten: string;
  // Step 3
  c_features: string[];
  f_ss: string;
  c_texte: string;
  f_kw: string;
  c_gmb: string;
  c_social: string[];
  // Step 4
  f_termin: string;
  c_prio: string;
  c_pflege: string;
  // Step 5
  f_sonstiges: string;
}

const EMPTY: KfForm = {
  f_firma: "",
  f_ap: "",
  f_email: "",
  f_tel: "",
  f_branche: "",
  f_standort: "",
  f_url: "",
  c_typ: "",
  f_sonstiges_typ: "",
  c_anzahl: "",
  c_shop: "",
  c_cms: "",
  c_ziel: [],
  f_zg: "",
  f_usps: "",
  f_konkurrenz: "",
  c_stil: "",
  f_stil_anm: "",
  f_farbe: "",
  f_ref: "",
  c_inhalte: [],
  f_seiten: "",
  c_features: [],
  f_ss: "",
  c_texte: "",
  f_kw: "",
  c_gmb: "",
  c_social: [],
  f_termin: "",
  c_prio: "",
  c_pflege: "",
  f_sonstiges: "",
};

/* ── Helpers ───────────────────────────────────────────────────────────────── */
function fmtSize(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
}

function buildSummary(form: KfForm, files: File[]): string {
  const d = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const gv = (v: string) => v.trim() || "--";
  const gs = (v: string | string[]) =>
    Array.isArray(v) ? (v.length ? v.join(", ") : "--") : v || "--";
  const LINE = "=".repeat(56);
  const DASH = "-".repeat(56);
  return [
    "NORDPUSH KUNDENFRAGEBOGEN  |  Website / Webshop",
    LINE,
    "",
    "  Erstellt am:        " + d,
    "  Firma:              " + gv(form.f_firma),
    "",
    DASH,
    "  01  KONTAKT",
    DASH,
    "  Ansprechpartner:    " + gv(form.f_ap),
    "  E-Mail:             " + gv(form.f_email),
    "  Telefon:            " + gv(form.f_tel),
    "  Branche:            " + gv(form.f_branche),
    "  Standort:           " + gv(form.f_standort),
    "  Website:            " + gv(form.f_url),
    "",
    DASH,
    "  02  PROJEKT & ZIELE",
    DASH,
    "  Projekttyp:         " + gs(form.c_typ),
    "  Sonstiges Vorhaben: " + gv(form.f_sonstiges_typ),
    "  Produktanzahl:      " + gs(form.c_anzahl),
    "  Shop-System:        " + gs(form.c_shop),
    "  CMS:                " + gs(form.c_cms),
    "  Hauptziele:         " + gs(form.c_ziel),
    "  Zielgruppe:         " + gv(form.f_zg),
    "  USPs:               " + gv(form.f_usps),
    "  Mitbewerber:        " + gv(form.f_konkurrenz),
    "",
    DASH,
    "  03  DESIGN",
    DASH,
    "  Design-Stil:        " + gs(form.c_stil),
    "  Anmerkungen:        " + gv(form.f_stil_anm),
    "  Markenfarbe:        " + gv(form.f_farbe),
    "  Referenz-Sites:     " + gv(form.f_ref),
    "  Vorh. Inhalte:      " + gs(form.c_inhalte),
    "  Gewuenschte Seiten: " + gv(form.f_seiten),
    "",
    DASH,
    "  04  TECHNIK & SEO",
    DASH,
    "  Features:           " + gs(form.c_features),
    "  Schnittstellen:     " + gv(form.f_ss),
    "  Textbedarf:         " + gs(form.c_texte),
    "  Keywords:           " + gv(form.f_kw),
    "  Google My Business: " + gs(form.c_gmb),
    "  Social Media:       " + gs(form.c_social),
    "",
    DASH,
    "  05  ZEITPLAN",
    DASH,
    "  Launch-Termin:      " + gv(form.f_termin),
    "  Prioritaet:         " + gs(form.c_prio),
    "  Pflege:             " + gs(form.c_pflege),
    "",
    DASH,
    "  06  ANMERKUNGEN & DATEIEN",
    DASH,
    "  Sonstiges:          " + gv(form.f_sonstiges),
    "  Dateien:            " +
      (files.length ? files.map((f) => f.name).join(", ") : "--"),
    "",
    LINE,
    "  NordPush -- Deine SEO-Agentur",
    "  www.nordpush.de  |  info@nordpush.de",
    LINE,
  ].join("\n");
}

/* ── Main component ────────────────────────────────────────────────────────── */
export function KundenfragebogenForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<KfForm>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setField = useCallback(
    (key: keyof KfForm, value: string) => {
      setForm((f) => ({ ...f, [key]: value }));
      setErrors((e) => {
        const next = { ...e };
        delete next[key];
        return next;
      });
    },
    [],
  );

  const toggleSingle = useCallback((key: keyof KfForm, value: string) => {
    setForm((f) => ({ ...f, [key]: f[key] === value ? "" : value }));
  }, []);

  const toggleMulti = useCallback((key: keyof KfForm, value: string) => {
    setForm((f) => {
      const arr = (f[key] as string[]) ?? [];
      const i = arr.indexOf(value);
      return {
        ...f,
        [key]: i > -1 ? arr.filter((_, idx) => idx !== i) : [...arr, value],
      };
    });
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  }, []);

  function validate(s: number): boolean {
    const errs: Record<string, string> = {};
    if (s === 0) {
      if (!form.f_ap.trim()) errs.f_ap = "Bitte Namen eingeben.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.f_email))
        errs.f_email = "Bitte gültige E-Mail eingeben.";
      if (!form.f_branche.trim()) errs.f_branche = "Bitte Branche angeben.";
    }
    if (s === 1) {
      if (!form.c_typ) errs.c_typ = "Bitte wähle die Art des Projekts.";
      if (!form.c_ziel.length)
        errs.c_ziel = "Bitte wähle mindestens ein Hauptziel.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function goTo(next: number) {
    if (next > step && !validate(step)) return;
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const MAX = 10,
      MAX_SIZE = 10 * 1024 * 1024;
    const next = [...files];
    Array.from(fileList).forEach((f) => {
      if (next.length >= MAX) return;
      if (f.size > MAX_SIZE) return;
      if (!next.find((x) => x.name === f.name && x.size === f.size))
        next.push(f);
    });
    setFiles(next);
  }

  async function submitForm() {
    if (!validate(step)) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const fd = new FormData();
      fd.append(
        "_subject",
        `NordPush Fragebogen — ${form.f_ap} (${form.f_firma})`,
      );
      fd.append("zusammenfassung", buildSummary(form, files));
      fd.append("ansprechpartner", form.f_ap);
      fd.append("email", form.f_email);
      fd.append("telefon", form.f_tel);
      fd.append("firma", form.f_firma);
      fd.append("branche", form.f_branche);
      fd.append("standort", form.f_standort);
      fd.append("website", form.f_url);
      fd.append("projekttyp", form.c_typ);
      fd.append("hauptziele", form.c_ziel.join(", "));
      fd.append("zielgruppe", form.f_zg);
      fd.append("usps", form.f_usps);
      fd.append("design_stil", form.c_stil);
      fd.append("design_anm", form.f_stil_anm);
      fd.append("features", form.c_features.join(", "));
      fd.append("schnittstellen", form.f_ss);
      fd.append("textbedarf", form.c_texte);
      fd.append("keywords", form.f_kw);
      fd.append("gmb", form.c_gmb);
      fd.append("social", form.c_social.join(", "));
      fd.append("launch_termin", form.f_termin);
      fd.append("prioritaet", form.c_prio);
      fd.append("pflege", form.c_pflege);
      fd.append("sonstiges", form.f_sonstiges);
      files.forEach((f) => fd.append("dateien", f, f.name));

      const res = await fetch(API_URL, {
        method: "POST",
        body: fd,
        // No Content-Type header — browser sets multipart/form-data + boundary
      });

      if (res.ok) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error ?? `Status ${res.status}`,
        );
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Unbekannter Fehler",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const progress = Math.round((step / (TOTAL - 1)) * 100);

  /* ── Success screen ──────────────────────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="kf-success">
        <div className="kf-success-ring">&#10003;</div>
        <h2>Vielen Dank!</h2>
        <p>
          Dein Fragebogen wurde erfolgreich gesendet.
          <br />
          Wir melden uns in K&uuml;rze bei dir.
        </p>
        <p className="kf-success-note">Dein NordPush-Team</p>
      </div>
    );
  }

  /* ── Sub-components (closures for form state) ────────────────────────────── */
  function Pill({
    groupKey,
    value,
    multi = false,
  }: {
    groupKey: keyof KfForm;
    value: string;
    multi?: boolean;
  }) {
    const active = multi
      ? ((form[groupKey] as string[]) ?? []).includes(value)
      : form[groupKey] === value;
    return (
      <button
        type="button"
        className={`kf-pill${active ? " kf-pill--on" : ""}`}
        onClick={() =>
          multi ? toggleMulti(groupKey, value) : toggleSingle(groupKey, value)
        }
      >
        {value}
      </button>
    );
  }

  function OptCard({
    groupKey,
    value,
    icon,
    title,
    sub,
  }: {
    groupKey: keyof KfForm;
    value: string;
    icon: string;
    title: string;
    sub: string;
  }) {
    const active = form[groupKey] === value;
    return (
      <button
        type="button"
        className={`kf-opt${active ? " kf-opt--on" : ""}`}
        onClick={() => toggleSingle(groupKey, value)}
      >
        <span className="kf-oi">{icon}</span>
        <div className="kf-ot">{title}</div>
        <div className="kf-os">{sub}</div>
      </button>
    );
  }

  /* ── Step panels ─────────────────────────────────────────────────────────── */
  const stepPanels = [
    /* ── 0: Kontakt ──────────────────────────────────────────────────── */
    <div key="s0">
      <div className="kf-step-heading">
        <h2>Sch&ouml;n, dass du da bist!</h2>
        <p>Wie k&ouml;nnen wir dich erreichen?</p>
      </div>

      <div className="kf-card">
        <div className="kf-card-title">
          <span className="kf-card-icon" aria-hidden="true">
            🏢
          </span>
          Unternehmen &amp; Kontakt
        </div>
        <div className="kf-g2">
          <div className="kf-f">
            <label className="kf-lbl" htmlFor="kf_firma">
              Firmenname
            </label>
            <input
              className="kf-input"
              type="text"
              id="kf_firma"
              placeholder="Muster GmbH"
              value={form.f_firma}
              onChange={(e) => setField("f_firma", e.target.value)}
            />
          </div>
          <div className="kf-f">
            <label className="kf-lbl" htmlFor="kf_ap">
              Ansprechpartner <span className="kf-req">*</span>
            </label>
            <input
              className={`kf-input${errors.f_ap ? " kf-input--err" : ""}`}
              type="text"
              id="kf_ap"
              placeholder="Max Mustermann"
              value={form.f_ap}
              onChange={(e) => setField("f_ap", e.target.value)}
            />
            {errors.f_ap && (
              <span className="kf-err-msg">{errors.f_ap}</span>
            )}
          </div>
          <div className="kf-f">
            <label className="kf-lbl" htmlFor="kf_email">
              E-Mail-Adresse <span className="kf-req">*</span>
            </label>
            <input
              className={`kf-input${errors.f_email ? " kf-input--err" : ""}`}
              type="email"
              id="kf_email"
              placeholder="info@meinefirma.de"
              value={form.f_email}
              onChange={(e) => setField("f_email", e.target.value)}
            />
            {errors.f_email && (
              <span className="kf-err-msg">{errors.f_email}</span>
            )}
          </div>
          <div className="kf-f">
            <label className="kf-lbl" htmlFor="kf_tel">
              Telefon
            </label>
            <input
              className="kf-input"
              type="tel"
              id="kf_tel"
              placeholder="+49 40 123456"
              value={form.f_tel}
              onChange={(e) => setField("f_tel", e.target.value)}
            />
          </div>
        </div>
        <div className="kf-f">
          <label className="kf-lbl" htmlFor="kf_branche">
            Branche / T&auml;tigkeitsfeld <span className="kf-req">*</span>
          </label>
          <input
            className={`kf-input${errors.f_branche ? " kf-input--err" : ""}`}
            type="text"
            id="kf_branche"
            placeholder="z.B. Handwerk, Gastronomie, E-Commerce, Dienstleistung &hellip;"
            value={form.f_branche}
            onChange={(e) => setField("f_branche", e.target.value)}
          />
          {errors.f_branche && (
            <span className="kf-err-msg">{errors.f_branche}</span>
          )}
        </div>
        <div className="kf-f">
          <label className="kf-lbl" htmlFor="kf_standort">
            Standort / Region
          </label>
          <input
            className="kf-input"
            type="text"
            id="kf_standort"
            placeholder="z.B. Hamburg, bundesweit, DACH &hellip;"
            value={form.f_standort}
            onChange={(e) => setField("f_standort", e.target.value)}
          />
        </div>
        <div className="kf-f">
          <label className="kf-lbl" htmlFor="kf_url">
            Bestehende Website (falls vorhanden)
          </label>
          <input
            className="kf-input"
            type="url"
            id="kf_url"
            placeholder="https://www.meinefirma.de"
            value={form.f_url}
            onChange={(e) => setField("f_url", e.target.value)}
          />
        </div>
      </div>

      <div className="kf-nav">
        <span className="kf-counter">Schritt 1 von 6</span>
        <button
          type="button"
          className="kf-btn-next"
          onClick={() => goTo(1)}
        >
          Weiter &rarr;
        </button>
      </div>
    </div>,

    /* ── 1: Projekt & Ziele ──────────────────────────────────────────── */
    <div key="s1">
      <div className="kf-step-heading">
        <h2>Was planst du?</h2>
        <p>
          Erz&auml;hl uns von deinem Projekt und deinen Zielen.
        </p>
      </div>

      <div className="kf-card">
        <div className="kf-card-title">
          <span className="kf-card-icon" aria-hidden="true">💻</span>
          Art des Projekts
        </div>
        <div className="kf-f">
          <label className="kf-lbl">
            Was wird ben&ouml;tigt? <span className="kf-req">*</span>
          </label>
          <div className="kf-opts">
            <OptCard groupKey="c_typ" value="Neue Website" icon="🌐" title="Neue Website" sub="Kompletter Neuaufbau" />
            <OptCard groupKey="c_typ" value="Webshop" icon="🛒" title="Webshop" sub="Online-Verkauf" />
            <OptCard groupKey="c_typ" value="Redesign" icon="🎨" title="Redesign" sub="Site modernisieren" />
            <OptCard groupKey="c_typ" value="Landing Page" icon="🎯" title="Landing Page" sub="Einzelseite / Kampagne" />
            <OptCard groupKey="c_typ" value="Blog / Portal" icon="📰" title="Blog / Portal" sub="Inhalts-getrieben" />
            <OptCard groupKey="c_typ" value="SEO-Optimierung" icon="🔍" title="SEO-Optimierung" sub="Bestehende Site ranken" />
            <OptCard groupKey="c_typ" value="Sonstiges" icon="💬" title="Sonstiges" sub="Anderes Vorhaben" />
          </div>
          {errors.c_typ && <span className="kf-err-msg">{errors.c_typ}</span>}
        </div>

        {form.c_typ === "Sonstiges" && (
          <div className="kf-f">
            <label className="kf-lbl" htmlFor="kf_sonstiges_typ">
              Was hast du vor?
            </label>
            <textarea
              className="kf-textarea"
              id="kf_sonstiges_typ"
              placeholder="Beschreibe kurz dein Vorhaben &hellip;"
              value={form.f_sonstiges_typ}
              onChange={(e) => setField("f_sonstiges_typ", e.target.value)}
            />
          </div>
        )}

        {form.c_typ === "Webshop" && (
          <>
            <div className="kf-f">
              <label className="kf-lbl">Anzahl der Produkte (ca.)</label>
              <div className="kf-pills">
                {["1–20", "21–100", "101–500", "500+"].map(
                  (v) => <Pill key={v} groupKey="c_anzahl" value={v} />,
                )}
              </div>
            </div>
            <div className="kf-f">
              <label className="kf-lbl">
                Bevorzugtes Shop-System
              </label>
              <div className="kf-pills">
                {[
                  "WooCommerce",
                  "Shopify",
                  "Shopware",
                  "Individuell",
                  "Keine Präferenz",
                ].map((v) => <Pill key={v} groupKey="c_shop" value={v} />)}
              </div>
            </div>
          </>
        )}

        <div className="kf-f kf-f--mt">
          <label className="kf-lbl">CMS-Pr&auml;ferenz</label>
          <div className="kf-pills">
            {[
              "WordPress",
              "TYPO3",
              "Webflow",
              "Individuell",
              "Keine Präferenz",
            ].map((v) => <Pill key={v} groupKey="c_cms" value={v} />)}
          </div>
        </div>
      </div>

      <div className="kf-card">
        <div className="kf-card-title">
          <span className="kf-card-icon" aria-hidden="true">🎯</span>
          Ziele &amp; Zielgruppe
        </div>
        <div className="kf-f">
          <label className="kf-lbl">
            Hauptziel der Website <span className="kf-req">*</span>{" "}
            <span className="kf-hint-inline">(Mehrfachauswahl)</span>
          </label>
          <div className="kf-pills">
            {[
              "Leads generieren",
              "Produkte verkaufen",
              "Markenbekanntheit",
              "Kundenbindung",
              "Informieren",
              "Buchungen / Termine",
              "Bewerber gewinnen",
            ].map((v) => (
              <Pill key={v} groupKey="c_ziel" value={v} multi />
            ))}
          </div>
          {errors.c_ziel && (
            <span className="kf-err-msg">{errors.c_ziel}</span>
          )}
        </div>
        <div className="kf-f">
          <label className="kf-lbl" htmlFor="kf_zg">
            Wer ist deine Zielgruppe?
          </label>
          <span className="kf-hint">
            Alter, B2B/B2C, Kaufkraft, Interessen, Region
          </span>
          <textarea
            className="kf-textarea"
            id="kf_zg"
            placeholder="z.B. Privatkunden 30&ndash;55 Jahre, Raum Hamburg, kaufkr&auml;ftig &hellip;"
            value={form.f_zg}
            onChange={(e) => setField("f_zg", e.target.value)}
          />
        </div>
        <div className="kf-f">
          <label className="kf-lbl" htmlFor="kf_usps">
            Alleinstellungsmerkmale (USPs)
          </label>
          <textarea
            className="kf-textarea"
            id="kf_usps"
            placeholder="Was unterscheidet euch von Mitbewerbern? St&auml;rken, besondere Leistungen &hellip;"
            value={form.f_usps}
            onChange={(e) => setField("f_usps", e.target.value)}
          />
        </div>
        <div className="kf-f">
          <label className="kf-lbl" htmlFor="kf_konkurrenz">
            Bekannte Mitbewerber-Websites
          </label>
          <input
            className="kf-input"
            type="text"
            id="kf_konkurrenz"
            placeholder="z.B. https://konkurrenz1.de"
            value={form.f_konkurrenz}
            onChange={(e) => setField("f_konkurrenz", e.target.value)}
          />
        </div>
      </div>

      <div className="kf-nav">
        <button
          type="button"
          className="kf-btn-back"
          onClick={() => goTo(0)}
        >
          &larr; Zur&uuml;ck
        </button>
        <span className="kf-counter">Schritt 2 von 6</span>
        <button
          type="button"
          className="kf-btn-next"
          onClick={() => goTo(2)}
        >
          Weiter &rarr;
        </button>
      </div>
    </div>,

    /* ── 2: Design ───────────────────────────────────────────────────── */
    <div key="s2">
      <div className="kf-step-heading">
        <h2>Wie soll es aussehen?</h2>
        <p>Design-Stil, Farben und vorhandene Inhalte.</p>
      </div>

      <div className="kf-card">
        <div className="kf-card-title">
          <span className="kf-card-icon" aria-hidden="true">🎨</span>
          Design-Stil
        </div>
        <div className="kf-f">
          <label className="kf-lbl">Welchen Stil bevorzugst du?</label>
          <div className="kf-opts">
            <OptCard groupKey="c_stil" value="Modern/Minimalistisch" icon="⬜" title="Modern / minimalistisch" sub="Clean, viel Wei&szlig;raum" />
            <OptCard groupKey="c_stil" value="Professionell/Serioes" icon="💼" title="Professionell / seri&ouml;s" sub="Vertrauen, Kompetenz" />
            <OptCard groupKey="c_stil" value="Kreativ/Auffaellig" icon="✨" title="Kreativ / auff&auml;llig" sub="Bunt, dynamisch" />
            <OptCard groupKey="c_stil" value="Klassisch/Traditionell" icon="🏛" title="Klassisch / traditionell" sub="Zeitlos, bew&auml;hrt" />
            <OptCard groupKey="c_stil" value="Dunkel/Premium" icon="🌑" title="Dunkel / Premium" sub="Dark Mode, hochwertig" />
          </div>
        </div>
        <div className="kf-f">
          <label className="kf-lbl" htmlFor="kf_stil_anm">
            Eigene Anmerkungen zum Design
          </label>
          <span className="kf-hint">
            Farben, Stimmungen, konkrete Vorbilder &hellip;
          </span>
          <textarea
            className="kf-textarea"
            id="kf_stil_anm"
            placeholder="z.B. Moderner Dark-Mode-Stil mit lila Akzenten, &auml;hnlich wie Stripe.com &hellip;"
            value={form.f_stil_anm}
            onChange={(e) => setField("f_stil_anm", e.target.value)}
          />
        </div>
        <div className="kf-g2">
          <div className="kf-f">
            <label className="kf-lbl" htmlFor="kf_farbe">
              Marken- / Hauptfarbe
            </label>
            <input
              className="kf-input"
              type="text"
              id="kf_farbe"
              placeholder="z.B. #6b3ef0 oder Lila"
              value={form.f_farbe}
              onChange={(e) => setField("f_farbe", e.target.value)}
            />
          </div>
          <div className="kf-f">
            <label className="kf-lbl" htmlFor="kf_ref">
              Referenz-Websites
            </label>
            <input
              className="kf-input"
              type="url"
              id="kf_ref"
              placeholder="https://beispiel.de"
              value={form.f_ref}
              onChange={(e) => setField("f_ref", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="kf-card">
        <div className="kf-card-title">
          <span className="kf-card-icon" aria-hidden="true">📄</span>
          Inhalte &amp; Seiten
        </div>
        <div className="kf-f">
          <label className="kf-lbl">
            Welche Inhalte sind bereits vorhanden?{" "}
            <span className="kf-hint-inline">(Mehrfachauswahl)</span>
          </label>
          <div className="kf-pills">
            {[
              "Logo vorhanden",
              "Texte vorhanden",
              "Fotos / Bilder",
              "Produktbilder",
              "Videos",
              "Nichts vorhanden",
            ].map((v) => (
              <Pill key={v} groupKey="c_inhalte" value={v} multi />
            ))}
          </div>
        </div>
        <div className="kf-f">
          <label className="kf-lbl" htmlFor="kf_seiten">
            Gew&uuml;nschte Seiten / Unterseiten
          </label>
          <span className="kf-hint">
            Was soll die Website beinhalten?
          </span>
          <textarea
            className="kf-textarea"
            id="kf_seiten"
            placeholder="z.B. Startseite, &Uuml;ber uns, Leistungen, Referenzen, Team, Blog, Kontakt &hellip;"
            value={form.f_seiten}
            onChange={(e) => setField("f_seiten", e.target.value)}
          />
        </div>
      </div>

      <div className="kf-nav">
        <button
          type="button"
          className="kf-btn-back"
          onClick={() => goTo(1)}
        >
          &larr; Zur&uuml;ck
        </button>
        <span className="kf-counter">Schritt 3 von 6</span>
        <button
          type="button"
          className="kf-btn-next"
          onClick={() => goTo(3)}
        >
          Weiter &rarr;
        </button>
      </div>
    </div>,

    /* ── 3: Technik & SEO ────────────────────────────────────────────── */
    <div key="s3">
      <div className="kf-step-heading">
        <h2>Technik &amp; SEO</h2>
        <p>
          Funktionen, Schnittstellen und deine Sichtbarkeit bei Google.
        </p>
      </div>

      <div className="kf-card">
        <div className="kf-card-title">
          <span className="kf-card-icon" aria-hidden="true">⚙️</span>
          Funktionen &amp; Features
        </div>
        <div className="kf-f">
          <label className="kf-lbl">
            Welche Funktionen werden ben&ouml;tigt?{" "}
            <span className="kf-hint-inline">(Mehrfachauswahl)</span>
          </label>
          <div className="kf-pills">
            {[
              "Kontaktformular",
              "Buchung / Kalender",
              "Newsletter",
              "Live-Chat",
              "Mehrsprachig",
              "Login-Bereich",
              "Blog / News",
              "Social Media",
              "SEO",
              "Analytics",
              "Zahlungsabwicklung",
              "Produktkonfigurator",
              "Bewertungen",
              "Karriere",
            ].map((v) => (
              <Pill key={v} groupKey="c_features" value={v} multi />
            ))}
          </div>
        </div>
        <div className="kf-f">
          <label className="kf-lbl" htmlFor="kf_ss">
            Schnittstellen / Integrationen
          </label>
          <span className="kf-hint">
            Welche Systeme sollen angebunden werden?
          </span>
          <textarea
            className="kf-textarea"
            id="kf_ss"
            placeholder="z.B. Warenwirtschaft, CRM, Datev, Lexoffice, Amazon, eBay &hellip;"
            value={form.f_ss}
            onChange={(e) => setField("f_ss", e.target.value)}
          />
        </div>
      </div>

      <div className="kf-card">
        <div className="kf-card-title">
          <span className="kf-card-icon" aria-hidden="true">🔍</span>
          SEO &amp; Online-Pr&auml;senz
        </div>
        <div className="kf-f">
          <label className="kf-lbl">Werden Texte ben&ouml;tigt?</label>
          <div className="kf-pills">
            {[
              "Ja – alles von NordPush",
              "Teilweise",
              "Nein, wir liefern alles",
            ].map((v) => <Pill key={v} groupKey="c_texte" value={v} />)}
          </div>
        </div>
        <div className="kf-f">
          <label className="kf-lbl" htmlFor="kf_kw">
            Wichtige Keywords / Suchbegriffe
          </label>
          <span className="kf-hint">
            Wonach sollen Kunden euch bei Google finden?
          </span>
          <input
            className="kf-input"
            type="text"
            id="kf_kw"
            placeholder="z.B. Elektriker Hamburg, Notdienst Elektro &hellip;"
            value={form.f_kw}
            onChange={(e) => setField("f_kw", e.target.value)}
          />
        </div>
        <div className="kf-g2">
          <div className="kf-f">
            <label className="kf-lbl">Google My Business?</label>
            <div className="kf-pills">
              {["Ja", "Nein", "Weiß nicht"].map((v) => (
                <Pill key={v} groupKey="c_gmb" value={v} />
              ))}
            </div>
          </div>
          <div className="kf-f">
            <label className="kf-lbl">
              Social Media{" "}
              <span className="kf-hint-inline">(Mehrfachauswahl)</span>
            </label>
            <div className="kf-pills">
              {["Instagram", "Facebook", "LinkedIn", "TikTok", "Keine"].map(
                (v) => <Pill key={v} groupKey="c_social" value={v} multi />,
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="kf-nav">
        <button
          type="button"
          className="kf-btn-back"
          onClick={() => goTo(2)}
        >
          &larr; Zur&uuml;ck
        </button>
        <span className="kf-counter">Schritt 4 von 6</span>
        <button
          type="button"
          className="kf-btn-next"
          onClick={() => goTo(4)}
        >
          Weiter &rarr;
        </button>
      </div>
    </div>,

    /* ── 4: Zeitplan ─────────────────────────────────────────────────── */
    <div key="s4">
      <div className="kf-step-heading">
        <h2>Wann soll es losgehen?</h2>
        <p>Launch-Termin, Priorit&auml;t und Pflege nach dem Start.</p>
      </div>

      <div className="kf-card">
        <div className="kf-card-title">
          <span className="kf-card-icon" aria-hidden="true">📅</span>
          Zeitplan
        </div>
        <div className="kf-g2">
          <div className="kf-f">
            <label className="kf-lbl" htmlFor="kf_termin">
              Gew&uuml;nschter Launch-Termin
            </label>
            <input
              className="kf-input"
              type="date"
              id="kf_termin"
              value={form.f_termin}
              onChange={(e) => setField("f_termin", e.target.value)}
            />
          </div>
          <div className="kf-f">
            <label className="kf-lbl">Priorit&auml;t</label>
            <div className="kf-pills">
              {[
                "🔴 Dringend",
                "🟡 Normal",
                "🟢 Flexibel",
              ].map((v) => <Pill key={v} groupKey="c_prio" value={v} />)}
            </div>
          </div>
        </div>
        <div className="kf-f">
          <label className="kf-lbl">Pflege nach dem Launch</label>
          <div className="kf-pills">
            {[
              "Wartungsvertrag gewünscht",
              "Wir pflegen selbst",
              "Bedarfsweise anfragen",
            ].map((v) => <Pill key={v} groupKey="c_pflege" value={v} />)}
          </div>
        </div>
      </div>

      <div className="kf-nav">
        <button
          type="button"
          className="kf-btn-back"
          onClick={() => goTo(3)}
        >
          &larr; Zur&uuml;ck
        </button>
        <span className="kf-counter">Schritt 5 von 6</span>
        <button
          type="button"
          className="kf-btn-next"
          onClick={() => goTo(5)}
        >
          Weiter &rarr;
        </button>
      </div>
    </div>,

    /* ── 5: Absenden ─────────────────────────────────────────────────── */
    <div key="s5">
      <div className="kf-step-heading">
        <h2>Fast geschafft!</h2>
        <p>
          Noch kurze Anmerkungen und optional Dateien &mdash; dann sind wir
          fertig.
        </p>
      </div>

      <div className="kf-card">
        <div className="kf-card-title">
          <span className="kf-card-icon" aria-hidden="true">💬</span>
          Sonstige Anmerkungen
        </div>
        <div className="kf-f">
          <label className="kf-lbl" htmlFor="kf_sonstiges">
            Was m&ouml;chtest du uns noch mitteilen?
          </label>
          <span className="kf-hint">
            Ideen, Fragen, besondere W&uuml;nsche &mdash; alles was wichtig
            erscheint.
          </span>
          <textarea
            className="kf-textarea kf-textarea--tall"
            id="kf_sonstiges"
            placeholder="z.B. Wir haben bereits ein CI-Handbuch. Bitte zuerst telefonisch melden. Wir brauchen die Seite bis zur Messe im Oktober &hellip;"
            value={form.f_sonstiges}
            onChange={(e) => setField("f_sonstiges", e.target.value)}
          />
        </div>
      </div>

      <div className="kf-card">
        <div className="kf-card-title">
          <span className="kf-card-icon" aria-hidden="true">📁</span>
          Dateien mitschicken{" "}
          <span className="kf-optional">(optional)</span>
        </div>
        <div className="kf-f">
          <span className="kf-hint">
            Logos, CI-Unterlagen, Referenzen, Fotos &mdash; alles was n&uuml;tzlich
            sein k&ouml;nnte.
          </span>
          <div
            className="kf-upload"
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("kf-upload--drag");
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove("kf-upload--drag");
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("kf-upload--drag");
              handleFiles(e.dataTransfer.files);
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.ai,.eps,.svg,.txt"
              style={{ display: "none" }}
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="kf-upload-icon" aria-hidden="true">📁</div>
            <div className="kf-upload-text">
              Dateien hier ablegen oder
            </div>
            <button
              type="button"
              className="kf-btn-upload"
              onClick={() => fileInputRef.current?.click()}
            >
              Dateien ausw&auml;hlen
            </button>
            <div className="kf-upload-types">
              JPG &middot; PNG &middot; PDF &middot; Word &middot; Excel
              &middot; ZIP &middot; AI &middot; SVG
            </div>
          </div>
          {files.length > 0 && (
            <div className="kf-file-list">
              {files.map((f, i) => (
                <div key={i} className="kf-file-item">
                  <span className="kf-fi-name">{f.name}</span>
                  <span className="kf-fi-size">{fmtSize(f.size)}</span>
                  <button
                    type="button"
                    className="kf-fi-del"
                    aria-label={`${f.name} entfernen`}
                    onClick={() =>
                      setFiles((fs) => fs.filter((_, idx) => idx !== i))
                    }
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="kf-nav kf-nav--submit">
        <div className="kf-nav-row">
          <button
            type="button"
            className="kf-btn-back"
            onClick={() => goTo(4)}
          >
            &larr; Zur&uuml;ck
          </button>
          <span className="kf-counter">Schritt 6 von 6</span>
          <button
            type="button"
            className="kf-btn-next"
            disabled={submitting}
            onClick={submitForm}
          >
            {submitting
              ? "Wird gesendet …"
              : "Jetzt absenden →"}
          </button>
        </div>
        {submitError && (
          <p className="kf-submit-error" role="alert">
            Fehler: {submitError} &mdash; Bitte direkt an{" "}
            <a href="mailto:info@nordpush.de">info@nordpush.de</a> schreiben.
          </p>
        )}
      </div>
    </div>,
  ];

  /* ── Render ────────────────────────────────────────────────────────────── */
  return (
    <div className="kf">
      {/* Stepper */}
      <nav className="kf-stepper" aria-label="Fortschritt">
        {STEP_LABELS.map((label, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <div
                className={`kf-st-line${i <= step ? " kf-st-line--done" : ""}`}
                aria-hidden="true"
              />
            )}
            <button
              type="button"
              className={`kf-st-item${i === step ? " kf-st-item--active" : ""}${i < step ? " kf-st-item--done" : ""}`}
              aria-current={i === step ? "step" : undefined}
              onClick={() => {
                if (i < step) goTo(i);
              }}
            >
              <div className="kf-st-circle" aria-hidden="true">
                {i < step ? (
                  <span>&#10003;</span>
                ) : (
                  <span className="kf-st-num">{i + 1}</span>
                )}
              </div>
              <div className="kf-st-label">{label}</div>
            </button>
          </Fragment>
        ))}
      </nav>

      {/* Progress bar */}
      <div
        className="kf-prog"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Formular-Fortschritt"
      >
        <div className="kf-prog-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Step content */}
      {stepPanels[step]}
    </div>
  );
}
