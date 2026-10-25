import type { CSSProperties } from "react";
import type { Dictionary } from "@/content";
import { placeholders, site } from "@/content/site";
import { ContactForm } from "@/components/contact/ContactForm";

export function Contact({ dict }: { dict: Dictionary }) {
  const { contact } = dict;
  const whatsappHref = site.whatsapp ? `https://wa.me/${site.whatsapp}` : undefined;
  const emailHref = site.email ? `mailto:${site.email}` : undefined;

  return (
    <section id="contact" aria-labelledby="contact-title" className="on-dark grain frame section-y bg-basalt text-ivory">
      <h2 id="contact-title" data-reveal className="max-w-[16ch] text-title font-bold">
        {contact.heading}
      </h2>
      <p data-reveal style={{ "--i": 1 } as CSSProperties} className="mt-6 max-w-[40ch] text-statement text-stone">
        {contact.lead}
      </p>

      <div className="mt-16 lg:mt-20">
        <ContactForm contact={contact} />
      </div>

      <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-28 lg:grid-cols-12">
        <h3 className="text-small font-semibold text-stone sm:col-span-2 lg:col-span-12">{contact.direct.title}</h3>
        <DirectLink label={contact.direct.whatsapp} value={site.whatsapp ? `+${site.whatsapp}` : placeholders.whatsapp} href={whatsappHref} className="lg:col-span-5" />
        <DirectLink label={contact.direct.email} value={site.email ?? placeholders.email} href={emailHref} className="lg:col-span-6 lg:col-start-7" />
      </div>
    </section>
  );
}

function DirectLink({ label, value, href, className = "" }: { label: string; value: string; href?: string; className?: string }) {
  const content = (
    <>
      <span className="block text-small text-stone">{label}</span>
      <span className="mt-1 block text-statement font-bold transition-colors group-hover:text-amber">
        <bdi>{value}</bdi>
      </span>
    </>
  );
  return href ? (
    <a href={href} className={`group block ${className}`} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener">
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
}
