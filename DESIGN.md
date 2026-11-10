# RockStack Interactive Studio — Design Direction

## Sources and capture context

- Reference: https://experiments.thisiswhitespace.com/
- Target: https://rockstackds.com/
- Captured: 2026-11-10, desktop viewport 1440 × 1000, full-page request.
- Evidence: Firecrawl branding, rendered page copy, HTML/image inventory and full-page screenshot capture.
- The reference is inspiration only. No source code, artwork, copy, or branded assets are copied.

## What the reference does well

The reference earns its premium feel through restraint and one physical idea per experiment. It uses a nearly black field, white type, thin neutral borders, very large media, compact metadata, and interaction as the main visual asset. The energy comes from cursor response, shaders, particles, liquid glass, depth and scroll-led transformations—not from decorative gradients or dense copy.

### Extracted tokens

These values were returned by the reference capture:

- Background: `#0A0A0A`
- Primary text: `#FFFFFF`
- Muted surface: approximately `#161616`
- Border: approximately `#2F2F2F`
- Primary family: Geist
- Monospace family: Geist Mono
- Base spacing unit: 8px
- Card radius: mostly square; controls range from 20px to fully pill-shaped
- Motion personality: low-energy, physical, deliberate

The 8px spacing rhythm and typography are observed values. Section dimensions and animation timings below are RockStack implementation choices.

## RockStack adaptation

RockStack keeps its existing identity:

- Night: `#0D0F12`
- Ivory: `#F4F2EE`
- Amber: `#E8892B`
- Signal cyan: `#7EE5FF`
- Signal violet: `#9D8CFF`
- Status green: `#72F39E`
- Hebrew: Rubik
- Latin / system labels: Space Grotesk

The visual direction is **precision infrastructure with a living intelligence layer**. Amber remains the commercial brand accent. Cyan and violet are reserved for system activity, data flow and interactive light.

## Signature interactions

### 1. Signal field

The hero system map receives a lightweight canvas particle field. Particles orbit the system core, connect locally, respond to the pointer and remain subordinate to the existing SVG diagram. This creates the feeling of a live computational environment without replacing the accessible HTML/SVG content.

### 2. Reactive glass surfaces

The three concept screens become responsive glass instruments:

- subtle 3D tilt on fine pointers;
- a radial light that follows the pointer;
- stronger border and depth only while engaged;
- no motion on coarse pointers or when reduced motion is requested.

### 3. Ambient pointer light

A soft, fixed pointer aura connects the header, hero and showcase visually. It is decorative, pointer-transparent and disabled for touch and reduced motion.

### 4. Directed entry

The hero headline, proof items and system panel enter in a short sequence. Timing is fast enough to preserve orientation: approximately 500–900 ms with quartic easing and no elastic overshoot.

## Layout guidance

- Keep the current continuous vertical flow and numbered rail.
- Preserve generous whitespace; interactive pieces need room to read.
- Hero remains a 12-column split on desktop and one column on smaller screens.
- The showcase remains a mixed 7/5/12 composition on desktop.
- Do not add a second carousel, horizontal-scroll trap or full-screen loader.
- Keep all business copy, contact behavior and semantic section landmarks intact.

## Accessibility and performance

- Canvas is decorative and `aria-hidden`; the existing system map carries meaning.
- Support keyboard focus independently of hover/tilt.
- Respect `prefers-reduced-motion` and coarse pointers.
- Cap canvas device pixel ratio and particle count.
- Pause animation when the tab is hidden.
- Avoid custom pointer replacement.
- Preserve visible focus, RTL reading order, text resizing and native scrolling.

## Image references

Reference experiment poster inventory included liquid glass, particle phones, shader cards, code-slice hero, dot hover cards and viewport transitions. These assets are not used in RockStack. The implementation recreates only general interaction principles using original canvas, CSS and the existing RockStack UI.

## Unresolved / intentionally excluded

- The reference's exact WebGL shaders and physics behavior were not reproduced.
- Mobile motion states were not established by the desktop capture; RockStack therefore uses a conservative no-tilt touch treatment.
- No third-party 3D runtime is added for this pass. The existing bundle remains the source of truth.
