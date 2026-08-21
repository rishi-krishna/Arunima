# Nirmaya Logo-Led Brand Refresh Design

**Date:** 2026-08-21  
**Status:** Approved visual direction  
**Site:** Dr. Arunima Musthyala single-page consultation website

## Objective

Refresh the existing single-page website so its visual identity matches the supplied Nirmaya Homeopathy Clinic logo. Preserve the current homepage structure, content, consultation workflow, WhatsApp behavior, and single-page architecture while improving the palette, header branding, consistency, and visual polish.

## Approved Direction

The selected direction is **Teal-led quiet luxury**, refined to remain light, calm, and welcoming. The design must not feel dark or heavy.

The interface will use warm white and ivory as its dominant surfaces, a softened medium teal for primary actions and important text, muted gold for thin decorative accents, and dusty blush only as a restrained supporting color.

## Logo Assets

- Use the exact supplied file `nirmaya logo no nmae.jpeg` as the visible header mark.
- Preserve the JPEG artwork. Do not redraw, regenerate, trace, or replace the lotus design.
- The header must continue to show `Dr. Arunima Musthyala` beside the mark.
- Use `nirmaya logo.jpeg` only as the color and brand reference; do not add the full named logo to the header.
- Store the production asset under the existing site assets structure with a stable, web-friendly filename while preserving the JPEG format and original visual content.
- Size the mark with `object-fit: contain` and an ivory-compatible background so its embedded background blends naturally into the header.

## Color System

The approved starting palette is:

| Role | Color | Usage |
|---|---|---|
| Warm page background | `#FFFDF9` | Main page canvas |
| Logo ivory | `#FBF5EC` | Header and soft branded surfaces |
| Soft teal | `#337D7D` | Primary buttons, links, active states, important headings |
| Teal hover | `#286B6C` | Hover and pressed states with sufficient contrast |
| Muted gold | `#C3A15A` | Fine rules, small accents, selected borders, restrained highlights |
| Dusty blush | `#E4BCBC` | Occasional soft section tint or small accent only |
| Main text | `#263E3F` | Headings and readable body text without near-black heaviness |
| Secondary text | `#657170` | Supporting copy |

Exact values may be adjusted slightly during implementation to meet accessible contrast, but the lightness and hue relationships must remain faithful to this palette.

## Header

- Replace the current generated/legacy logo mark with the exact supplied mark-only JPEG.
- Keep the practitioner name beside the logo.
- Use a warm ivory header surface and a subtle gold-tinted bottom border.
- Preserve the existing theme control and simplified single-page shell.
- Maintain comfortable mobile sizing without allowing the image or name to crowd header actions.
- Avoid strong shadows, dark header fills, or oversized branding.

## Page-Wide Visual Treatment

- Preserve all approved homepage sections, copy, order, and functional controls.
- Re-map existing green and navy tokens to the approved teal, ivory, warm white, gold, and blush system.
- Use teal for consultation and WhatsApp actions, with visually distinct primary and secondary treatments where both appear together.
- Use muted gold as thin separators, understated borders, small eyebrow labels, or focus details. Do not use large gold panels or long gold text.
- Use blush only on a small number of secondary backgrounds or accents. It must never compete with teal.
- Reduce heavy dark blocks and avoid pure black wherever a softer teal-charcoal provides sufficient contrast.
- Keep cards and sections spacious, with low-contrast warm borders and restrained shadows.
- Preserve existing responsive behavior and animations, while ensuring motion remains subtle and honors reduced-motion preferences.

## Typography and Hierarchy

- Preserve the existing content hierarchy and legibility.
- Use softened teal-charcoal for headings instead of dark navy.
- Keep body text highly readable on warm white/ivory surfaces.
- Avoid overly decorative typography. The logo supplies the premium character; the interface should remain clinical, calm, and clear.
- No new marketing claims, credentials, ratings, patient counts, or treatment promises may be introduced.

## Consultation and WhatsApp Experience

- Preserve the consultation form at the bottom of the homepage.
- Preserve HTML validation and the current WhatsApp submission workflow.
- Preserve the configured WhatsApp destination `+91 63031 96195`.
- Restyle form fields, focus states, buttons, and validation presentation to match the new palette.
- Keep the floating WhatsApp control visible, accessible, and non-overlapping on mobile.

## Light and Dark Themes

- The default light theme is the primary brand expression and must remain bright.
- Retain the existing theme control.
- The dark theme should use a softened deep teal-charcoal rather than pure black, with muted ivory text and restrained gold accents.
- Both themes must maintain readable text, visible form controls, accessible focus states, and clear button contrast.

## Responsive and Accessibility Requirements

- Support the existing desktop and mobile breakpoints.
- Keep the header logo sharp and proportionate at mobile sizes.
- Maintain WCAG-conscious contrast for text, buttons, form fields, and focus indicators.
- Do not use low-contrast pastel text for critical information or calls to action.
- Retain keyboard usability, semantic form labeling, reduced-motion handling, and theme-state behavior.

## Out of Scope

- Rebuilding or generating the logo.
- Changing the homepage content, section order, practitioner name, or medical details.
- Adding additional pages, navigation menus, registration, authentication, pricing, ratings, testimonials, or new treatment content.
- Changing the WhatsApp number or consultation workflow.
- Reintroducing removed placeholders, image galleries, patient callouts, duplicate consultation blocks, or dummy images.

## Acceptance Criteria

1. The header displays the exact supplied mark-only JPEG and `Dr. Arunima Musthyala`.
2. The page is visually led by warm white/ivory and soft teal, without a dark or heavy overall appearance.
3. Gold appears only as a restrained brand accent, including fine lines or borders inspired by the full logo.
4. Dusty blush is used sparingly and does not reduce readability.
5. Existing single-page content and consultation functionality remain intact.
6. WhatsApp actions continue to target `+91 63031 96195`.
7. Desktop and mobile layouts remain polished, with no overlaps, unexpected empty spaces, or horizontal scrolling.
8. Light theme, dark theme, keyboard focus, validation, and reduced-motion behavior are verified.
9. No old placeholder logo remains visible or referenced by the production page.
10. The deployed GitHub Pages/custom-domain site loads the refreshed assets successfully with no console or page errors.
