# Dark Header Contrast and WhatsApp Navigation Fix Design

**Date:** 2026-08-21  
**Status:** Approved design

## Objective

Correct two focused issues in the deployed single-page website without changing its content, layout, booking fields, WhatsApp message, or branding structure.

## Header Name Contrast

- Keep the header surface warm ivory in both themes.
- Display `Dr. Arunima Musthyala` in softened logo teal `#23666B` in both themes.
- Introduce a dedicated header-foreground CSS token so the header name does not inherit the pale dark-theme heading color.
- Do not change the hero practitioner name or other headings.
- Preserve the exact supplied JPEG logo and existing header sizing.

## WhatsApp Submission Navigation

- Preserve current form validation and the existing prefilled WhatsApp message.
- Preserve the destination number `+91 99999 99999`.
- Replace `window.open(bookingUrl, "_blank", ...)` with same-page navigation using `window.location.assign(bookingUrl)`.
- Do not create a new browser tab or window when the user selects `Continue to WhatsApp`.
- Keep the manual WhatsApp fallback link populated and visible after a valid submission.
- Invalid submissions must remain on the page and must not navigate.

## Testing

- Add a structural regression assertion for the softened header-foreground token and its use by `.site-brand`.
- Add a structural regression assertion that the form uses `window.location.assign(bookingUrl)` and contains no `window.open(bookingUrl, ...)` call.
- Verify invalid submission does not navigate.
- Verify valid submission attempts same-page navigation to `https://wa.me/919999999999?text=...` with all completed fields.
- Verify desktop and mobile layouts, both themes, console output, and page errors.

## Out of Scope

- Changing the logo, palette outside the header name, form fields, message wording, WhatsApp number, or consultation content.
- Adding modals, confirmation pages, delayed redirects, or new tabs.

## Acceptance Criteria

1. The top header name is clearly readable on the ivory header in light and dark modes.
2. The header name color is `#23666B`, matching a softened version of the supplied logo teal.
3. A valid booking submission navigates the current page directly to the prefilled WhatsApp URL.
4. No blank tab or additional browser window opens.
5. Invalid forms do not navigate.
6. Existing WhatsApp message content and number remain unchanged.
