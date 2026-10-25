export const locales = ["he"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "he";

export const localeMeta: Record<Locale, { dir: "rtl" | "ltr"; lang: string; ogLocale: string }> = {
  he: { dir: "rtl", lang: "he", ogLocale: "he_IL" },
};
