import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

type Crumb = {
  href: string;
  label: string;
};

type SiteShellProps = {
  children: ReactNode;
  sectionLabel?: string;
  breadcrumbs?: Crumb[];
};

export function SiteShell({ children, sectionLabel, breadcrumbs }: SiteShellProps) {
  return (
    <>
      <Header />
      <main className="site-main">
        <div className="shell-inner">
          {sectionLabel ? <p className="section-label">{sectionLabel}</p> : null}
          <Breadcrumbs items={breadcrumbs} />
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
