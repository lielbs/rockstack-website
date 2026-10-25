import type { ReactNode } from "react";
import { getDictionary } from "@/content";
import { defaultLocale } from "@/i18n/config";
import { asset } from "@/lib/asset";
import { Logo } from "@/components/brand/Logo";
import { Footer } from "./Footer";
import { SkipLink } from "./SkipLink";

/** Shell for text pages (accessibility statement, privacy policy). */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  const dict = getDictionary(defaultLocale);
  return (
    <>
      <SkipLink label={dict.a11y.skip} />
      <header className="frame flex items-center justify-between gap-6 py-5">
        <a href={asset("/")} aria-label={dict.a11y.home} className="rounded-sm">
          <Logo tone="dark" markClassName="size-9" textClassName="text-[1.45rem]" />
        </a>
        <a href={asset("/")} className="link-quiet font-semibold">
          חזרה לדף הבית
        </a>
      </header>
      <main id="main" tabIndex={-1} className="frame pb-32 pt-16 outline-none md:pt-24">
        <article className="max-w-[68ch]">
          <h1 className="text-title font-bold">{title}</h1>
          <p className="mt-4 text-small text-stone">עדכון אחרון: {updated}</p>
          <div className="legal mt-12">{children}</div>
        </article>
      </main>
      <Footer dict={dict} home={asset("/")} />
    </>
  );
}
