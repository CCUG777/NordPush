import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
};

const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 3;
const recentSubmissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recentSubmissions.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_LIMIT) return true;
  hits.push(now);
  recentSubmissions.set(ip, hits);
  return false;
}

function validate(body: unknown): { ok: true; data: ContactPayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Ungültige Anfrage." };

  const { name, email, phone, company, message } = body as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length < 2)
    return { ok: false, error: "Bitte gib deinen Namen ein." };
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { ok: false, error: "Bitte gib eine gültige E-Mail-Adresse ein." };
  if (typeof message !== "string" || message.trim().length < 10)
    return { ok: false, error: "Deine Nachricht sollte mindestens 10 Zeichen lang sein." };

  return {
    ok: true,
    data: {
      name: name.trim(),
      email: email.trim(),
      phone: typeof phone === "string" && phone.trim() ? phone.trim() : undefined,
      company: typeof company === "string" && company.trim() ? company.trim() : undefined,
      message: message.trim(),
    },
  };
}

function buildHtml(data: ContactPayload): string {
  const rows = [
    ["Name", data.name],
    ["E-Mail", `<a href="mailto:${data.email}">${data.email}</a>`],
    data.phone ? ["Telefon", data.phone] : null,
    data.company ? ["Unternehmen", data.company] : null,
    ["Nachricht", data.message.replace(/\n/g, "<br>")],
  ].filter(Boolean) as [string, string][];

  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px">
      <h2 style="font-size:20px;font-weight:500;margin:0 0 24px;color:#191c1f">
        Neue Kontaktanfrage über nordpush.de
      </h2>
      <table style="width:100%;border-collapse:collapse">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:12px 16px 12px 0;border-bottom:1px solid #e6e6e8;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#8d969e;vertical-align:top;white-space:nowrap">${label}</td>
            <td style="padding:12px 0;border-bottom:1px solid #e6e6e8;font-size:15px;color:#191c1f;line-height:1.55">${value}</td>
          </tr>`,
          )
          .join("")}
      </table>
      <p style="margin:24px 0 0;font-size:12px;color:#8d969e">
        Gesendet über das Kontaktformular auf nordpush.de
      </p>
    </div>
  `.trim();
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte versuche es in einer Minute erneut." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const result = validate(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { data } = result;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO_EMAIL || "info@nordpush.de";
  const from = process.env.CONTACT_FROM_EMAIL || "noreply@nordpush.de";

  if (!host || !user || !pass) {
    console.error("[contact] SMTP not configured — missing SMTP_HOST, SMTP_USER, or SMTP_PASS");
    return NextResponse.json(
      { error: "E-Mail-Versand ist derzeit nicht konfiguriert. Bitte kontaktiere uns direkt per Telefon." },
      { status: 503 },
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `NordPush Kontaktformular <${from}>`,
      replyTo: `${data.name} <${data.email}>`,
      to,
      subject: `Kontaktanfrage von ${data.name}${data.company ? ` (${data.company})` : ""}`,
      html: buildHtml(data),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] SMTP send failed:", err);
    return NextResponse.json(
      { error: "E-Mail konnte nicht gesendet werden. Bitte versuche es später erneut." },
      { status: 500 },
    );
  }
}
