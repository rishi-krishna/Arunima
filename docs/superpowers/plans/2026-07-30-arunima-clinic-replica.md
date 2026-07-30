# Arunima Clinic Replica Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify a complete static multi-page recreation of the Dr. Neha clinic site, branded as Arunima Mustyala and using only local placeholder images.

**Architecture:** Every public route is a real HTML document with semantic page-specific content. Shared custom elements render the header, footer, cookie notice, callback control, and clinic assistant; shared CSS and small JavaScript modules provide the measured visual system and interactions without a framework or build step.

**Tech Stack:** HTML5, CSS3, ES modules, Web Components, Node.js built-in test runner, Python static server, Playwright-based browser verification.

---

## File Map

```text
arunima/
├── index.html
├── 404.html
├── about/index.html
├── adenoid-treatment/index.html
├── allergy-treatment/index.html
├── approach/index.html
├── blog/
│   ├── index.html
│   ├── best-homeopathy-clinic-kukatpally-kphb-hyderabad-guide/index.html
│   ├── homeopathy-for-allergic-rhinitis/index.html
│   ├── how-to-boost-your-immunity-naturally/index.html
│   ├── managing-eczema-in-children-with-homeopathy/index.html
│   ├── menopause-homeopathic-treatment-clinical-study/index.html
│   ├── truth-about-steroids-in-skin-treatment/index.html
│   └── understanding-pcos-and-homeopathy/index.html
├── book-appointment/index.html
├── case-studies/index.html
├── contact/index.html
├── hair-loss-treatment/index.html
├── locations/
│   ├── index.html
│   ├── gachibowli/index.html
│   ├── kondapur/index.html
│   ├── kphb/index.html
│   ├── kukatpally/index.html
│   ├── madhapur/index.html
│   ├── miyapur/index.html
│   └── moosapet/index.html
├── my-journey/index.html
├── patient-reviews/index.html
├── patient-stories/index.html
├── pcod-treatment/index.html
├── pricing/index.html
├── privacy-policy/index.html
├── research/index.html
├── skin-treatment/index.html
├── teleconsultation-policy/index.html
├── terms-of-service/index.html
├── thyroid-treatment/index.html
├── treatments/index.html
├── why-choose-us/index.html
├── why-homeopathy/index.html
├── assets/
│   ├── css/styles.css
│   ├── images/article-placeholder.svg
│   ├── images/hero-placeholder.svg
│   ├── images/logo-mark.svg
│   └── images/portrait-placeholder.svg
│   └── js/
│       ├── components.js
│       ├── forms.js
│       ├── interactions.js
│       ├── main.js
│       └── site-config.js
├── scripts/verify-site.mjs
├── tests/forms.test.mjs
├── tests/routes.test.mjs
├── tests/site-config.test.mjs
├── .gitignore
└── README.md
```

### Task 1: Establish the static-site contract

**Files:**
- Create: `.gitignore`
- Create: `assets/js/site-config.js`
- Create: `tests/site-config.test.mjs`
- Create: `tests/routes.test.mjs`

- [ ] **Step 1: Write the configuration test**

```js
// tests/site-config.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { clinic } from "../assets/js/site-config.js";

test("Arunima identity is centralized", () => {
  assert.equal(clinic.practitioner, "Arunima Mustyala");
  assert.equal(clinic.clinicName, "Arunima Mustyala Clinic");
  assert.equal(clinic.registration, "PR-3641/H/2025");
  assert.equal(clinic.phoneDisplay, "+91 90665 62562");
  assert.equal(clinic.phoneHref, "tel:+919066562562");
});
```

- [ ] **Step 2: Run the configuration test and verify failure**

Run: `node --test tests/site-config.test.mjs`

Expected: FAIL because `assets/js/site-config.js` does not exist.

- [ ] **Step 3: Implement the centralized identity**

