import type { Metadata, Viewport } from "next";
import { Heebo, Space_Grotesk } from "next/font/google";
import { getDictionary } from "@/content";
import { site } from "@/content/site";
import { defaultLocale, localeMeta } from "@/i18n/config";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const dict = getDictionary(defaultLocale);
const meta = localeMeta[defaultLocale];

export const metadata: Metadata = {
  metadataBase: new URL(`${site.url}/`),
  title: { default: dict.meta.title, template: `%s | ${dict.meta.siteName}` },
  description: dict.meta.description,
  applicationName: dict.meta.siteName,
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    locale: meta.ogLocale,
    siteName: dict.meta.siteName,
    title: dict.meta.title,
    description: dict.meta.description,
    url: "./",
    images: [{ url: "og.png", width: 1200, height: 630, alt: dict.meta.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: dict.meta.title,
    description: dict.meta.description,
    images: ["og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0F12",
  width: "device-width",
  initialScale: 1,
};

// Marks the document as scripted before paint, so entrance animations never hide content without JS.
const jsFlag = "document.documentElement.classList.add('js')";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={meta.lang} dir={meta.dir} className={`${heebo.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
