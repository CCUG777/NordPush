import type { JsonLdSchema } from "@/lib/structured-data";

type JsonLdProps = {
  schemas: JsonLdSchema[];
};

export function JsonLd({ schemas }: JsonLdProps) {
  if (schemas.length === 0) {
    return null;
  }

  const payload =
    schemas.length === 1 ? { "@context": "https://schema.org", ...schemas[0] } : { "@context": "https://schema.org", "@graph": schemas };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
      suppressHydrationWarning
    />
  );
}
