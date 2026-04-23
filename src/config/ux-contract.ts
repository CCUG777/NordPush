export const uxColorTokens = {
  bgCanvas: "#FFFFFF",
  bgSunken: "#FAFAFA",
  bgMuted: "#F5F5F5",
  bgInk: "#0A0A0A",
  inkPrimary: "#0A0A0A",
  inkSecondary: "#404040",
  inkMuted: "#737373",
  inkFaint: "#A3A3A3",
  hairline: "rgba(10,10,10,0.06)",
  border: "rgba(10,10,10,0.10)",
  borderStrong: "rgba(10,10,10,0.18)",
  accent: "#0066FF",
  accentHover: "#0052CC",
  accentSoft: "rgba(0,102,255,0.08)",
  focus: "#0066FF",
  signalDanger: "#DC2626",
} as const;

export const uxTypography = {
  sans: "Geist",
  mono: "Geist Mono",
  headingWeights: [500, 600, 700] as const,
  bodyWeights: [400, 500] as const,
  monoWeight: 500,
} as const;

export const uxSpacingTokens = {
  layoutMaxWidth: 1200,
  paddingDesktop: 32,
  paddingMobile: 20,
  sectionDesktop: 96,
  sectionMobile: 64,
  cardRadius: 12,
  heroRadius: 0,
  buttonRadius: 8,
  pillRadius: 999,
} as const;

export const uxBreakpoints = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export const uxMotionTokens = {
  entryFadeMs: 400,
  entryYOffset: 8,
  cardHoverLiftPx: -2,
  cardHoverMs: 200,
  sectionRevealStaggerMs: 40,
} as const;

export const uxIntegrationSlots = [
  "Header",
  "Footer",
  "BreadcrumbNav",
  "Hero",
  "TrustBar",
  "ServiceCards",
  "FAQAccordion",
  "AuthorBox",
] as const;
