import type { Locale } from "@/i18n/config";
import { he } from "./he";
import type { Dictionary } from "./types";

const dictionaries: Record<Locale, Dictionary> = { he };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary } from "./types";
