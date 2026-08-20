# Single-Page Booking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the current homepage while turning the public website into one page, removing menus and placeholder imagery, and adding the existing WhatsApp consultation form at the bottom.

**Architecture:** Keep `index.html` as the only public content page and continue using the existing custom-element shell and modular JavaScript. Simplify the shared shell to a branded header, minimal footer, and floating WhatsApp action; move the existing booking form markup into the homepage and retain the established form-to-WhatsApp behavior. Use Node's built-in test runner for structural regression checks and Playwright for rendered mobile/desktop verification.

**Tech Stack:** Static HTML5, CSS, ES modules, Web Components, Node.js built-in test runner, Python Playwright, GitHub Pages.

---

## File Structure

- Modify `index.html`: retain current homepage content, replace obsolete links, create empty media spaces, and append the booking form.
- Modify `assets/js/components.js`: reduce shared components to the single-page header, footer, and WhatsApp action.
- Modify `assets/js/interactions.js`: remove multi-page navigation, drawer, overlay, assistant, and newsletter behavior while retaining theme, FAQ, carousel, motion, and clinic-field behavior.
- Modify `assets/js/main.js`: keep initialization limited to the shared WhatsApp action, homepage interactions, and forms.
- Modify `assets/css/styles.css`: style the simplified header/footer, empty media reservations, and bottom booking section; remove obsolete menu/drawer/assistant rules when safe.
- Modify `assets/js/*.js` and `index.html`: bump the shared asset version consistently after the public changes.
- Create `tests/single-page.test.mjs`: enforce the single-page structure and required booking contract.
- Delete public page directories and unused placeholder SVG files listed in Task 6.

### Task 1: Add the single-page contract test

**Files:**
- Create: `tests/single-page.test.mjs`

- [ ] **Step 1: Create the structural regression test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const index = readFileSync(join(root, "index.html"), "utf8");
const components = readFileSync(join(root, "assets/js/components.js"), "utf8");

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if ([".git", ".superpowers", "docs", "node_modules", "tests"].includes(entry.name)) return [];
    const absolute = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(absolute) : entry.name.endsWith(".html") ? [relative(root, absolute).replaceAll("\\", "/")] : [];
  });
}

test("homepage contains the registration-free WhatsApp booking form", () => {
  assert.match(index, /id="consultation-booking"/);
  const booking = index.match(/<section[^>]+id="consultation-booking"[\s\S]*?<\/section>/)?.[0] ?? "";
  for (const name of ["appointmentType", "condition", "preferredDate", "preferredTime", "name", "note", "consent"]) {
    assert.match(index, new RegExp(`name="${name}"`));
  }
  assert.match(index, /data-static-form/);
  assert.match(index, /Continue to WhatsApp/);
  assert.doesNotMatch(booking, /register|create an account|log[ -]?in/i);
});

test("homepage has no placeholder images or obsolete page links", () => {
  assert.doesNotMatch(index, /<img[^>]+placeholder\.svg/i);
  for (const route of ["about/", "book-appointment/", "blog/", "contact/", "patient-stories/", "pricing/", "research/", "treatments/"]) {
    assert.doesNotMatch(index, new RegExp(`href=["']${route}`, "i"));
  }
});

test("shared header contains no menu or drawer", () => {
  assert.doesNotMatch(components, /mobile-toggle|mobile-drawer|primaryRoutes|treatmentRoutes|nav-menu/);
  assert.match(components, /href="#consultation-booking"/);
});

test("index is the only public content page", () => {
  const contentPages = htmlFiles(root).filter((file) => file !== "404.html").sort();
  assert.deepEqual(contentPages, ["index.html"]);
});
```

- [ ] **Step 2: Run the test and verify it fails against the current multi-page site**

Run: `node --test tests/single-page.test.mjs`

Expected: FAIL because `#consultation-booking` is absent, placeholder images and page links remain, and multiple public HTML pages exist.

- [ ] **Step 3: Commit the failing contract test**

```powershell
git add tests/single-page.test.mjs
git commit -m "test: define single-page booking contract"
```

### Task 2: Simplify the shared site shell

**Files:**
- Modify: `assets/js/components.js:1-272`
- Modify: `assets/js/interactions.js:1-305,449-467`
- Modify: `assets/js/main.js:1-24`

- [ ] **Step 1: Replace the header with single-page brand and actions**

