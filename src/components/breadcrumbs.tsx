import Link from "next/link";

type Crumb = {
  href: string;
  label: string;
};

type BreadcrumbsProps = {
  items?: Crumb[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs" data-ux-slot="BreadcrumbNav">
      <ol>
        <li>
          <Link href="/">Start</Link>
        </li>
        {items.map((item) => (
          <li key={item.href}>
            <span aria-hidden="true">/</span>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
