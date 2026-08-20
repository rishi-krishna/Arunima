# Single-Page Booking Design

## Goal

Convert Dr. Arunima Musthyala's website into a single-page experience without redesigning or rewriting the current homepage. Remove the navigation menu and separate content pages, remove placeholder imagery while preserving its layout space, and place the existing consultation request form at the bottom of the homepage.

## Guiding Constraints

- Keep the current homepage sections, visual system, animations, and wording unchanged except where links or placeholder images must be adjusted for the single-page structure.
- Use only HTML, CSS, and JavaScript already present in the repository.
- Do not require patient registration, login, or an account.
- Continue using WhatsApp number `+91 63031 96195` for consultation requests.
- Do not add addresses, email addresses, hospital names, ratings, patient counts, or removed credentials.

## Page Structure

The public site will contain one content page: `index.html`.

The existing homepage sections remain in their current order. A consultation request section will be appended near the bottom of the homepage, before the minimal footer. The section will reuse the current booking form rather than introduce service cards or a registration flow.

The booking section will contain:

- appointment type;
- primary concern;
- preferred date;
- preferred time window;
- full name;
- optional brief note;
- confirmation consent;
- a “Continue to WhatsApp” submit button;
- a short non-emergency and appointment-confirmation notice.

Submitting the form will validate required fields, prepare the existing WhatsApp message, and open WhatsApp for the patient to send it. Submission does not itself confirm an appointment.

## Header and Navigation

The header will retain:

- the botanical logo;
- `Dr. Arunima Musthyala` branding;
- the theme control;
- a direct WhatsApp control if it fits the existing responsive header.

The desktop page menu, mobile hamburger button, mobile drawer, treatment submenu, and all links to removed internal pages will be removed.

Existing homepage booking buttons will become in-page links to the new booking section. Existing WhatsApp buttons will continue opening Dr. Arunima's WhatsApp number.

## Placeholder Images

All dummy or placeholder image elements on the homepage will be removed. Their existing layout containers and allocated space will remain empty so a final photograph or artwork can be inserted later without changing the page composition.

This applies to the practitioner portrait, article-card placeholder media, and Instagram placeholder media. Empty spaces will be non-interactive, have no misleading alternative text, and remain visually quiet in light and dark themes.

## Existing Homepage Content

Homepage headings, descriptive paragraphs, credentials, registration information, FAQ content, and existing section order remain unchanged.

Where homepage content currently links to a page that will be removed, the visible content remains but the obsolete internal link is removed or converted to a non-navigation element. No replacement copy or new treatment content will be introduced.

## Separate Pages

Separate public HTML pages and their page-specific content will be removed, including About, Treatments and treatment-detail pages, Research, Pricing, Blog and article pages, Patient Stories, Contact, Locations, and the standalone booking page.

Shared assets required by the homepage—CSS, JavaScript, logo files, fonts, and functional icons—will remain. Repository documentation is not public site content and will remain.

## Footer and Floating Controls

The footer will be reduced to a minimal single-page footer containing only the doctor name, a short non-emergency notice if already required, and the copyright line. Links to deleted pages, newsletter fields, locations, address, email, phone display, and treatment navigation will not appear.

The existing WhatsApp floating action remains. Callback or assistant controls that link to removed pages will either scroll to the booking section or be removed if they duplicate the booking and WhatsApp actions.

## Accessibility and Responsive Behavior

- The booking section will have a unique heading and anchor target.
- All form fields will retain visible labels, required-state semantics, and keyboard support.
- Validation and form status messages will remain available to assistive technology.
- Empty image spaces will be hidden from assistive technology.
- Mobile layout will use one form column; wider screens may use two columns where the existing design already supports it.
- Removed navigation controls will not leave unreachable focus targets or unused ARIA relationships.

## Error Handling

- Required fields prevent submission until completed.
- A missing WhatsApp popup exposes the existing manual WhatsApp fallback link.
- The form states that the request is not a confirmed appointment.
- Emergency guidance remains visible and directs patients to appropriate local emergency care.

## Verification

Implementation is complete when:

1. The homepage's existing copy, section order, styling, and animations are preserved.
2. No desktop menu, hamburger button, mobile drawer, or removed-page link is rendered.
3. No public content page other than the homepage remains.
4. Placeholder images are absent while their reserved layout spaces remain.
5. The booking form appears near the bottom of the homepage and works without registration.
6. A valid submission prepares and opens a WhatsApp request to `+91 63031 96195`.
7. Required-field validation, keyboard navigation, mobile layout, theme behavior, and console output are verified locally.
8. The deployed GitHub Pages homepage reflects the same behavior.