Retain `escapeHtml()` and render this inside `SiteHeader.connectedCallback()`:

```js
this.innerHTML = `
  <header class="site-nav">
    <div class="container site-nav__inner">
      <a class="site-brand" href="#main-content" aria-label="${escapeHtml(clinic.clinicName)} home">
        <img src="/assets/images/logo-mark.svg" alt="" width="38" height="38">
        <span>${escapeHtml(clinic.practitioner)}</span>
      </a>
      <div class="site-nav__actions">
        <button class="theme-toggle" type="button" data-theme-toggle
          aria-label="Switch to dark theme" title="Switch theme">
          <span aria-hidden="true" data-theme-icon>☾</span>
        </button>
        <a class="site-nav__whatsapp" href="${clinic.whatsappHref}" target="_blank"
          rel="noopener noreferrer" aria-label="Chat with Dr. Arunima Musthyala on WhatsApp">
          WhatsApp
        </a>
        <a class="button button--primary site-nav__account" href="#consultation-booking">
          Book Consultation
        </a>
      </div>
    </div>
  </header>`;
```

Do not render a primary navigation element, treatments menu, hamburger button, or mobile drawer.

- [ ] **Step 2: Replace the footer with a minimal single-page footer**

Render only:

```js
this.innerHTML = `
  <footer class="site-footer">
    <div class="container site-footer__minimal">
      <p><strong>${escapeHtml(clinic.clinicName)}</strong></p>
      <p>This website does not provide emergency care. For a medical emergency,
        contact local emergency services or go to the nearest hospital.</p>
      <p>© ${year} ${escapeHtml(clinic.clinicName)}. All rights reserved.</p>
    </div>
  </footer>`;
```

Remove the quick links, service areas, hours, newsletter form, and legal-page links.

- [ ] **Step 3: Remove obsolete custom elements**

Delete `CallbackPanel`, `ClinicAssistant`, route arrays, `locationRoutes`, and `links()`. Define only:

```js
const componentDefinitions = [
  ["site-header", SiteHeader],
  ["site-footer", SiteFooter],
  ["whatsapp-action", WhatsAppAction],
];
```

- [ ] **Step 4: Remove multi-page-only interaction code**

In `assets/js/interactions.js`, import only `clinic`. Delete `normalizePath`, `pathWithinSite`, `activeSection`, `initActiveRoutes`, `setExpanded`, focus-trap helpers used only by removed overlays/drawers, `initNavigation`, `initOverlays`, `initAssistant`, and `initNewsletter`.

Update `initSiteInteractions()` to:

```js
export function initSiteInteractions(root = document) {
  normalizeInternalUrls(root);
  populateClinicFields(root);
  initAccordions(root);
  initReviewCarousel(root);
  initInstagramCarousel(root);
  initMotion(root);
  root.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    if (button.dataset.ready === "true") return;
    button.dataset.ready = "true";
    button.addEventListener("click", () => toggleTheme(root));
  });
  updateThemeButtons(root);
}
```

- [ ] **Step 5: Run JavaScript syntax checks**

Run:

```powershell
node --check assets/js/components.js
node --check assets/js/interactions.js
node --check assets/js/main.js
```

Expected: all commands exit with status 0 and no syntax errors.

- [ ] **Step 6: Commit the simplified shell**

```powershell
git add assets/js/components.js assets/js/interactions.js assets/js/main.js
git commit -m "refactor: simplify site shell for one page"
```

### Task 3: Preserve the homepage and make its actions single-page-safe

**Files:**
- Modify: `index.html:33-42,84-109,189-198,259-343,346-349`

- [ ] **Step 1: Point consultation buttons to the future booking section**

Change every homepage `Book Consultation` link from `href="book-appointment/"` to:

```html
href="#consultation-booking"
```

- [ ] **Step 2: Remove obsolete internal-page actions without rewriting surrounding content**

Remove only these link controls:

- `Meet Dr. Arunima` linking to `about/`;
- `Read patient stories` linking to `patient-stories/`;
- all three article `Read more` links;
- `View all articles` linking to `blog/`.

Keep the bio, patient-experience, article, FAQ, Instagram, and contact section copy and order unchanged.

- [ ] **Step 3: Remove obsolete custom-element tags**

Delete from the bottom of `index.html`:

```html
<callback-panel></callback-panel>
<clinic-assistant></clinic-assistant>
```

- [ ] **Step 4: Verify the homepage has no links to removed pages**

