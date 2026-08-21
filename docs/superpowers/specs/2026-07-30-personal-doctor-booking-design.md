# Dr. Arunima Personal Website and Booking Design

## Goal

Polish the existing static website into a clearly personal website for Dr. Arunima Mustyala. Preserve the established green visual system, content structure, and motion while making consultation booking and WhatsApp contact obvious and functional.

## Scope

- Keep the existing vanilla HTML, CSS, and JavaScript architecture.
- Keep the current colors, typography, section order, responsive layout, and animations.
- Use “Dr. Arunima Mustyala” consistently in visible brand and doctor-identification areas.
- Keep phone numbers, email addresses, street addresses, and hospital names out of visible page content.
- Use `+91 99999 99999` only as the destination behind WhatsApp links.

## Consultation Actions

- “Book Consultation” is the primary action in the site header, mobile navigation, hero, and relevant calls to action.
- A WhatsApp action appears beside important booking calls to action without visually competing with the primary button.
- A persistent WhatsApp shortcut appears on every page:
  - Desktop: labeled green pill.
  - Mobile: compact circular control with an accessible label.
- Every WhatsApp action opens `wa.me/919999999999` in a new tab with a suitable pre-filled introductory message.

## Booking Form

The booking page remains a native HTML form enhanced with JavaScript.

1. The patient supplies their name, consultation type, preferred date/time, contact preference, and a short note using the existing form fields.
2. Required fields are validated using native constraints and small inline guidance.
3. On valid submission, JavaScript builds a concise, URL-encoded WhatsApp message.
4. The browser opens a `wa.me/919999999999` URL containing the booking summary.
5. The page keeps a direct WhatsApp fallback link if pop-up handling or browser restrictions prevent automatic navigation.

The form must not imply that a consultation is confirmed. Copy must say that Dr. Arunima will confirm availability separately. A brief notice must discourage patients from sharing urgent or highly sensitive medical information through WhatsApp.

## Visual Refinements

- Preserve the calm botanical green identity and existing page proportions.
- Improve CTA hierarchy and spacing rather than redesigning the site.
- Make Dr. Arunima’s name and personal-practice positioning clearer in the hero, navigation, footer, and consultation areas.
- Restore the WhatsApp control with an unmistakable WhatsApp-style green treatment and clear hover/focus states.
- Retain existing scroll reveals, accordions, protocol tabs, review carousel, Instagram carousel, and reduced-motion behavior.

## Accessibility and Error Handling

- WhatsApp controls have descriptive accessible names and visible keyboard focus.
- Form fields retain explicit labels and native validation.
- Buttons and links remain keyboard accessible.
- Motion respects `prefers-reduced-motion`.
- The booking page displays a clear fallback action if automated WhatsApp opening is unavailable.

## Verification

- Test the homepage, booking page, primary informational pages, and representative treatment/location/blog pages.
- Verify desktop and mobile layouts.
- Verify navigation, mobile menu, accordions, tabs, carousels, booking validation, and generated WhatsApp URLs.
- Confirm all local assets load, internal links resolve, and the browser console has no site errors.
- Confirm the deployed GitHub Pages build loads versioned assets and exposes the same behavior as the local build.

## Out of Scope

- No React or other framework.
- No backend, database, payment flow, or calendar scheduling integration.
- No visible phone number, email address, street address, or hospital affiliation.
- No large visual redesign or replacement of the current content structure.
