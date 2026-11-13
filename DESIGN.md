# RockStack — Lightweight Editorial System

## Direction

RockStack should feel precise, established and technically capable. The visual system is based on strong typography, architectural diagrams, disciplined spacing and quiet interaction—not 3D, canvas effects, shader demos or permanent animation.

## Core principles

- Performance is part of the brand.
- One clear hierarchy per section.
- Motion is brief, purposeful and never required to understand content.
- Product and infrastructure are represented through diagrams, grids and real interface patterns.
- Hebrew remains the primary reading experience; Latin labels act as technical metadata.
- The existing brand palette, logo, business copy and contact flow remain authoritative.

## Palette

- Night: `#0D0F12`
- Deep surface: `#080A0D`
- Ivory: `#F4F2EE`
- Muted text: `#9DA4AD`
- Amber: `#E8892B`
- Hairline: `rgb(255 255 255 / 0.10)`

Amber is used for commercial emphasis, active states and system markers. It is not used as a large decorative glow.

## Typography

- Hebrew: Rubik
- Latin/system metadata: Space Grotesk
- Display headings use tight line height and negative tracking.
- Technical labels are small, uppercase and widely tracked.

## Hero

The hero is a two-column editorial composition:

1. Clear positioning, short lead, two actions and four capability markers.
2. A flat system blueprint showing the five layers RockStack owns.

The blueprint uses HTML and CSS only. It has no canvas, WebGL, particle field, pointer tracking or continuous animation.

## Interaction

- Short entrance transition on initial load only.
- Simple color and spacing response on hover.
- Native scrolling.
- No custom cursor.
- No pointer-driven 3D tilt.
- No permanent RAF loops.
- Reduced-motion users receive the same hierarchy without movement.

## Performance constraints

- Avoid `backdrop-filter` on sticky, full-width or large surfaces.
- Avoid canvas or WebGL above the fold unless a measured business case justifies it.
- Avoid global `pointermove` listeners.
- Avoid smooth-scroll libraries that run a permanent animation frame.
- Prefer static CSS grids, SVG and semantic HTML.
- Keep all decorative animation composited, bounded and finite.

## Accessibility

- Semantic heading order and section landmarks.
- Visible keyboard focus.
- Native anchor behavior and browser scrolling.
- Sufficient text contrast.
- No information communicated through motion or color alone.
- Touch layouts must not depend on hover.
