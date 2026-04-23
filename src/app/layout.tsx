import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans-loaded",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-loaded",
  display: "swap",
  weight: ["400", "500", "600"],
});

// Display font — Satoshi Variable (Indian Type Foundry / Fontshare FFL).
// Geometric sans in the Aeonik-Pro-adjacent tradition; free for commercial
// use under the Fontshare Free Font License. One variable-font file
// (~43 KB) covers the full 300–900 weight range, so we load a single
// asset instead of per-weight splits.
//
// next/font/local handles the performance hygiene automatically:
// - rel=preload link is injected into <head> when the variable is used
// - font-display: swap is applied
// - Size-adjusted fallback metrics are generated (see `fallback`) so
//   the Inter fallback renders at visually matching x-height and
//   ascent/descent — prevents CLS on the font swap.
const display = localFont({
  src: "../../public/fonts/Satoshi-Variable.woff2",
  variable: "--font-display-loaded",
  display: "swap",
  weight: "300 900",
  style: "normal",
  fallback: ["Inter", "Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "NordPush – Deine SEO Agentur für mehr Sichtbarkeit im Web",
    template: "%s",
  },
  description:
    "SEO-Strategien, die messbare Ergebnisse liefern. Keyword-Recherche, Konkurrenzanalyse, technisches SEO und Content-Aufbau – aus einer Hand.",
  metadataBase: new URL("https://nordpush.de"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://nordpush.de",
    siteName: "NordPush",
    title: "NordPush – Deine SEO Agentur für mehr Sichtbarkeit im Web",
    description:
      "Messbare SEO-Ergebnisse aus Neumünster. Strategien, die echte Kunden liefern.",
    images: [
      {
        url: "/og-default.svg",
        width: 1200,
        height: 630,
        alt: "NordPush — Mehr Sichtbarkeit. Mehr Kunden.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NordPush – Deine SEO Agentur",
    description: "Mehr Sichtbarkeit. Mehr Kunden. SEO, das Ergebnisse liefert.",
    images: ["/og-default.svg"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#191c1f" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${sans.variable} ${mono.variable} ${display.variable}`}>{children}</body>
    </html>
  );
}
