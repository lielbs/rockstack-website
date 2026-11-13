# RockStack — Reference-Led Editorial System

## Sources and capture context

The visual direction was extracted from the following public experiments by This Is Whitespace and adapted into an original RockStack system:

- [Experiments index](https://experiments.thisiswhitespace.com/)
- [Code Slice Hero](https://experiments.thisiswhitespace.com/code-slice-hero)
- [Pattern Cards](https://experiments.thisiswhitespace.com/pattern-cards)
- [Liquid Tags](https://experiments.thisiswhitespace.com/liquid-tags)
- [Dot Hover Cards](https://experiments.thisiswhitespace.com/dot-hover-cards)

Reference screenshots were inspected on 13 November 2026 at desktop size. They establish the desktop art direction, not exact mobile behavior. Mobile behavior below is an original RockStack implementation.

## Observed visual language

- Oversized typography is treated as image and broken across panels.
- Dark technical layers sit underneath brighter editorial surfaces.
- Poster-like cards use a limited black, orange and warm-ivory palette.
- Dot fields and simple geometry provide a recognizable graphic motif.
- Connected rounded forms communicate sequence and continuity.
- Motion is local to the object being explored; it does not move the entire page.
- Layouts use large scale contrast, disciplined metadata and generous negative space.

These are observed patterns. Spacing and dimensions are implementation estimates, not copied source tokens.

## RockStack interpretation

RockStack combines three reference ideas:

1. **Slice / reveal hero** — fragmented brand typography reveals a terminal-like system layer on hover or keyboard focus.
2. **Capability posters** — Build, Automate and Operate appear as three distinct poster surfaces with an original dot system.
3. **Connected delivery chain** — project stages form one connected sequence, communicating one team and one line of responsibility.

The artwork, copy, layout proportions and interactions are original to RockStack. No reference assets or source code are used.

## Tokens

### Color roles

- Night canvas: `#080A0D`
- Raised dark surface: `#101216`
- Warm ivory: `#F4F2EE`
- Editorial paper: `#ECE8DF`
- RockStack amber: `#E8892B`
- Muted dark text: `#50545A`
- Muted light text: `#AAB0B9`
- Positive status: `#73DCA3`
- Dark hairline: `rgb(255 255 255 / 0.12)`

Amber is a structural brand color: key panels, active states, buttons and system markers. It is not used as a large ambient glow.

### Typography

- Hebrew/UI: Heebo, weights 400–800.
- Latin/technical metadata: Space Grotesk, weights 400–700.
- Display headings use very tight line height and negative tracking.
- Technical metadata is uppercase, small and widely tracked.
- Hebrew copy remains comfortably spaced and never inherits display tracking.

### Shape and spacing

- Primary editorial panels: `0.55rem` to `1.75rem` radius.
- Connected process stages: `2.2rem` desktop radius; `1.6rem` mobile.
- Hairlines separate technical metadata from expressive surfaces.
- Section spacing continues to use the existing responsive `section-y` rhythm.

## Component guidance

### Hero

- Two-column composition on desktop; a deliberate single-column composition on tablet/mobile.
- Copy stays readable and stable while the artwork carries the interaction.
- The poster has eight typography panels over a static terminal layer.
- Hover and keyboard focus move only the panels.
- On touch devices, the poster remains a complete static composition and does not require hover to understand it.

### Capability posters

- Three surfaces: night, amber and ivory.
- Each card has technical metadata, a dot/geometry mark, a large Latin verb and Hebrew service meaning.
- Descriptive copy is always visible on touch and narrower viewports.
- Desktop hover reveals secondary detail and shifts only the selected card.

### Process chain

- Five connected stages form one horizontal chain on wide screens.
- The chain becomes vertical below tablet width.
- Every stage includes phase number, stage name, explanation and concrete deliverable.
- The visual connection is CSS-only and does not rely on a shader or canvas.

### Navigation and controls

- Links and buttons have visible hover, focus and pressed states.
- Click feedback uses short translation/scale only.
- The active navigation item has an amber rule.
- Mobile menu targets remain large and do not depend on pointer hover.

## Responsive behavior

- Desktop: expressive two-column hero, three equal posters and horizontal connected process.
- Tablet: hero stacks; posters become wide editorial rows; process becomes vertical.
- Mobile: full-width calls to action, two-column proof grid, 2×4 slice grid, vertical posters and connected process.
- Content order and semantic heading order stay unchanged.
- No horizontal page overflow is intentional.

## Performance constraints

- No Canvas, WebGL, Three.js scene or continuous render loop.
- No global `pointermove` handlers.
- No smooth-scroll runtime.
- No large `backdrop-filter` surfaces.
- Motion is transform/opacity based, local and bounded.
- `prefers-reduced-motion` removes entrance and interaction transitions.
- Legacy ambient animations are explicitly disabled.

## Accessibility

- The slice artwork is keyboard focusable and has an accessible description.
- All essential poster copy is visible without motion on touch devices.
- Focus states are visible.
- Color is not the sole carrier of status.
- Native scrolling and anchors are preserved.
- RTL reading order and LTR system metadata are explicitly separated.

## Unresolved validation

The implementation must pass lint and production build, then be visually reviewed at a desktop viewport and a narrow mobile viewport. Any layout issue found in those captures should be fixed before merge.
