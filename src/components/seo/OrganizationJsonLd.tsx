import type { Dictionary } from "@/content";
import { site } from "@/content/site";

/** schema.org Organization. Contact fields are added only once they are real. */
export function OrganizationJsonLd({ dict }: { dict: Dictionary }) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RockStack",
    url: `${site.url}/`,
    logo: `${site.url}/icon.svg`,
    description: dict.meta.description,
    areaServed: "IL",
  };
  if (site.email) data.email = site.email;
  if (site.phone) data.telephone = site.phone;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
