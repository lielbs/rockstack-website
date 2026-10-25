/** Shape of every locale's copy. Add `en.ts` with the same shape to ship English. */

export type Photo = {
  /** File id in public/media, e.g. "stepped" → /media/stepped-<w>.webp */
  id: string;
  widths: number[];
  /** Intrinsic ratio of the prepared crop (width / height). */
  ratio: number;
  alt: string;
};

export type LayerId = "infra" | "security" | "systems" | "apps" | "ai";

export type NeedId = "app" | "web" | "crm" | "ai" | "automation" | "data" | "infra" | "unsure";

export type Dictionary = {
  meta: { title: string; description: string; siteName: string };
  a11y: { skip: string; menuOpen: string; menuClose: string; home: string };
  nav: { items: { href: string; label: string }[]; cta: string };
  descriptor: string;
  /** Words for the moving band between sections. */
  marquee: string[];
  hero: {
    lines: [string, string];
    lead: string;
    cta: string;
    secondary: string;
    /** Names of the three hero slabs, base first. */
    layers: [string, string, string];
  };
  belief: {
    heading: string;
    statement: string;
    quickTitle: string;
    quick: string[];
    slowTitle: string;
    slow: string[];
    close: string;
    /** Illustrative monitoring panel: what an unprepared system looks like a few weeks after launch. */
    monitor: {
      title: string;
      badge: string;
      chartLabel: string;
      status: string;
      alerts: { time: string; text: string; value: string }[];
    };
  };
  strata: {
    heading: string;
    intro: string;
    layers: { id: LayerId; name: string; latin: string; text: string }[];
  };
  difference: {
    heading: string;
    lead: { title: string; text: string; note: string };
    points: { title: string; text: string }[];
    photo: Photo;
  };
  services: {
    heading: string;
    intro: string;
    groups: { name: string; latin: string; items: { name: string; benefit: string }[] }[];
    photo: Photo;
  };
  process: {
    heading: string;
    intro: string;
    ticketTitle: string;
    ticketMeta: string;
    deliverableLabel: string;
    stages: { name: string; text: string; deliverable: string }[];
    result: string;
    photo: Photo;
  };
  sectors: {
    heading: string;
    lead: string;
    names: string[];
    logosLabel: string;
    logoPlaceholder: string;
    photo: Photo;
  };
  about: {
    heading: string;
    text: string;
    facts: { label: string; value: string }[];
    /** The two disciplines behind the company, described by role only (no names). */
    partners: { role: string; areas: string[] }[];
  };
  contact: {
    heading: string;
    lead: string;
    builder: {
      legend: string;
      hint: string;
      stackTitle: string;
      stackEmpty: string;
      foundationNote: string;
      needs: { id: NeedId; label: string; requires: string[] }[];
      base: string;
    };
    form: {
      name: string;
      company: string;
      phone: string;
      email: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
      sending: string;
      success: string;
      error: string;
      required: string;
      invalidEmail: string;
      invalidPhone: string;
      notConfigured: string;
    };
    direct: { title: string; whatsapp: string; email: string };
  };
  footer: {
    tagline: string;
    contactTitle: string;
    contact: { label: string; value: string; href?: string }[];
    navTitle: string;
    legalTitle: string;
    accessibility: string;
    privacy: string;
    rights: string;
    photoCredit: string;
  };
};