Run:

```powershell
rg -n 'href="(about|book-appointment|blog|contact|patient-stories|pricing|research|treatments|.*-treatment|locations)/' index.html
```

Expected: no matches.

- [ ] **Step 5: Commit homepage link cleanup**

```powershell
git add index.html
git commit -m "fix: keep homepage actions on one page"
```

### Task 4: Replace placeholder imagery with empty reserved spaces

**Files:**
- Modify: `index.html:84-89,267-293,309-320`
- Modify: `assets/css/styles.css:626,788,823-834,1611-1676`

- [ ] **Step 1: Replace the portrait image with an empty accessible reservation**

Replace the portrait `<img>` with:

```html
<div class="bio-portrait bio-portrait--empty" aria-hidden="true"></div>
```

- [ ] **Step 2: Replace article placeholder images without changing article content**

Replace each article image with:

```html
<div class="article-card__media article-card__media--empty" aria-hidden="true"></div>
```

- [ ] **Step 3: Replace Instagram images while preserving tile labels and spacing**

Use this structure for each existing tile label:

```html
<div class="instagram-tile">
  <div class="instagram-tile__media" aria-hidden="true"></div>
  <span>Clinic notes</span>
</div>
```

Repeat with the existing labels `Patient education`, `Wellness`, `Clinic update`, `Homeopathy`, and `Health tip`.

- [ ] **Step 4: Style empty reservations without adding dummy artwork**

Add:

```css
.bio-portrait--empty,
.article-card__media--empty,
.instagram-tile__media {
  background: transparent;
}

.bio-portrait--empty {
  width: 100%;
  aspect-ratio: 720 / 860;
}

.article-card__media--empty {
  width: 100%;
  aspect-ratio: 720 / 450;
}

.instagram-tile__media {
  width: 100%;
  aspect-ratio: 1;
}
```

Update image-specific hover selectors so empty elements do not scale or reveal an image treatment.

- [ ] **Step 5: Verify placeholder images are gone from the homepage**

Run: `rg -n "placeholder\.svg|<img" index.html`

Expected: no placeholder-image matches; only intentionally retained functional imagery, if any, may remain.

- [ ] **Step 6: Commit empty image reservations**

```powershell
git add index.html assets/css/styles.css
git commit -m "fix: leave placeholder media spaces empty"
```

### Task 5: Append the WhatsApp booking form to the homepage

**Files:**
- Modify: `index.html:343-346`
- Modify: `assets/css/styles.css:892-981,1087-1230,1697-1821`
- Verify: `assets/js/forms.js:1-83`

- [ ] **Step 1: Add the booking section before `</main>`**

Insert:

```html
<section class="site-section site-section--sage booking-section" id="consultation-booking"
  aria-labelledby="booking-form-title">
  <div class="container booking-section__inner">
    <form class="surface form-card" data-static-form>
      <div class="section-heading">
        <p class="eyebrow">Appointment request</p>
        <h2 id="booking-form-title">Book a Consultation</h2>
        <p>Choose what works for you. Fields marked with an asterisk are required.</p>
      </div>
      <div class="form-grid">
        <div class="field">
          <label for="appointment-type">Appointment type *</label>
          <select id="appointment-type" name="appointmentType" required>
            <option value="">Choose an option</option>
            <option>In-clinic consultation</option>
            <option>Online video consultation</option>
            <option>Follow-up consultation</option>
          </select>
        </div>
        <div class="field">
          <label for="appointment-condition">Primary concern *</label>
          <select id="appointment-condition" name="condition" required>
            <option value="">Choose a concern</option>
            <option>Skin health</option>
            <option>PCOD or fibroids</option>
            <option>Adenoids or child respiratory health</option>
            <option>Allergies</option>
            <option>Hair loss</option>
            <option>Thyroid health</option>
            <option>Another concern</option>
          </select>
        </div>
        <div class="field">
          <label for="preferred-date">Preferred date *</label>
          <input id="preferred-date" name="preferredDate" type="date" required>
        </div>
        <div class="field">
          <label for="preferred-time">Preferred time *</label>
          <select id="preferred-time" name="preferredTime" required>
            <option value="">Choose a time window</option>
            <option>10:00 AM–1:00 PM</option>
            <option>1:00 PM–4:00 PM</option>
            <option>4:00 PM–7:00 PM</option>
          </select>
        </div>
        <div class="field">
          <label for="booking-name">Full name *</label>
          <input id="booking-name" name="name" type="text" autocomplete="name" required>
        </div>
      </div>
      <div class="field">
        <label for="booking-note">Brief note (optional)</label>
        <textarea id="booking-note" name="note"
          placeholder="Do not include urgent, highly sensitive, or emergency information."></textarea>
      </div>
      <label class="consent-row">
        <input name="consent" type="checkbox" required>
        <span>I understand this is an appointment request and Dr. Arunima will confirm availability separately. *</span>
      </label>
      <button class="button button--assessment" type="submit">Continue to WhatsApp</button>
      <p class="form-status" data-form-status aria-live="polite"></p>
      <p><a class="button button--whatsapp" data-whatsapp-fallback
        href="https://wa.me/916303196195" target="_blank"
        rel="noopener noreferrer" hidden>Open WhatsApp manually</a></p>
      <p class="muted">Please do not share urgent or highly sensitive medical information through WhatsApp. This service is not monitored for emergencies.</p>
    </form>
  </div>
</section>
```

