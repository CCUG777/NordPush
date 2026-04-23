import type { ReactNode } from "react";
import { SiteShell } from "@/components/site-shell";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <SiteShell sectionLabel="Blog" breadcrumbs={[{ href: "/category/wissen/", label: "Wissen" }]}>{children}</SiteShell>;
}