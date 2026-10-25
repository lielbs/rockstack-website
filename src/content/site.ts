/** Business details in one place. Missing optional details stay hidden. */
export const site = {
  /** Public origin without trailing slash, used for canonical URLs, sitemap and OG. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lielbs.github.io/rockstack-website",
  email: null as string | null, // e.g. "hello@rockstack.co.il"
  phone: null as string | null, // display form, e.g. "050-000-0000"
  /** International format without "+" or dashes, e.g. "972500000000". */
  whatsapp: null as string | null,
  city: null as string | null, // e.g. "תל אביב"
  /**
   * Form endpoint that accepts a JSON POST (Formspree, Web3Forms, Make/Zapier webhook, CRM).
   * Set NEXT_PUBLIC_CONTACT_ENDPOINT at build time. Empty → the form falls back to email.
   */
  contactEndpoint: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "",
};
