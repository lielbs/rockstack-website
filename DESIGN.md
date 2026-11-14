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
2. The layer stack: the logo's three slabs as a 3D object, one per layer of a system (apps & AI, systems & data, infrastructure & security). Pointing at, focusing or tapping a layer lifts it and lists what it holds in a card below; the stack opens up as the hero scrolls away.

On capable devices the stack is a WebGL scene (three.js, `src/components/three/stackGL.ts`), loaded after the page has painted: the slabs are drawn as a blueprint, printed into solid material by a rising scan line, then turn toward the pointer under a light that follows it, over a field of dots that swells beneath the cursor. Scrolling opens the stack and data rises between the layers.

The same stack in CSS 3D (`LayerStack`) is what shows before the scene is ready and the permanent fallback for reduced motion, Save-Data, fewer than 4 cores, under 4 GB memory or no WebGL2.

Budget for the scene, measured with `.taste-skill/qa/perf-idle.mjs` after the intro: about 4–5% main-thread busy on a normal CPU, 20–33% at 4–6x CPU throttle. It holds that by: no shadow maps (texture contact shadow), every particle animated in a shader, pixel ratio capped at 1.75 and dropped to 1 on slow devices, half frame rate when nothing is moving, callouts written as transforms only when they move, and no rendering at all while the hero is off screen or the tab is hidden.

## Interaction

- Short entrance transition on initial load only.
- Hero stack: the WebGL scene is the one place with pointer-driven motion; everything else on the page stays without it.
- Simple color and spacing response on hover.
- Native scrolling.
- No custom cursor.
- No pointer-driven 3D tilt outside the hero stack.
- No permanent RAF loops.
- Reduced-motion users receive the same hierarchy without movement.

## Performance constraints

- Avoid `backdrop-filter` on sticky, full-width or large surfaces.
- Avoid canvas or WebGL above the fold unless a measured business case justifies it. The hero stack is that case: it is the brand's one signature moment and stays inside the budget above.
- Avoid global `pointermove` listeners.
- Avoid smooth-scroll libraries that run a permanent animation frame.
- Prefer static CSS grids, SVG and semantic HTML.
- Keep all decorative animation composited, bounded and finite.
- Loops that remain (marquee, status ping) animate transform/opacity only and pause while their section is off screen (`.is-offscreen`, set by RevealRoot).

## Accessibility

- Semantic heading order and section landmarks.
- Visible keyboard focus.
- Native anchor behavior and browser scrolling.
- Sufficient text contrast.
- No information communicated through motion or color alone.
- Touch layouts must not depend on hover.