- [ ] **Step 2: Make the form a focused full-width section**

Add:

```css
.booking-section {
  scroll-margin-top: 88px;
}

.booking-section__inner {
  width: min(820px, calc(100% - 40px));
}

.booking-section .form-card {
  display: grid;
  gap: 18px;
}

.booking-section .button[type="submit"] {
  width: 100%;
}
```

At `max-width: 640px`, retain the existing one-column `.form-grid` behavior and use the existing `22px` form padding.

- [ ] **Step 3: Verify form behavior remains compatible**

Run:

```powershell
node --check assets/js/forms.js
node --test tests/single-page.test.mjs
```

Expected: the JavaScript syntax check passes. The booking-form tests pass; the page-count test may still fail until Task 6.

- [ ] **Step 4: Commit the homepage booking form**

```powershell
git add index.html assets/css/styles.css
git commit -m "feat: add consultation form to homepage"
```

### Task 6: Remove separate pages and unused placeholder assets

**Files:**
- Delete: `about/`, `adenoid-treatment/`, `allergy-treatment/`, `approach/`, `blog/`, `book-appointment/`, `case-studies/`, `contact/`, `hair-loss-treatment/`, `locations/`, `my-journey/`, `patient-reviews/`, `patient-stories/`, `pcod-treatment/`, `pricing/`, `privacy-policy/`, `research/`, `skin-treatment/`, `teleconsultation-policy/`, `terms-of-service/`, `thyroid-treatment/`, `treatments/`, `why-choose-us/`, `why-homeopathy/`
- Delete: `assets/images/portrait-placeholder.svg`
- Delete: `assets/images/article-placeholder.svg`
- Delete: `assets/images/hero-placeholder.svg`

- [ ] **Step 1: Confirm every deletion target is inside the repository**

Run:

```powershell
$repo = (Resolve-Path '.').Path
$targets = @('about','adenoid-treatment','allergy-treatment','approach','blog','book-appointment','case-studies','contact','hair-loss-treatment','locations','my-journey','patient-reviews','patient-stories','pcod-treatment','pricing','privacy-policy','research','skin-treatment','teleconsultation-policy','terms-of-service','thyroid-treatment','treatments','why-choose-us','why-homeopathy','assets/images/portrait-placeholder.svg','assets/images/article-placeholder.svg','assets/images/hero-placeholder.svg')
$targets | ForEach-Object { $resolved = (Resolve-Path -LiteralPath $_).Path; if (-not $resolved.StartsWith($repo)) { throw "Unsafe target: $resolved" }; $resolved }
```

Expected: every resolved path begins with the exact repository path.

- [ ] **Step 2: Delete only the verified targets**

Run the deletion in the same PowerShell process after the validation loop:

```powershell
$targets | ForEach-Object { Remove-Item -LiteralPath $_ -Recurse -Force }
```

- [ ] **Step 3: Run the complete structural test**

Run: `node --test tests/single-page.test.mjs`

Expected: all four tests pass.

- [ ] **Step 4: Scan for stale routes and placeholder references**

Run:

```powershell
rg -n "book-appointment/|about/|treatments/|research/|pricing/|blog/|patient-stories/|contact/|placeholder\.svg|mobile-drawer|mobile-toggle" index.html assets
```

Expected: no stale public references. Any CSS-only selector found must be removed before continuing.

