import type { ReactNode } from "react";

// Pass-through: the section label & breadcrumbs are decided per-slug in
// `[slug]/page.tsx` — legal pages get the "Legal" section chrome, conversion
// pages (/kontakt/, /preise/) render without it since they're top-level CTAs.
export default function LegalLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
