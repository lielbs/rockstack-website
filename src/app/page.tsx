import { getDictionary } from "@/content";
import { defaultLocale } from "@/i18n/config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { RevealRoot } from "@/components/motion/RevealRoot";
import { Hero } from "@/components/sections/Hero";
import { Belief } from "@/components/sections/Belief";
import { Strata } from "@/components/sections/Strata";
import { Difference } from "@/components/sections/Difference";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Sectors } from "@/components/sections/Sectors";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { Marquee } from "@/components/sections/Marquee";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

export default function Home() {
  const dict = getDictionary(defaultLocale);
  return (
    <>
      <SkipLink label={dict.a11y.skip} />
      <Header dict={dict} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero dict={dict} />
        <Belief dict={dict} />
        <Marquee items={dict.marquee} />
        <Strata dict={dict} />
        <Difference dict={dict} />
        <Services dict={dict} />
        <Process dict={dict} />
        <Sectors dict={dict} />
        <About dict={dict} />
        <Contact dict={dict} />
      </main>
      <Footer dict={dict} />
      <RevealRoot />
      <SmoothScroll />
      <OrganizationJsonLd dict={dict} />
    </>
  );
}
