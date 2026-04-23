import { ImageResponse } from "next/og";

/**
 * Site-wide default Open Graph image.
 *
 * Next.js 15 picks up any `opengraph-image.tsx` at the app-directory level
 * and generates a PNG at build time. The URL is automatically added to the
 * <meta property="og:image"> tag via the metadata pipeline — no manual wiring
 * in `metadata-catalog.ts` needed.
 *
 * Per-route overrides live at `src/app/<route>/opengraph-image.tsx` and
 * take precedence over this file on their respective paths.
 *
 * Dimensions follow the Open Graph standard (1200x630, 1.91:1 aspect).
 */

export const alt = "NordPush — Websites und SEO aus einer Hand";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Route handlers in app-dir should run on the edge for fast first-byte;
// ImageResponse is fully edge-compatible.
export const runtime = "edge";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#191c1f",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top — brand row with lila dot */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 9999,
              background: "#5b21d5",
              boxShadow: "0 0 0 8px rgba(91,33,213,0.18)",
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.2em",
              fontWeight: 500,
              textTransform: "uppercase",
              color: "#ffffff",
            }}
          >
            NordPush
          </div>
        </div>

        {/* Middle — main title + lede.
            next/og requires explicit display:flex on any node that has
            multiple children, so we flatten the two-line title into two
            separate flex-column children instead of using <br />. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 92,
              fontWeight: 500,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              maxWidth: 1000,
              color: "#ffffff",
            }}
          >
            <div>Websites und SEO</div>
            <div>aus einer Hand.</div>
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.35,
              marginTop: 28,
              maxWidth: 900,
              color: "rgba(255,255,255,0.72)",
            }}
          >
            Für Unternehmen mit Anspruch an Substanz und Klarheit.
          </div>
        </div>

        {/* Bottom — lila accent + URL */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ width: 80, height: 3, background: "#5b21d5" }} />
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.02em",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            nordpush.de
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
