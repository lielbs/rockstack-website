import { asset } from "@/lib/asset";
import type { Dictionary } from "@/content";
import { FooterWordmark } from "./FooterWordmark";

export function Footer({ dict, home = "" }: { dict: Dictionary; home?: string }) {
  const { footer } = dict;
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark frame overflow-hidden bg-basalt-raised pb-8 pt-20 text-ivory">
      <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <p className="font-semibold">{footer.tagline}</p>
          <p className="mt-2 text-small text-stone">
            <span className="latin" dir="ltr" translate="no">
              {dict.descriptor}
            </span>
          </p>
        </div>
        <div>
          <h2 className="text-small font-semibold text-ivory">{footer.contactTitle}</h2>
          <ul className="mt-3 space-y-2 text-small text-stone">
            {footer.contact.map((item) => (
              <li key={item.label}>
                <span className="sr-only">{item.label}: </span>
                {item.href ? (
                  <a href={item.href} className="link-quiet hover:text-ivory">
                    <bdi>{item.value}</bdi>
                  </a>
                ) : (
                  <bdi>{item.value}</bdi>
                )}
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label={footer.navTitle}>
          <h2 className="text-small font-semibold text-ivory">{footer.navTitle}</h2>
          <ul className="mt-3 space-y-2 text-small text-stone">
            {dict.nav.items.map((item) => (
              <li key={item.href}>
                <a href={`${home}${item.href}`} className="link-quiet no-underline hover:text-ivory">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-small font-semibold text-ivory">{footer.legalTitle}</h2>
          <ul className="mt-3 space-y-2 text-small text-stone">
            <li>
              <a href={asset("/accessibility/")} className="link-quiet hover:text-ivory">
                {footer.accessibility}
              </a>
            </li>
            <li>
              <a href={asset("/privacy/")} className="link-quiet hover:text-ivory">
                {footer.privacy}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-24 md:mt-32">
        <FooterWordmark />
      </div>

      <div className="mt-8 flex flex-wrap justify-between gap-x-8 gap-y-2 text-small text-stone">
        <p>
          © {year} <span className="latin" translate="no">RockStack</span>. {footer.rights}
        </p>
        <p>{footer.photoCredit}</p>
      </div>
    </footer>
  );
}
