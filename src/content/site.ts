/** Business details in one place. Missing optional details stay hidden. */
export const site = {
  /** Public origin without trailing slash, used for canonical URLs, sitemap and OG. */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://rockstackds.com",
  email: "contact@rockstackds.com" as string | null,
  phone: null as string | null,
  whatsapp: null as string | null,
  city: null as string | null,
  /**
   * GitHub Pages is static, so the public form uses FormSubmit's AJAX relay.
   * The repository variable can replace it later with a RockStack-owned Worker.
   */
  contactEndpoint:
    process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ||
    "https://formsubmit.co/ajax/contact@rockstackds.com",
};
