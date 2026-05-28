import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

/* ── Config ──────────────────────────────────────────────────────────────── */
// Vercel serverless body limit is 4.5 MB by default.
// Practical limit for logos / PDFs / docs is fine within that.

export const maxDuration = 30; // seconds — allow time for attachments

/* ── HTML email builder ──────────────────────────────────────────────────── */
function row(label: string, value: string | undefined, pre = false) {
  if (!value || value === "--") return "";
  const cell = pre
    ? `<td style="padding:10px 0;border-bottom:1px solid #e6e6e8;font-size:14px;color:#191c1f;line-height:1.6;white-space:pre-wrap;font-family:monospace">${value}</td>`
    : `<td style="padding:10px 0;border-bottom:1px solid #e6e6e8;font-size:14px;color:#191c1f;line-height:1.55">${value}</td>`;
  return `<tr>
    <td style="padding:10px 16px 10px 0;border-bottom:1px solid #e6e6e8;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#8d969e;vertical-align:top;white-space:nowrap;min-width:160px">${label}</td>
    ${cell}
  </tr>`;
}

function section(title: string, rows: string) {
  if (!rows.trim()) return "";
  return `
    <tr><td colspan="2" style="padding:20px 0 4px">
      <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#5b21d5">${title}</p>
    </td></tr>
    ${rows}
  `;
}

function buildHtml(f: Record<string, string>): string {
  const s = (key: string) => f[key] || "--";
  return `
<div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:0 auto;padding:32px 24px;color:#191c1f">
  <h2 style="font-size:20px;font-weight:500;margin:0 0 4px">
    NordPush Kundenfragebogen
  </h2>
  <p style="margin:0 0 28px;font-size:13px;color:#8d969e">
    ${s("firma") !== "--" ? `${s("firma")} · ` : ""}Eingegangen am ${new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}
  </p>
  <table style="width:100%;border-collapse:collapse">
    ${section("Kontakt", [
      row("Ansprechpartner", s("ansprechpartner")),
      row("E-Mail", `<a href="mailto:${s("email")}" style="color:#5b21d5">${s("email")}</a>`),
      row("Telefon", s("telefon")),
      row("Firma", s("firma")),
      row("Branche", s("branche")),
      row("Standort", s("standort")),
      row("Website", s("website") !== "--" ? `<a href="${s("website")}" style="color:#5b21d5">${s("website")}</a>` : undefined),
    ].join(""))}
    ${section("Projekt &amp; Ziele", [
      row("Projekttyp", s("projekttyp")),
      row("Hauptziele", s("hauptziele")),
      row("Zielgruppe", s("zielgruppe")),
      row("USPs", s("usps")),
    ].join(""))}
    ${section("Design", [
      row("Stil", s("design_stil")),
      row("Anmerkungen", s("design_anm")),
    ].join(""))}
    ${section("Technik &amp; SEO", [
      row("Features", s("features")),
      row("Schnittstellen", s("schnittstellen")),
      row("Textbedarf", s("textbedarf")),
      row("Keywords", s("keywords")),
      row("Google My Business", s("gmb")),
      row("Social Media", s("social")),
    ].join(""))}
    ${section("Zeitplan", [
      row("Launch-Termin", s("launch_termin")),
      row("Priorität", s("prioritaet")),
      row("Pflege", s("pflege")),
    ].join(""))}
    ${section("Anmerkungen", [
      row("Sonstiges", s("sonstiges")),
    ].join(""))}
  </table>
  <p style="margin:24px 0 0;font-size:12px;color:#9ca3af">
    Gesendet über nordpush.de/kundenformular
  </p>
</div>`.trim();
}

/* ── Route handler ───────────────────────────────────────────────────────── */
export async function POST(request: NextRequest) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to   = process.env.CONTACT_TO_EMAIL   || "info@nordpush.de";
  const from = process.env.CONTACT_FROM_EMAIL || "noreply@nordpush.de";

  if (!host || !user || !pass) {
    console.error("[fragebogen] SMTP not configured");
    return NextResponse.json(
      { error: "E-Mail-Versand nicht konfiguriert. Bitte schreib direkt an info@nordpush.de." },
      { status: 503 },
    );
  }

  // Parse multipart form data (includes file blobs)
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  // Collect scalar fields
  const fields: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      fields[key] = value;
    }
  }

  const ap = fields["ansprechpartner"] || "Unbekannt";
  const firma = fields["firma"] || "";

  // Collect file attachments
  const attachments: { filename: string; content: Buffer; contentType: string }[] = [];
  for (const [key, value] of formData.entries()) {
    if (key === "dateien" && value instanceof Blob) {
      const file = value as File;
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({
        filename: file.name,
        content: buffer,
        contentType: file.type || "application/octet-stream",
      });
    }
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `NordPush Fragebogen <${from}>`,
      replyTo: `${ap} <${fields["email"] || from}>`,
      to,
      subject: `Fragebogen: ${ap}${firma ? ` (${firma})` : ""}`,
      html: buildHtml(fields),
      ...(attachments.length > 0 ? { attachments } : {}),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[fragebogen] SMTP send failed:", err);
    return NextResponse.json(
      { error: "E-Mail konnte nicht gesendet werden. Bitte versuche es später erneut." },
      { status: 500 },
    );
  }
}
