# Arunima Mustyala Clinic Website — Design Specification

## Objective

Create a standalone, static multi-page website in the `rishi-krishna/Arunima` repository. Recreate the public reference site at `https://www.drneha.in/` with high visual and behavioral fidelity, while changing the displayed practitioner name to **Arunima Mustyala** and using local dummy images until final photography is supplied.

The implementation is a clean-room recreation based on public visual and behavioral observation. It will not copy the reference site's source code or reuse its branded image assets.

## Approved Technical Direction

Use plain HTML, CSS, and JavaScript:

- one static HTML document per public route;
- normal anchor-based navigation;
- one shared visual system in `assets/css/styles.css`;
- small shared JavaScript modules for reusable UI and interactions;
- no React, framework runtime, package dependency, or mandatory build step;
- deployable on GitHub Pages or any ordinary static host.

Shared header, footer, cookie notice, floating actions, and clinic assistant will be implemented as lightweight JavaScript-rendered custom elements. Page-specific content remains semantic static HTML.

## Visual Fidelity

The visual system was measured from the live reference at a 1440 × 900 viewport.

### Core palette

- Background: `#fafafa`
- Foreground: `#111827`
- Primary dark green: `#176d37`
- Bright hero CTA green: `#22c35d`
- Muted sage: `#d6e1d6`
- Card surface: `#f5f5f5`
- Card border: approximately `#dee0e3`

Dark mode will reproduce the reference behavior with equivalent contrast and component states.

### Typography and geometry

- Inter is used throughout.
- The navigation is 65px high, sticky, translucent, and backdrop-blurred.
- The desktop homepage hero is a centered, full-width 720px composition.
- The desktop hero heading is 72px/72px at weight 700.
- Main sections use 64–80px vertical padding.
- Standard cards use a 12px corner radius with a subtle border.
- Navigation buttons use a 6px radius.
- Primary hero actions use a 20px radius.
- The complete experience must adapt cleanly to desktop, tablet, and mobile breakpoints.

### Imagery

- No reference-site images are reused.
- Local neutral dummy images will occupy the same dimensions, crops, overlays, and visual planes as the reference imagery.
- The homepage placeholder must behave like the reference's soft, low-contrast, full-width hero background.
- The practitioner portrait and article imagery use consistent local placeholders.

## Information Architecture

The site will cover every route exposed by the reference navigation, homepage, and public sitemap:

- Home
- About
- Our Approach
- Why Choose Us
- Why Homeopathy
- Research
- Pricing
- Treatments index
- Skin treatment
- PCOD treatment
- Adenoid treatment
- Allergy treatment
- Hair-loss treatment
- Thyroid treatment
- Case Studies
- Patient Stories
- Patient Reviews
- Blog index
- Seven public blog article routes listed by the reference sitemap
- Locations index
- KPHB, Kukatpally, Miyapur, Madhapur, Kondapur, Gachibowli, and Moosapet location pages
- Contact
- Book Appointment
- My Journey / Account
- Privacy Policy
- Terms of Service
- Teleconsultation Policy
- Not-found page

All internal links must resolve locally. If the reference exposes an additional public route during implementation review, it will be included using the same shared templates.

## Content Adaptation

- Replace visible occurrences of the practitioner and clinic brand with **Arunima Mustyala** and **Arunima Mustyala Clinic** as grammatically appropriate.
- As requested, temporarily retain the reference site's qualifications, registration, statistics, pricing, phone number, address, treatment descriptions, and other factual details.
- Keep those values centralized in `assets/js/site-config.js` so they can be replaced safely when Arunima's verified details are available.
- Preserve the reference information hierarchy and clinical disclaimers.
- Use clean-room paraphrasing where needed instead of copying proprietary editorial text verbatim.

## Shared Components

### Header

Desktop and mobile navigation, treatments dropdown, active-route state, dark-mode control, account link, and appointment action.

### Footer

Clinic summary, quick links, service areas, contact information, newsletter form, registration statement, emergency disclaimer, and policy links.

### Page shell

Consistent metadata, skip link, header offset, content width, section rhythm, focus styles, cookie notice, floating callback action, and clinic assistant.

### Reusable content patterns

Hero sections, trust indicators, protocol/pricing blocks, process cards, biography blocks, testimonials, FAQ accordions, article grids, location panels, forms, and final calls to action.

## Interactions

- Desktop treatments dropdown and mobile navigation drawer.
- Persistent light/dark preference using `localStorage`.
- FAQ accordions with accessible expanded states.
- Cookie notice with locally persisted accept/decline state.
- Reference-style chat assistant and callback panel.
- Testimonial and article controls where present.
- Form validation and success states for appointment, contact, newsletter, and account screens.
- Phone and WhatsApp links use the retained placeholder details.

Forms are presentation-only in this phase. They must not transmit or store patient information because no backend or approved recipient has been provided.

## Accessibility and Metadata

- Semantic landmarks and heading order.
- Keyboard-operable controls and visible focus states.
- Accessible names, accordion state, menu state, and form errors.
- Reduced-motion support.
- Responsive images with meaningful alternative text identifying placeholders.
- Page-specific titles, descriptions, canonical-path placeholders, and social metadata.

## Error Handling

- Missing routes lead to a branded 404 page.
- Failed or unavailable placeholder media falls back to CSS-backed neutral surfaces.
- JavaScript-enhanced controls remain readable when JavaScript is disabled.
- Forms show inline validation errors and do not imply that data was sent.
- External actions use safe links and make their destination clear.

## Verification

- Validate every internal link and asset path.
- Check HTML semantics and required metadata.
- Test desktop, tablet, and mobile widths.
- Compare the homepage and representative inner pages against the reference for palette, typography, spacing, component geometry, and section order.
- Exercise menus, theme switching, accordions, cookie persistence, chat/callback UI, and every form state.
- Confirm there are no console errors.
- Confirm no page loads assets from `drneha.in`.

## Delivery

- Repository directory: `C:\Users\rishi\Documents\CrossPoint Holdings\arunima`
- Git remote: `https://github.com/rishi-krishna/Arunima.git`
- The implementation will be committed intentionally and pushed to the repository after verification.

