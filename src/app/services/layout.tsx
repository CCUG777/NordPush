import type { ReactNode } from "react";
import { SiteShell } from "@/components/site-shell";

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell sectionLabel="Services" breadcrumbs={[{ href: "/seo-beratung/", label: "Services" }]}>
      {children}
    </SiteShell>
  );
}