```js
// assets/js/site-config.js
export const clinic = Object.freeze({
  practitioner: "Arunima Mustyala",
  clinicName: "Arunima Mustyala Clinic",
  credentials: "BHMS | PG Hom (London) | Fellowship (Germany)",
  registration: "PR-3641/H/2025",
  board: "Telangana Board",
  experience: "15+ Years Experience",
  patientCount: "5,000+",
  rating: "4.9",
  reviewCount: "600+",
  phoneDisplay: "+91 90665 62562",
  phoneHref: "tel:+919066562562",
  whatsappHref: "https://wa.me/919066562562",
  email: "drnehasclinic@gmail.com",
  address:
    "Shop No. 401, Ganesh Plaza, JNTU Hitech City Road, KPHB, Kukatpally, Hyderabad - 500085",
  assessmentPrice: "₹999",
});
```

- [ ] **Step 4: Add repository exclusions**

```gitignore
.DS_Store
Thumbs.db
node_modules/
.superpowers/
coverage/
```

- [ ] **Step 5: Run the test and commit**

Run: `node --test tests/site-config.test.mjs`

Expected: PASS.

```powershell
git add .gitignore assets/js/site-config.js tests/site-config.test.mjs
git commit -m "chore: establish static site configuration"
```

### Task 2: Implement the measured visual system and local imagery

**Files:**
- Create: `assets/css/styles.css`
- Create: `assets/images/logo-mark.svg`
- Create: `assets/images/hero-placeholder.svg`
- Create: `assets/images/portrait-placeholder.svg`
- Create: `assets/images/article-placeholder.svg`
- Create: `index.html`

- [ ] **Step 1: Create the local placeholder artwork**

Create SVGs with these explicit roles:

```svg
<!-- assets/images/hero-placeholder.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 820" role="img" aria-labelledby="title desc">
  <title id="title">Temporary healing-care background</title>
  <desc id="desc">Soft neutral abstract shapes used until Arunima supplies a hero photograph.</desc>
  <defs>
    <radialGradient id="a"><stop stop-color="#fafafa"/><stop offset="1" stop-color="#d6e1d6"/></radialGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="34"/></filter>
  </defs>
  <rect width="1600" height="820" fill="url(#a)"/>
  <ellipse cx="460" cy="630" rx="620" ry="190" fill="#ecd5c9" opacity=".72" filter="url(#blur)"/>
  <ellipse cx="1220" cy="260" rx="380" ry="260" fill="#d6e1d6" opacity=".76" filter="url(#blur)"/>
</svg>
```

Use the same neutral palette in the other three SVGs, with `logo-mark.svg` containing only an original green botanical line mark and the portrait/article files containing clearly labeled dummy silhouettes.

- [ ] **Step 2: Implement the CSS tokens and measured shell**

```css
/* assets/css/styles.css */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

:root {
  --background: #fafafa;
  --foreground: #111827;
  --primary: #176d37;
  --primary-foreground: #fafafa;
  --hero-cta: #22c35d;
  --muted: #d6e1d6;
  --muted-foreground: #6b7280;
  --card: #f5f5f5;
  --border: #d6d9dc;
  --radius-card: 12px;
  --radius-control: 6px;
  --radius-hero-action: 20px;
  --container: 1216px;
  color-scheme: light;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--background);
  color: var(--foreground);
  font: 400 16px/1.5 Inter, sans-serif;
}
.container { width: min(var(--container), calc(100% - 40px)); margin-inline: auto; }
.site-section { padding-block: 64px; }
.site-section--sage { background: color-mix(in srgb, var(--muted) 30%, transparent); }
.surface {
  background: var(--card);
  border: 1px solid #dee0e3;
  border-radius: var(--radius-card);
}
.hero {
  min-height: 720px;
  display: grid;
  place-items: center;
  text-align: center;
  background: linear-gradient(#fafafa22, #fafafa22), url("../images/hero-placeholder.svg") center/cover;
}
.hero h1 { margin: 0 0 12px; font-size: clamp(44px, 5vw, 72px); line-height: 1; }
.button { min-height: 44px; border-radius: var(--radius-control); }
.button--hero { min-height: 61px; border-radius: var(--radius-hero-action); }
.button--primary { background: var(--primary); color: var(--primary-foreground); }
.button--assessment { background: var(--hero-cta); color: var(--primary-foreground); }
@media (max-width: 767px) {
  .container { width: min(100% - 28px, var(--container)); }
  .hero { min-height: calc(100svh - 65px); }
  .site-section { padding-block: 48px; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; }
}
```

