import type { CSSProperties } from "react";
import type { Dictionary } from "@/content";
import { Words } from "@/components/ui/Words";
import { FlowMark } from "@/components/layout/FlowMark";
import { site } from "@/content/site";
import { ContactForm } from "@/components/contact/ContactForm";

export function Contact({ dict }: { dict: Dictionary }) {
  const { contact } = dict;
  const whatsappHref = site.whatsapp ? `https://wa.me/${site.whatsapp}` : undefined;
  const emailHref = site.email ? `mailto:${site.email}` : undefined;
  const hasDirectContact = Boolean(whatsappHref || emailHref);

  return (
    <section id="contact" aria-labelledby="contact-title" className="on-dark frame section-y text-ivory">
      <FlowMark dict={dict} id="contact" className="mb-6" />
      <h2 id="contact-title" data-reveal="words" className="max-w-[16ch] text-title font-bold">
        <Words text={contact.heading} />
      </h2>
      <p data-reveal style={{ "--i": 1 } as CSSProperties} className="mt-6 max-w-[40ch] text-statement text-stone">
        {contact.lead}
      </p>

      <div className="mt-16 lg:mt-20">
        <ContactForm contact={contact} />
      </div>

      {hasDirectContact ? (
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-28 lg:grid-cols-12">
          <h3 className="text-small font-semibold text-stone sm:col-span-2 lg:col-span-12">{contact.direct.title}</h3>
          {site.whatsapp ? (
            <DirectLink label={contact.direct.whatsapp} value={`+${site.whatsapp}`} href={whatsappHref} className="lg:col-span-5" />
          ) : null}
          {site.email ? (
            <DirectLink label={contact.direct.email} value={site.email} href={emailHref} className="lg:col-span-6 lg:col-start-7" />
          ) : null}
        </div>
      ) : null}
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
