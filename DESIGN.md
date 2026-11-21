# Spider design rules

Rules the owner has set while building this site. Each has its reason, and a comment with the date and the owner's words. Follow them when building or changing any UI.

## Surfaces

- **Headers, chips, pills, cards and overlays have solid backgrounds. Never make a surface translucent or use `backdrop-blur`.**
  Why: see-through surfaces let busy backgrounds (the ASCII grid) bleed through, and the owner never asked for them. Tints *inside* an illustration on a solid panel (for example `bg-brand-500/15` on a tag) are fine.
  <!-- 2026-11-15: "Where is this see-through behaviour coming from? I have corrected you so much" -->

## Spacing & layout

- **Size and space with Tailwind's scale classes (`gap-2`, `p-6`, `mt-12`). Never use arbitrary pixel values like `gap-[8px]` or `p-[24px]`.**
  Why: semantic classes keep the codebase "spic and span", with no spaghetti code. Untitled UI's own components in `src/components/base/` are exempt. Enforced by ESLint.
  <!-- 2026-11-13: "I want tailwind CSS as well as the semantic styling (gap-2 in place of gap-(8px))" -->

- **Every section's inner frame uses `px-4 sm:px-6 lg:px-8` (16 / 24 / 32px) and `py-12 sm:py-18 lg:py-24` (48 / 72 / 96px). Heading-to-content gaps also step down on smaller screens.**
  Why: spacing scales down on smaller screens the way Stripe's does. Spacing inside components stays the same at every size.
  <!-- 2026-11-15: "make every 72px spacing 80px" → "let's up the 80px spacings to 96px"; 2026-11-17: "should drop to 1.5rem on tablets and 1rem on mobile", "drop from 96px to 48px on mobile with an in-between value for tabs", "Keep 72", "The heading to content gaps should drop on mobile too" -->

## Typography

- **On phones (below `sm`): body, eyebrow and button text are 14px; the hero headline is 32px; the hero button and the mobile menu button stay 16px. The hero shows its headline only, and the supporting sentence returns from `sm` up.**
  Why: match how Stripe sets its landing page on small screens.
  <!-- 2026-11-17: "Shouldn't we drop the body, eyebrow and button text to 14 on mobile?", "use 32px for the hero text on mobile. The hero button and the mobile menu button should retain 16px"; 2026-11-18: "Yes, match Stripe" -->

- **On phones, only a section's opening button pair stacks full width (`w-full flex-col` below `sm`). Every other button keeps its natural width.**
  Why: Stripe stretches only its main section-opening pairs.
  <!-- 2026-11-18: "Make the hero buttons full width on mobile like Stripe" -->

## Motion

- **The spider mascot walks at 72px/s or slower. It never darts, skitters or moves suddenly.**
  Why: a visitor said its walking speed startled them, and it has to stay friendly for people with arachnophobia.
  <!-- 2026-11-16: "Got feedback from someone who says the spider's walking speed startled them" → "make it a 72px/s movement" -->

- **Motion is continuous and fluid. Never build a movement from stop-start steps; ease only the start and end of the whole movement.**
  Why: stiff or stepped motion reads as janky. Motion should simulate real, physical movement.
  <!-- 2026-11-13: "the web feels quite stiff and janky. We need to make it fluid to simulate real motion"; 2026-11-21: "make the movement smooth and not choppy" -->

## Illustration

- **Use reference sites for quality and technique only. Never reproduce a reference's signature concept or look, whether wasp.sh, AccessGrid or any other. Always add Spider's own twist.**
  Why: Spider is a differentiated competitor concept, built as a portfolio pitch, so a copy defeats the point.
  <!-- 2026-11-13: "We won't copy anything directly from there"; 2026-11-21: "we built it exactly as accesgrid built theirs. We want differentiation" -->

## Copy

- **Never use placeholder company names like "Acme". Refer to the example apps (Rosterly, Stockwell, Courseyard, Cartwise) as concept products, never fake ones.**
  Why: placeholders read as fake; the examples are concept products.
  <!-- 2026-11-15: "Change all Acme mentions to something else", "They are not fake products, but concept products" -->

## Settled values

Decisions on specific pieces. Keep them unless the owner changes them.

- **Stack tags in the "Build" needs checker:** "Supported" is `bg-green-500/15 text-green-400`. "Via extension" is `bg-celeste-500/20 text-celeste-300`, a neutral "plug this in", so it doesn't look like a problem. There are no "unsupported" stacks.
  <!-- 2026-11-15: "remove any 'unsupported' stacks, and replace them with 'via extension' ones … change the color … to something that makes it look less of an issue", "improve the supported tag color to a better success green" -->
- **Feature-map cards (Features section):** inactive cards sit at `opacity-80`, not fainter.
  <!-- 2026-11-15: "Please can you increase the opacity of the inactive cards in the features section asset?" -->
- **Examples section:** "See more examples" is a secondary button (`color="secondary"`). Exactly one accordion item is open at a time, the first on load. The open item's "View source" button takes the place of its close icon.
  <!-- 2026-11-15: "Make the 'see more examples' CTA a secondary CTA"; accordion behaviour as specified the same day -->
- **ASCII grid (hero and CTA):** a tight grid in a few restrained shades. The base glyph colour is `text-aztec-300`, the drift band `aztec-500`, pulses `aztec-600` warming to `punch-300`, and the cursor glow `brand-600`.
  <!-- 2026-11-13: "tighten the grid and reduce the shades of the glyphs"; 2026-11-19: "bake in a light orange in the pulse", "use the brand color as an additional color when the cursor hovers over the grid" -->
- **Footer logo animation (`SpiderRolls`):**
  - 8 dashed wireframe cubes, rolled in by spiders, with never more than 3 spiders out at once.
  - About 10 seconds in total.
  - Each cube fills with its piece of the outlined logo and "spider" wordmark: aztec-400 lines, the word set at weight 700 with -0.012em tracking.
  - 2.5rem of space above and below.
  - The logo double-blinks when complete, then blinks every 7–12 seconds while on screen.
  - Tune it on `/footer-lab`.
  <!-- 2026-11-21: "use 8 cubes", "slow down the spiders such that it takes 10 seconds again", "increase it to 2.5rem", "Instead of a fill, can it be an outline … like accessgrid's outlines", "make it a little bit wider" -->
