# Personal Doctor Booking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the static site as Dr. Arunima Mustyala’s personal practice and make consultation requests work through a pre-filled WhatsApp message to `+91 99999 99999`.

**Architecture:** Retain the existing vanilla HTML/CSS/JavaScript structure and shared Web Components. Centralize the WhatsApp base URL in `site-config.js`, generate booking messages in `forms.js`, and reuse shared components for persistent site-wide actions.

**Tech Stack:** HTML5, CSS3, native ES modules, Web Components, browser-native form validation, GitHub Pages.

---

## File Map

- `assets/js/site-config.js`: canonical personal-practice identity and WhatsApp URLs.
- `assets/js/forms.js`: validation, WhatsApp booking-message generation, and form submission behavior.
- `assets/js/components.js`: shared header, mobile navigation, footer, assistant, callback panel, and floating WhatsApp control.
- `assets/css/styles.css`: CTA hierarchy, WhatsApp focus/hover states, booking form polish, and responsive behavior.
- `index.html`: homepage personal-brand language and paired consultation/WhatsApp CTAs.
- `book-appointment/index.html`: simplified consultation-request form and accurate WhatsApp disclosure.
- All `*.html`: versioned CSS/JavaScript references for GitHub Pages cache invalidation.

### Task 1: Centralize the WhatsApp Booking Destination

**Files:**
- Modify: `assets/js/site-config.js`
- Test: command-line ES module assertion

- [ ] **Step 1: Add a failing configuration assertion**

Run:

```powershell
node --input-type=module -e "import('./assets/js/site-config.js').then(({clinic}) => { if (clinic.whatsappBaseHref !== 'https://wa.me/919999999999') throw new Error('missing WhatsApp base URL') })"
```

Expected: FAIL with `missing WhatsApp base URL`.

- [ ] **Step 2: Add the canonical WhatsApp base URL**

Add to the `clinic` object:

```js
practitioner: "Dr. Arunima Mustyala",
clinicName: "Dr. Arunima Mustyala",
whatsappNumber: "+91 99999 99999",
whatsappBaseHref: "https://wa.me/919999999999",
whatsappHref:
  "https://wa.me/919999999999?text=Hello%20Dr.%20Arunima%20Mustyala%2C%20I%20would%20like%20to%20know%20more%20about%20a%20consultation.",
```

- [ ] **Step 3: Run the assertion**

Run the Step 1 command again.

Expected: exit code 0 with no output.

- [ ] **Step 4: Commit the configuration**

```powershell
git add assets/js/site-config.js
git commit -m "feat: centralize Arunima WhatsApp booking URL"
```

### Task 2: Convert the Appointment Form into a WhatsApp Request

**Files:**
- Modify: `assets/js/forms.js`
- Modify: `book-appointment/index.html`
- Test: command-line ES module assertions and browser form submission

- [ ] **Step 1: Add failing booking URL assertions**

Run:

```powershell
node --input-type=module -e "import('./assets/js/forms.js').then(({buildWhatsAppBookingUrl}) => { const url = buildWhatsAppBookingUrl({name:'Rishi',appointmentType:'Online video consultation',condition:'Allergies',preferredDate:'2026-08-10',preferredTime:'4:00 PM–7:00 PM',note:'First consultation'}); if (!url.startsWith('https://wa.me/919999999999?text=')) throw new Error('wrong destination'); const text=decodeURIComponent(url.split('?text=')[1]); for (const expected of ['Rishi','Online video consultation','Allergies','2026-08-10','4:00 PM–7:00 PM','First consultation']) if (!text.includes(expected)) throw new Error('missing '+expected); })"
```

Expected: FAIL because `buildWhatsAppBookingUrl` is not exported.

- [ ] **Step 2: Implement message construction**

In `assets/js/forms.js`, import the configuration and add:

```js
import { clinic } from "./site-config.js?v=20260730c";

export function buildWhatsAppBookingUrl(values) {
  const lines = [
    "Hello Dr. Arunima Mustyala, I would like to request a consultation.",
    "",
    `Name: ${values.name}`,
    `Consultation: ${values.appointmentType}`,
    `Primary concern: ${values.condition}`,
    `Preferred date: ${values.preferredDate}`,
    `Preferred time: ${values.preferredTime}`,
  ];

  if (values.note) lines.push(`Brief note: ${values.note}`);
  lines.push(
    "",
    "Please confirm availability. I understand this request is not confirmed and WhatsApp is not an emergency service.",
  );

  return `${clinic.whatsappBaseHref}?text=${encodeURIComponent(lines.join("\n"))}`;
}
```