Extend the same file with exact styles for sticky navigation, pills, grids, process cards, protocols, biography, reviews, FAQs, articles, forms, footer, dark mode, mobile drawer, cookie notice, callback panel, and clinic assistant. Keep all component values derived from the approved tokens.

- [ ] **Step 3: Create a minimal homepage shell**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="Personalized homeopathic care with Arunima Mustyala in Hyderabad.">
  <title>Arunima Mustyala Clinic | Homeopathy in Hyderabad</title>
  <link rel="stylesheet" href="/assets/css/styles.css">
  <script type="module" src="/assets/js/main.js"></script>
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <site-header></site-header>
  <main id="main-content">
    <section class="hero" aria-labelledby="hero-title">
      <div class="container hero__content">
        <h1 id="hero-title">Stop Managing. Start Healing.</h1>
        <p class="hero__credentials"><strong>Arunima Mustyala</strong> — BHMS | PG Hom (London) | Fellowship (Germany)</p>
      </div>
    </section>
  </main>
  <site-footer></site-footer>
</body>
</html>
```

- [ ] **Step 4: Serve and visually inspect the shell**

Run: `python -m http.server 4173`

Expected: `http://localhost:4173/` loads without missing CSS or image requests and matches the approved palette, centered hero, and typography.

- [ ] **Step 5: Commit**

```powershell
git add assets/css/styles.css assets/images index.html
git commit -m "feat: add measured visual system and placeholder art"
```

### Task 3: Build shared site components and interactions

**Files:**
- Create: `assets/js/components.js`
- Create: `assets/js/interactions.js`
- Create: `assets/js/main.js`

- [ ] **Step 1: Implement shared custom elements**

`components.js` must define `site-header`, `site-footer`, `cookie-notice`, `callback-panel`, and `clinic-assistant`. Build all content from `clinic` in `site-config.js`. The header route list is:

```js
const primaryRoutes = [
  ["/", "Home"],
  ["/about/", "About"],
  ["/treatments/", "Treatments"],
  ["/research/", "Research"],
  ["/pricing/", "Pricing"],
  ["/blog/", "Blog"],
  ["/patient-stories/", "Patient Stories"],
  ["/contact/", "Contact"],
];
```

The treatments dropdown must include Skin, PCOD/Fibroids, Adenoids, Allergies, Hair Loss, and Thyroid routes. The footer must include quick links, location links, retained contact details, operating hours, newsletter UI, registration statement, emergency disclaimer, and policy links.

- [ ] **Step 2: Implement accessible behavior**

```js
// assets/js/interactions.js
const storage = {
  get(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch {}
  },
};

export function initTheme() {
  const saved = storage.get("arunima-theme");
  document.documentElement.dataset.theme =
    saved ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}

export function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  storage.set("arunima-theme", next);
}

export function initAccordions(root = document) {
  root.querySelectorAll("[data-accordion-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!expanded));
      document.getElementById(trigger.getAttribute("aria-controls")).hidden = expanded;
    });
  });
}
```

Also implement focus-trapped mobile navigation, Escape-to-close behavior, cookie persistence, callback and assistant open/close state, and active-route highlighting.

- [ ] **Step 3: Wire startup**

```js
// assets/js/main.js
import "./components.js";
import { initAccordions, initTheme } from "./interactions.js";

initTheme();
window.addEventListener("DOMContentLoaded", () => initAccordions());
```

- [ ] **Step 4: Verify component behavior**

Run: `python -m http.server 4173`

Expected: desktop and mobile menus open and close, Escape closes overlays, theme persists after reload, cookie choice persists, and no browser console errors appear.

- [ ] **Step 5: Commit**

```powershell
git add assets/js/components.js assets/js/interactions.js assets/js/main.js
git commit -m "feat: add shared navigation and clinic interactions"
```

### Task 4: Complete the homepage

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add homepage sections in reference order**

Add:

1. 720px full-background hero with credentials, registration, introduction, trust pills, four treatment pills, assessment CTA, WhatsApp CTA, phone, and service locations.
2. Sage assessment-to-program section with three process cards.
3. Protocol overview and full DermaCare, FibroCare, and AdenoidCare pricing/content blocks.
4. Arunima biography section with dummy portrait, statistics, qualifications, specializations, membership, achievements, quotation, and CTAs.
5. Patient experience/review section.
6. Categorized FAQ section with accessible accordions.
7. Three-article health insights section.
8. Instagram placeholder gallery.
9. Preferred WhatsApp/contact section.

