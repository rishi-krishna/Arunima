# Smooth Light-Mode Section Transitions Design

**Date:** 2026-08-21  
**Status:** Approved design

## Objective

Replace abrupt ivory-to-blush and blush-to-ivory section boundaries with subtle color blends while preserving the existing alternating section colors, layout, content, and dark theme.

## Approved Visual Treatment

- Use a 40px vertical gradient at light-mode boundaries where adjacent sections have different background colors.
- Keep a slightly visible boundary so each section remains visually distinct.
- Blend from the preceding section’s exact background color into the following section’s exact background color.
- Do not add a transition between consecutive sections that already share the same background.
- Do not animate the gradient based on scroll position; the smooth appearance comes from the static color blend itself.

## CSS Architecture

- Add named CSS tokens for the light-theme section backgrounds used by the standard, soft/blush, primary-tint, and experiences sections.
- Each major `.site-section` receives its own section-color custom property.
- Light mode uses a section-aware linear gradient from a configured preceding color to the section’s own color over the first 40px.
- Adjacent-selector rules identify only the boundaries where the preceding background differs.
- The hero-to-first-section boundary must blend from the main warm-white background into the soft blush section.
- The FAQ-to-insights and insights-to-Instagram boundaries must blend between their actual section colors.
- Consecutive soft sections, including the consultation-process-to-biography and Instagram-to-booking boundaries, remain visually continuous without an artificial stripe.

## Dark Theme

- Dark mode must retain its current solid section backgrounds and contrast.
- The new light-mode gradient rules must be scoped under `[data-theme="light"]`.
- No dark-theme token, heading color, form color, or card surface may change.

## Layout and Interaction

- The gradient is painted within the following section’s existing box; it must not overlap adjacent content or alter document height.
- Do not use negative margins, absolute overlays, masks, scroll event handlers, or JavaScript.
- Preserve all current section padding, anchors, sticky-header behavior, animations, and reduced-motion handling.
- The blend must not intercept clicks or create stacking-context issues.

## Testing

- Add structural assertions for the 40px gradient and light-theme scope.
- Assert dark mode does not use the new section-transition gradient.
- Verify representative ivory-to-blush and blush-to-ivory boundaries on desktop and mobile screenshots.
- Confirm section positions, booking anchor placement, horizontal overflow, form behavior, theme switching, console output, and page errors remain unchanged.

## Out of Scope

- Scroll-driven background animation.
- Changing the approved palette, section order, content, padding, cards, dark mode, or WhatsApp behavior.
- Adding decorative waves, curves, separators, shadows, or new border artwork.

## Acceptance Criteria

1. Light-mode color changes blend over approximately 40px instead of forming a hard horizontal line.
2. Alternating ivory and blush sections remain recognizable.
3. Consecutive sections with the same background remain seamless.
4. Dark mode looks identical to the current deployed version.
5. No layout shift, overlap, click interception, or horizontal scrolling is introduced.
6. Desktop and mobile browser verification completes without console or page errors.