- [ ] **Step 3: Implement WhatsApp form submission**

Inside the existing valid-submit branch:

```js
const values = Object.fromEntries(new FormData(form).entries());
const bookingUrl = buildWhatsAppBookingUrl(values);
const fallback = form.querySelector("[data-whatsapp-fallback]");

if (fallback) {
  fallback.href = bookingUrl;
  fallback.hidden = false;
}
if (status) {
  status.textContent =
    "Your request is ready. Continue in WhatsApp to send it to Dr. Arunima.";
}
window.open(bookingUrl, "_blank", "noopener,noreferrer");
```

Do not reset the form automatically, so patients can return and correct their details.

- [ ] **Step 4: Simplify and correct the booking page**

Update the booking page to:

- identify the practice as Dr. Arunima’s personal practice;
- remove patient email, mobile-number, and confirmation-method fields because the WhatsApp conversation supplies the response channel;
- replace the demo-only consent with:

```html
<label class="consent-row">
  <input name="consent" type="checkbox" required>
  <span>I understand this is an appointment request and Dr. Arunima will confirm availability separately. *</span>
</label>
```

- replace the demo button/status/fine print with:

```html
<button class="button button--assessment" type="submit">Continue to WhatsApp</button>
<p class="form-status" data-form-status aria-live="polite"></p>
<p>
  <a class="button button--whatsapp" data-whatsapp-fallback
    href="https://wa.me/919999999999" target="_blank"
    rel="noopener noreferrer" hidden>Open WhatsApp manually</a>
</p>
<p class="muted">Please do not share urgent or highly sensitive medical information through WhatsApp. This service is not monitored for emergencies.</p>
```

- replace the sidebar’s “Contact information” block with a direct WhatsApp consultation button and confirmation disclaimer.

- [ ] **Step 5: Run form assertions and syntax checks**

Run:

```powershell
node --check assets/js/forms.js
node --input-type=module -e "import('./assets/js/forms.js').then(({buildWhatsAppBookingUrl}) => { const url = buildWhatsAppBookingUrl({name:'Rishi',appointmentType:'Online video consultation',condition:'Allergies',preferredDate:'2026-08-10',preferredTime:'4:00 PM–7:00 PM',note:'First consultation'}); const text=decodeURIComponent(url.split('?text=')[1]); if (!url.startsWith('https://wa.me/919999999999?text=')) throw new Error('wrong destination'); for (const expected of ['Rishi','Online video consultation','Allergies','2026-08-10','4:00 PM–7:00 PM','First consultation']) if (!text.includes(expected)) throw new Error('missing '+expected); })"
```

Expected: both commands exit 0.

- [ ] **Step 6: Commit functional booking**

```powershell
git add assets/js/forms.js book-appointment/index.html
git commit -m "feat: send consultation requests through WhatsApp"
```

### Task 3: Polish the Personal Brand and Shared Actions

**Files:**
- Modify: `assets/js/components.js`
- Modify: `assets/css/styles.css`
- Modify: `index.html`
- Test: browser interaction checks

- [ ] **Step 1: Update shared personal-practice components**

In `components.js`:

- display `Dr. Arunima Mustyala` in the brand and footer;
- rename all shared `Book Appointment`/`Book an assessment` labels to `Book Consultation`;
- add a compact header WhatsApp link before the booking button:

```html
<a class="site-nav__whatsapp" href="${clinic.whatsappHref}" target="_blank"
  rel="noopener noreferrer" aria-label="Chat with Dr. Arunima Mustyala on WhatsApp">
  WhatsApp
</a>
```

- add the same labeled WhatsApp link to the mobile drawer;
- update the callback and assistant copy so they describe real consultation requests rather than a demonstration;
- keep the persistent `<whatsapp-action>` control and update its accessible label to include `Dr. Arunima`.

- [ ] **Step 2: Update the homepage’s personal positioning**

Change the title, meta description, hero credentials, process references, and consultation-area copy to use `Dr. Arunima Mustyala`. Replace visible personal-brand references across the remaining HTML pages while leaving URLs, file paths, registration details, and treatment content unchanged.

Replace the hero secondary “Contact details” button with:

