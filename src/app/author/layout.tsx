import type { ReactNode } from "react";
import { SiteShell } from "@/components/site-shell";

export default function AuthorLayout({ children }: { children: ReactNode }) {
  return <SiteShell sectionLabel="Über uns" breadcrumbs={[{ href: "/ueber-uns/", label: "Über uns" }]}>{children}</SiteShell>;
}