- [ ] **Step 5: Commit page and placeholder removal**

```powershell
git add -A
git commit -m "refactor: remove separate public pages"
```

### Task 7: Remove obsolete styles and bump asset versions

**Files:**
- Modify: `assets/css/styles.css`
- Modify: `assets/js/main.js`
- Modify: `assets/js/components.js`
- Modify: `assets/js/interactions.js`
- Modify: `assets/js/forms.js`
- Modify: `index.html:10-11`

- [ ] **Step 1: Delete styles that are now unreferenced**

Remove CSS blocks for `.site-nav__links`, `.site-nav__link`, `.nav-menu`, `.mobile-toggle`, `.mobile-drawer`, `.overlay`, `.floating-action`, and `.assistant-card`. Retain `.site-nav`, `.site-brand`, `.site-nav__actions`, `.theme-toggle`, `.site-nav__whatsapp`, `.site-footer`, `.site-footer__minimal`, form rules, and `.whatsapp-action`.

- [ ] **Step 2: Add responsive header and footer rules**

```css
.site-nav__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.site-footer__minimal {
  display: grid;
  max-width: 760px;
  gap: 10px;
  padding-block: 40px;
  text-align: center;
}

@media (max-width: 640px) {
  .site-nav__whatsapp,
  .site-nav__account {
    display: none;
  }
}
```

- [ ] **Step 3: Bump the cache version consistently**

Replace `20260820b` with `20260820c` in `index.html` and every import URL in `assets/js/*.js`. Do not alter the WhatsApp number or profile data.

- [ ] **Step 4: Run static verification**

```powershell
node --check assets/js/main.js
node --check assets/js/components.js
node --check assets/js/interactions.js
node --check assets/js/forms.js
node --check assets/js/site-config.js
node --test tests/single-page.test.mjs
git diff --check
```

Expected: syntax checks and all tests pass; `git diff --check` reports no whitespace errors.

- [ ] **Step 5: Commit final cleanup**

```powershell
git add index.html assets/css/styles.css assets/js
git commit -m "chore: finalize single-page assets"
```

### Task 8: Rendered browser verification and deployment

**Files:**
- Create temporarily outside tracked source: a Playwright verification script and screenshots
- Verify: `index.html`, responsive styles, booking behavior, console output

- [ ] **Step 1: Start the static site locally**

Run: `python -m http.server 4173`

Expected: server listens on `http://localhost:4173/`.

- [ ] **Step 2: Run a Playwright verification at desktop and mobile sizes**

The temporary script must:

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for width, height, name in [(1440, 1000, "desktop"), (390, 844, "mobile")]:
        page = browser.new_page(viewport={"width": width, "height": height})
        errors = []
        page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
        page.goto("http://localhost:4173/", wait_until="networkidle")
        assert page.locator("#consultation-booking").count() == 1
        assert page.locator("[data-mobile-toggle], [data-mobile-drawer]").count() == 0
        assert page.locator('img[src*="placeholder"]').count() == 0
        page.locator('a[href="#consultation-booking"]').first.click()
        page.locator("#consultation-booking").wait_for(state="visible")
        assert errors == []
        page.screenshot(path=f"single-page-{name}.png", full_page=True)
        page.close()
    browser.close()
```

Expected: both viewports pass, scroll to the booking form, render no menu or placeholder images, and produce no console errors.

- [ ] **Step 3: Test invalid and valid booking submissions**

In the same browser run:

- submit the empty form and confirm the browser blocks it;
- fill every required field and consent;
- intercept `window.open` or listen for the popup;
- assert the resulting URL begins with `https://wa.me/916303196195?text=` and includes the entered name, appointment type, concern, date, and time.

Expected: invalid submission stays on the form; valid submission prepares the correct WhatsApp request.

- [ ] **Step 4: Inspect screenshots for empty-space and responsive quality**

Confirm the preserved portrait, article, and Instagram media areas are empty; the form is readable; no content overlaps the floating WhatsApp action; dark theme and reduced-motion behavior remain usable.

- [ ] **Step 5: Push and verify GitHub Pages**

```powershell
git status --short
git push origin main
```

Expected: the working tree is clean before push and `main` advances successfully. After deployment, request `https://rishi-krishna.github.io/Arunima/?v=<commit>` and verify the booking anchor, absence of menus/placeholders, correct WhatsApp number, and latest asset version.
