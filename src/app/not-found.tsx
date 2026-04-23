import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="card">
        <h1>Route not scaffolded yet</h1>
        <p>The requested path is outside the current migration baseline.</p>
        <p>
          Return to <Link href="/">homepage scaffold</Link>.
        </p>
      </section>
    </SiteShell>
  );
}