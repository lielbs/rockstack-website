# RockStack website

Brand site for **RockStack**: *Anyone can build. We build on rock.*
Hebrew-first (RTL), static export of Next.js, hosted on GitHub Pages.

## Stack

- Next.js 16 (App Router, `output: "export"`) + TypeScript + Tailwind CSS 4
- Motion (`motion/react`) for the contact "build your stack" animation only, lazy-loaded near the form
- Everything else (slab assembly, scroll story, entrances) is CSS + a few small client hooks
- Fonts via `next/font`: Heebo (Hebrew) and Space Grotesk (Latin, logo)

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static site in ./out
npm run serve        # serves ./out on http://localhost:4175 (gzip, like Pages)
npm run lint
```

## Deploy (GitHub Pages)

Every push to `main` runs `.github/workflows/deploy.yml`: lint → build → publish `out/` to Pages.
One-time setting: **Settings → Pages → Source: GitHub Actions**.

Repository variables (Settings → Secrets and variables → Actions → Variables):

| Variable | Purpose |
| --- | --- |
| `CUSTOM_DOMAIN` | e.g. `rockstack.co.il`. Once set, the site builds for the domain root (no `/rockstack-website` prefix). Also add the domain under Settings → Pages and the DNS records at your registrar. |
| `CONTACT_ENDPOINT` | URL that accepts a JSON `POST` from the contact form (Formspree, Web3Forms, Make/Zapier webhook, CRM). Without it the form opens a pre-filled email. |

The same build also works on Vercel or any static host (`npm run build`, publish `out/`).

## Where things live

```
src/content/he.ts        all Hebrew copy (one dictionary per locale)
src/content/types.ts     the Dictionary shape an `en.ts` must follow
src/content/site.ts      email / phone / WhatsApp / city / form endpoint (null → placeholder)
src/i18n/config.ts       locales and their dir/lang
src/app/globals.css      design tokens (colours, type steps, radii, motion)
src/components/brand     Logo, LogoMark, IsoStack (isometric slabs)
src/components/sections  one file per page section
src/components/contact   form + live stack preview
scripts/                 image preparation, brand assets (OG/icons), local server
```

Adding English later: create `src/content/en.ts` typed as `Dictionary`, add `"en"` to `locales`
with `dir: "ltr"`, and add an `app/en/page.tsx` that renders the same sections with `getDictionary("en")`.

## Images

Photographs are from Unsplash (Unsplash License: free for commercial use, no attribution required),
converted to the brand duotone by `scripts/prepare-images.mjs`. Sources are listed in `docs/CREDITS.md`.
Replace them with your own photography any time: drop the originals in `.taste-skill/source/`
with the same names and run `node scripts/prepare-images.mjs`.

Share image and icons: `node scripts/generate-brand-assets.mjs` (writes `public/og.png`,
`src/app/apple-icon.png`, `src/app/favicon.ico`).

## Placeholders to fill before launch

| Where | Placeholder |
| --- | --- |
| `src/content/site.ts` | email, phone, WhatsApp number, city |
| `src/content/he.ts` → about | founded year `[שנת הקמה]`, years of experience `[מספר שנות ניסיון]` |
| `src/content/he.ts` → about.partners | role descriptions only; names are intentionally left out |
| `src/content/he.ts` → sectors | client logos `[לוגו לקוח]` (only with client permission) |
| `src/app/accessibility/page.tsx` | coordinator (a role is enough, e.g. “צוות RockStack”), response time, testing details, known limitations, update date |
| `src/app/privacy/page.tsx` | form/CRM provider, hosting, retention period, analytics, update date; **legal review required** |
| Repository variable | `CONTACT_ENDPOINT` |