Use the exact approved section backgrounds, widths, card radii, and text hierarchy. All repeated identity values must use `data-clinic-field` hooks populated from `site-config.js`.

- [ ] **Step 2: Verify semantic structure**

Run:

```powershell
node -e "const s=require('fs').readFileSync('index.html','utf8'); for (const x of ['<h1','<h2','site-header','site-footer','cookie-notice','clinic-assistant']) if(!s.includes(x)) throw Error(x)"
```

Expected: command exits with code 0.

- [ ] **Step 3: Compare at three breakpoints**

Run: `python -m http.server 4173`

Inspect at 1440 × 900, 768 × 1024, and 390 × 844.

Expected: first viewport preserves reference hierarchy; no horizontal scrolling; touch targets are at least 44px; cards stack without clipping.

- [ ] **Step 4: Commit**

```powershell
git add index.html
git commit -m "feat: recreate complete Arunima homepage"
```

### Task 5: Add treatments, evidence, pricing, and practitioner pages

**Files:**
- Create: `about/index.html`
- Create: `approach/index.html`
- Create: `case-studies/index.html`
- Create: `patient-reviews/index.html`
- Create: `patient-stories/index.html`
- Create: `pricing/index.html`
- Create: `research/index.html`
- Create: `treatments/index.html`
- Create: `why-choose-us/index.html`
- Create: `why-homeopathy/index.html`
- Create: `skin-treatment/index.html`
- Create: `pcod-treatment/index.html`
- Create: `adenoid-treatment/index.html`
- Create: `allergy-treatment/index.html`
- Create: `hair-loss-treatment/index.html`
- Create: `thyroid-treatment/index.html`

- [ ] **Step 1: Create the common inner-page document contract**

Each file must use this complete shell, shown with the About route's concrete content; substitute the matching title, summary, and semantic sections from the approved route list when creating each other document:

```html
<a class="skip-link" href="#main-content">Skip to main content</a>
<site-header></site-header>
<main id="main-content">
  <header class="page-hero">
    <div class="container">
      <p class="eyebrow">Arunima Mustyala Clinic</p>
      <h1>About Arunima Mustyala</h1>
      <p class="page-hero__summary">Personalized homeopathic care grounded in detailed assessment, structured programs, and measurable follow-up.</p>
    </div>
  </header>
  <section class="site-section">
    <div class="container prose">
      <h2>A consultation designed around the complete case</h2>
      <p>Learn about Arunima's retained qualifications, clinical approach, areas of focus, memberships, and the milestones used to review progress.</p>
    </div>
  </section>
</main>
<site-footer></site-footer>
<cookie-notice></cookie-notice>
<callback-panel></callback-panel>
<clinic-assistant></clinic-assistant>
```

Use root-absolute shared asset paths so nested routes behave consistently.

- [ ] **Step 2: Implement treatment route content**

Each treatment detail page must include condition overview, symptoms/concerns, assessment approach, program timeline, measurable outcomes, inclusions, pricing or assessment CTA, FAQs, and safety/referral language. Use the matching reference protocol names and retained values while changing the practitioner name.

- [ ] **Step 3: Implement evidence and trust routes**

The About, Approach, Why Choose Us, Why Homeopathy, Research, Case Studies, Patient Reviews, and Patient Stories pages must reproduce the reference's content hierarchy, proof blocks, disclaimers, and CTAs with local dummy media.

- [ ] **Step 4: Implement pricing**

Reproduce the DermaCare, FibroCare, and AdenoidCare Core/Plus/Concierge tiers, monthly equivalents, inclusions, payment note, assessment credit, FAQ, and booking CTA.

- [ ] **Step 5: Validate and commit**

Run: `node scripts/verify-site.mjs` after Task 9 creates it; until then run `Get-ChildItem -Recurse -Filter index.html | Measure-Object`.

Expected at this stage: at least 17 HTML documents.