```html
<a class="button button--whatsapp button--hero"
  href="https://wa.me/919999999999?text=Hello%20Dr.%20Arunima%20Mustyala%2C%20I%20would%20like%20to%20know%20more%20about%20a%20consultation."
  target="_blank" rel="noopener noreferrer">
  WhatsApp Dr. Arunima
</a>
```

Keep the primary hero action linked to `book-appointment/` and label it `Book Consultation`.

- [ ] **Step 3: Add restrained CTA and form styling**

Add:

```css
.button--whatsapp,
.site-nav__whatsapp {
  border-color: #1fa955;
  background: #25d366;
  color: #082713;
}

.button--whatsapp:hover,
.site-nav__whatsapp:hover,
.whatsapp-action:hover {
  background: #20c45e;
  box-shadow: 0 14px 34px rgb(18 124 59 / .24);
}

.button:focus-visible,
.site-nav__whatsapp:focus-visible,
.whatsapp-action:focus-visible {
  outline: 3px solid color-mix(in srgb, #25d366 55%, white);
  outline-offset: 3px;
}

.consent-row {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: 12px;
}

.booking-aside__action {
  display: grid;
  gap: 12px;
}
```

At the existing mobile breakpoint, hide the desktop header WhatsApp label if navigation space becomes constrained. Preserve the floating control as a circular icon on mobile.

- [ ] **Step 4: Run syntax and static-copy checks**

Run:

```powershell
node --check assets/js/components.js
rg -n "Demo complete|demonstration form|does not send|Contact details|Book Appointment" index.html book-appointment/index.html assets/js/components.js
rg -n "wa.me/919999999999" index.html book-appointment/index.html assets/js/components.js assets/js/site-config.js
```

Expected: the first search has no results; the WhatsApp search finds all intended entry points.

- [ ] **Step 5: Commit personal-brand polish**

```powershell
git add assets/js/components.js assets/css/styles.css index.html
git commit -m "feat: polish Arunima personal practice actions"
```

### Task 4: Version Assets and Verify End to End

**Files:**
- Modify: all HTML files referencing `assets/css/styles.css?v=20260730b` or `assets/js/main.js?v=20260730b`
- Modify: `assets/js/main.js`
- Modify: `assets/js/components.js`
- Modify: `assets/js/interactions.js`
- Test: local and deployed browser checks

- [ ] **Step 1: Update module and page asset versions**

Change page references to:

```html
<link rel="stylesheet" href="assets/css/styles.css?v=20260730c">
<script type="module" src="assets/js/main.js?v=20260730c"></script>
```

Change internal module imports to use `?v=20260730c` for `site-config.js`, `components.js`, and `interactions.js`.

- [ ] **Step 2: Run repository-wide static checks**

Run:

```powershell
node --check assets/js/site-config.js
node --check assets/js/components.js
node --check assets/js/forms.js
node --check assets/js/interactions.js
node --check assets/js/main.js
git diff --check
rg -n "styles.css\\?v=20260730b|main.js\\?v=20260730b" -g "*.html"
```

Expected: all syntax checks pass, `git diff --check` reports no errors, and the old-version search returns no matches.

- [ ] **Step 3: Run local browser verification**

Against `http://localhost:4173/`:

- confirm the homepage exposes at least three correct `wa.me/919999999999` links;
- confirm the floating WhatsApp control exists on homepage, booking, about, treatment, location, and blog pages;
- confirm header/mobile booking actions link to `/book-appointment/`;
- submit an incomplete booking form and observe native validation;
- submit a complete booking form while intercepting `window.open`, then assert the decoded message contains the entered values;
- exercise protocol tabs, FAQ accordion, review filter/controls, Instagram controls, mobile menu, and reduced-motion rendering;
- verify all images have `complete === true` and `naturalWidth > 0`;
- verify there are no page-level console errors or missing internal ARIA targets;
- capture desktop and mobile screenshots for visual inspection.

- [ ] **Step 4: Commit the verified cache version**

```powershell
git add -A
git commit -m "fix: refresh personal booking assets on Pages"
```

- [ ] **Step 5: Push and verify GitHub Pages**

```powershell
git push origin main
```

Open `https://rishi-krishna.github.io/Arunima/?v=<commit>` and verify:

- page height and styling match the local build;
- the CSS and main module URLs contain `v=20260730c`;
- the persistent WhatsApp control exists;
- WhatsApp links point to `https://wa.me/919999999999`;
- the booking form generates the same encoded WhatsApp request as the local build.
