import { ImageResponse } from "next/og";

/**
 * /websites/ — eigenes OG-Image mit produkt-spezifischer Überschrift.
 * Alles andere im selben Design-Template wie der Site-Default.
 */

export const alt = "NordPush — Websites mit Substanz. Design, Technik und SEO aus einer Hand.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
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
            NordPush · Websites
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 88,
              fontWeight: 500,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              maxWidth: 1020,
              color: "#ffffff",
            }}
          >
            <div>Websites mit</div>
            <div>Substanz.</div>
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
            Design, Technik und SEO aus einem Team — pflegbar, performant, strategisch.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ width: 80, height: 3, background: "#5b21d5" }} />
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.02em",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            nordpush.de/websites/
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