```powershell
git add about approach case-studies patient-reviews patient-stories pricing research treatments why-choose-us why-homeopathy *-treatment
git commit -m "feat: add treatments pricing and evidence pages"
```

### Task 6: Add blog, location, and policy routes

**Files:**
- Create all Blog, Locations, and policy files listed in the File Map.

- [ ] **Step 1: Build the blog index**

Use a three-column desktop article grid with local placeholder thumbnails, category, reading time, title, short clean-room summary, and route link. Include all seven sitemap articles.

- [ ] **Step 2: Build the seven article pages**

Each article page must include breadcrumbs, category and reading time, one H1, local hero placeholder, introduction, meaningful H2/H3 sections matching the topic, safety disclaimer, related articles, and assessment CTA.

- [ ] **Step 3: Build the locations index and seven detail pages**

Each location page must include local service-area hero copy, retained clinic address and hours, directions/contact actions, available treatments, FAQ, online consultation note, and the emergency disclaimer.

- [ ] **Step 4: Build policy pages**

Privacy, Terms, and Teleconsultation pages must use readable legal-document layout, table of contents, effective-date label, contact details, and policy-specific sections matching the reference information architecture.

- [ ] **Step 5: Commit**

```powershell
git add blog locations privacy-policy terms-of-service teleconsultation-policy
git commit -m "feat: add articles locations and policies"
```

### Task 7: Implement forms, booking, contact, and account UI

**Files:**
- Create: `assets/js/forms.js`
- Create: `tests/forms.test.mjs`
- Create: `book-appointment/index.html`
- Create: `contact/index.html`
- Create: `my-journey/index.html`

- [ ] **Step 1: Write validator tests**

```js
// tests/forms.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { validateEmail, validatePhone } from "../assets/js/forms.js";

test("email validation", () => {
  assert.equal(validateEmail("patient@example.com"), true);
  assert.equal(validateEmail("patient@"), false);
});

test("Indian phone validation", () => {
  assert.equal(validatePhone("+91 98765 43210"), true);
  assert.equal(validatePhone("123"), false);
});
```

- [ ] **Step 2: Verify validator tests fail**

Run: `node --test tests/forms.test.mjs`

Expected: FAIL because `assets/js/forms.js` does not exist.

- [ ] **Step 3: Implement pure validators and presentation-only submission**

```js
// assets/js/forms.js
export const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
export const validatePhone = (value) => /^(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(value.replace(/[()]/g, "").trim());

export function initForms(root = document) {
  root.querySelectorAll("[data-static-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      form.querySelector("[data-form-status]").textContent =
        "Demo complete — no information was transmitted.";
    });
  });
}
```

- [ ] **Step 4: Create the three form pages**

Booking: appointment type, condition, preferred date/time, name, phone, email, consent, fee summary, and no-transmission notice.

Contact: retained address, phone, email, hours, map placeholder, directions, message form, WhatsApp action, and emergency note.

My Journey: reference-style sign-in/registration presentation, progress dashboard preview, and explicit demo-state notice.

- [ ] **Step 5: Run tests and commit**

Run: `node --test tests/forms.test.mjs`

Expected: 2 tests PASS.

```powershell
git add assets/js/forms.js tests/forms.test.mjs book-appointment contact my-journey
git commit -m "feat: add static booking contact and journey flows"
```

### Task 8: Add 404 handling, metadata, and route verification

**Files:**
- Create: `404.html`
- Create: `scripts/verify-site.mjs`
- Complete: `tests/routes.test.mjs`

- [ ] **Step 1: Define the route manifest test**

```js
// tests/routes.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

const routes = [
  "index.html", "404.html", "about/index.html", "approach/index.html",
  "book-appointment/index.html", "case-studies/index.html", "contact/index.html",
  "my-journey/index.html", "patient-reviews/index.html", "patient-stories/index.html",
  "pricing/index.html", "research/index.html", "treatments/index.html",
  "why-choose-us/index.html", "why-homeopathy/index.html",
  "skin-treatment/index.html", "pcod-treatment/index.html",
  "adenoid-treatment/index.html", "allergy-treatment/index.html",
  "hair-loss-treatment/index.html", "thyroid-treatment/index.html",
  "blog/index.html", "locations/index.html", "privacy-policy/index.html",
  "terms-of-service/index.html", "teleconsultation-policy/index.html"
];

test("all required route documents exist", () => {
  for (const route of routes) assert.ok(existsSync(route), `Missing ${route}`);
});
```

