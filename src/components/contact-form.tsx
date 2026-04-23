"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";

type FormState = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);

    // Honeypot check
    if (fd.get("website")) {
      setState("success");
      return;
    }

    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      company: fd.get("company"),
      message: fd.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Ein Fehler ist aufgetreten.");
        setState("error");
        return;
      }

      setState("success");
      formRef.current?.reset();
    } catch {
      setErrorMsg("Verbindungsfehler. Bitte versuche es erneut.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="contact-form-success">
        <div className="contact-success-icon" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="var(--rui-primary)" />
            <path d="M10 16.5L14 20.5L22 12.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3>Nachricht gesendet</h3>
        <p>
          Danke für deine Anfrage. Wir melden uns innerhalb von 24 Stunden bei dir — meistens
          deutlich schneller.
        </p>
        <button type="button" className="button" onClick={() => setState("idle")}>
          Weitere Nachricht senden
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form-row">
        <div className="contact-field">
          <label htmlFor="cf-name">Name *</label>
          <input
            id="cf-name"
            name="name"
            type="text"
            required
            minLength={2}
            autoComplete="name"
            placeholder="Max Mustermann"
          />
        </div>
        <div className="contact-field">
          <label htmlFor="cf-email">E-Mail *</label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="max@unternehmen.de"
          />
        </div>
      </div>

      <div className="contact-form-row">
        <div className="contact-field">
          <label htmlFor="cf-phone">Telefon</label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+49 171 / 311 79 71"
          />
        </div>
        <div className="contact-field">
          <label htmlFor="cf-company">Unternehmen</label>
          <input
            id="cf-company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Firma GmbH"
          />
        </div>
      </div>

      <div className="contact-field">
        <label htmlFor="cf-message">Nachricht *</label>
        <textarea
          id="cf-message"
          name="message"
          required
          minLength={10}
          rows={5}
          placeholder="Beschreibe kurz dein Anliegen, deine Website und was du dir von einer Zusammenarbeit erhoffst."
        />
      </div>

      {/* Honeypot — hidden from users, catches bots */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <input tabIndex={-1} name="website" autoComplete="off" />
      </div>

      <div className="contact-form-consent">
        <label className="contact-checkbox">
          <input type="checkbox" name="consent" required />
          <span>
            Ich stimme zu, dass meine Daten zur Bearbeitung meiner Anfrage verarbeitet werden.{" "}
            <Link href="/datenschutz/">Datenschutz</Link>
          </span>
        </label>
      </div>

      {state === "error" && errorMsg ? (
        <div className="contact-form-error" role="alert">
          {errorMsg}
        </div>
      ) : null}

      <div className="contact-form-actions">
        <button type="submit" className="button primary" disabled={state === "sending"}>
          {state === "sending" ? "Wird gesendet..." : "Nachricht senden"}
        </button>
        <a href="tel:+491713117971" className="button">
          0171 / 311 79 71
        </a>
      </div>
    </form>
  );
}
