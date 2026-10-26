/** Business details in one place. Missing optional details stay hidden. */
export const site = {
  /** Public origin without trailing slash, used for canonical URLs, sitemap and OG. */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://rockstackds.com",
  email: "contact@rockstackds.com" as string | null,
  phone: null as string | null,
  whatsapp: null as string | null,
  city: null as string | null,
  /**
   * HTTPS endpoint owned by RockStack that accepts the contact JSON payload.
   * It is injected at build time and no mail-provider secret reaches the browser.
   */
  contactEndpoint: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "",
};