- [ ] **Step 2: Create the branded not-found page**

Use the shared shell, a clear “Page not found” H1, links to Home/Treatments/Contact, and the assessment CTA.

- [ ] **Step 3: Implement the verifier**

```js
// scripts/verify-site.mjs
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    if ([".git", "node_modules", "docs", "tests"].includes(name)) return [];
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const htmlFiles = walk(".").filter((path) => path.endsWith(".html"));
const failures = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const token of ["<title>", 'name="description"', "<h1", "site-header", "site-footer"]) {
    if (!html.includes(token)) failures.push(`${file}: missing ${token}`);
  }
  for (const match of html.matchAll(/(?:href|src)="([^"#?]+)"/g)) {
    const ref = match[1];
    if (/^(?:https?:|mailto:|tel:)/.test(ref)) continue;
    const target = ref.startsWith("/") ? resolve(`.${ref}`) : resolve(dirname(file), ref);
    const candidates = [target, join(target, "index.html")];
    if (!candidates.some(existsSync)) failures.push(`${file}: broken ${ref}`);
  }
  if (/drneha\.in/i.test(html)) failures.push(`${file}: forbidden remote reference`);
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Verified ${htmlFiles.length} HTML files`);
```

- [ ] **Step 4: Run all static tests**

Run:

```powershell
node --test tests/*.test.mjs
node scripts/verify-site.mjs
```

Expected: all tests PASS and verifier reports at least 37 HTML files with no broken local references or `drneha.in` assets.

- [ ] **Step 5: Commit**

```powershell
git add 404.html scripts/verify-site.mjs tests/routes.test.mjs
git commit -m "test: verify routes metadata and local assets"
```

### Task 9: Perform browser QA and document delivery

**Files:**
- Create: `README.md`
- Modify: any site file with a verified browser defect

- [ ] **Step 1: Write local-use and deployment instructions**

```md
# Arunima Mustyala Clinic

Static multi-page clinic website recreated for Arunima Mustyala.

## Run locally

```powershell
python -m http.server 4173
```

Open `http://localhost:4173/`.

## Verify

```powershell
node --test tests/*.test.mjs
node scripts/verify-site.mjs
```

Forms are demonstration-only and do not transmit patient information.
```

- [ ] **Step 2: Run browser checks at desktop**

At 1440 × 900 verify homepage, treatment detail, pricing, blog article, location, booking, and policy pages. Compare the reference for palette, Inter typography, 65px navigation, 720px hero, section rhythm, card geometry, and CTA treatment.

Expected: no horizontal overflow, missing media, broken navigation, or console errors.

- [ ] **Step 3: Run browser checks at tablet and mobile**

At 768 × 1024 and 390 × 844 verify mobile navigation, stacked grids, accordion operation, forms, cookie notice, callback panel, assistant, dark mode, and tap targets.

Expected: content stays readable, overlays are closable by button and Escape, and primary actions remain visible without overlap.

- [ ] **Step 4: Run the full verification suite**

Run:

```powershell
node --test tests/*.test.mjs
node scripts/verify-site.mjs
git diff --check
git status --short
```

Expected: all tests pass, verifier succeeds, no whitespace errors, and only intentional files remain staged or modified.

- [ ] **Step 5: Commit delivery documentation**

```powershell
git add README.md
git commit -m "docs: add local run and verification guide"
```

### Task 10: Push the verified repository

**Files:** none

- [ ] **Step 1: Confirm commit scope**

Run:

```powershell
git status --short --branch
git log --oneline --decorate -10
git remote -v
```

Expected: clean `main`, intentional commit history, and origin `https://github.com/rishi-krishna/Arunima.git`.

- [ ] **Step 2: Push**

Run: `git push -u origin main`

Expected: GitHub accepts `main` and establishes upstream tracking.

- [ ] **Step 3: Confirm remote state**

Run: `git ls-remote --heads origin main`

Expected: remote `main` points to the local `HEAD` commit.
