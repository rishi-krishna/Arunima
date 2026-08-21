# Nirmaya Logo-Led Brand Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the legacy header mark with the exact supplied Nirmaya JPEG and refresh the existing single-page site with the approved light teal, ivory, muted-gold, and dusty-blush brand system without changing content or booking behavior.

**Architecture:** Keep the current static HTML/CSS/JavaScript structure. Add one immutable brand asset under `assets/images`, update the shared header and favicon references, centralize the new palette in CSS custom properties, and verify the existing theme, responsive, animation, consultation, and WhatsApp paths with structural tests plus Playwright.

**Tech Stack:** HTML5, CSS custom properties and `color-mix()`, vanilla JavaScript web components, Node.js built-in test runner, Playwright, GitHub Pages.

---

## File Structure

| Path | Responsibility | Planned change |
|---|---|---|
| `assets/images/nirmaya-logo-mark.jpeg` | Exact production header/fav icon artwork | Create by byte-for-byte copying the supplied mark-only JPEG |
| `assets/images/logo-mark.svg` | Legacy generated mark | Remove after all references are replaced |
| `assets/js/components.js` | Shared header, footer, and floating WhatsApp components | Point the header to the JPEG and set its intrinsic display dimensions |
| `assets/css/styles.css` | Site-wide themes, header, sections, controls, responsive styles, and motion | Replace old green/navy tokens, add gold/blush tokens, blend the JPEG into the header, and refine branded accents |
| `index.html` | Single public page, favicon, and cache-busted entry assets | Use the JPEG favicon and bump production asset versions |
| `assets/js/main.js` | Module entry point | Bump imported module versions |
| `assets/js/forms.js` | Consultation/WhatsApp form module | Bump the site-config import version only |
| `assets/js/interactions.js` | Theme, motion, FAQ, and carousel behavior | Bump the site-config import version only |
| `tests/single-page.test.mjs` | Static architecture and regression tests | Assert exact logo bytes, new palette tokens, removal of the old mark, and consistent cache versions |
| `C:/Users/rishi/Documents/CrossPoint Holdings/.arunima-e2e/verify.py` | Local cross-viewport Playwright verification helper | Update visual assertions for the logo and new theme colors; do not commit this external helper |

### Task 1: Lock the exact supplied JPEG into a failing regression test

**Files:**
- Modify: `tests/single-page.test.mjs`
- Reference: `nirmaya logo no nmae.jpeg`

- [ ] **Step 1: Add hashing and existence imports**

Replace the current Node imports at the top of `tests/single-page.test.mjs` with:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
```

- [ ] **Step 2: Add an exact-asset test**

Append this test after the existing shared-header test:

```js
test("shared branding uses the exact supplied Nirmaya JPEG", () => {
  const productionLogo = join(root, "assets/images/nirmaya-logo-mark.jpeg");
  assert.equal(existsSync(productionLogo), true);
  const digest = createHash("sha256")
    .update(readFileSync(productionLogo))
    .digest("hex");

  assert.equal(
    digest,
    "ea1fe7ba4a42655fb621ac322f0bf619a0cb31c3151be55c0153e907846494d2",
  );
  assert.match(index, /href="assets\/images\/nirmaya-logo-mark\.jpeg" type="image\/jpeg"/);
  assert.match(
    components,
    /<img src="assets\/images\/nirmaya-logo-mark\.jpeg" alt="" width="52" height="40">/,
  );
  assert.doesNotMatch(`${index}\n${components}`, /logo-mark\.svg/);
});
```

- [ ] **Step 3: Run the focused test and verify the new requirement fails**

Run:

```powershell
node --test --test-name-pattern="exact supplied Nirmaya JPEG" tests/single-page.test.mjs
```

Expected: FAIL because `assets/images/nirmaya-logo-mark.jpeg` does not yet exist.

- [ ] **Step 4: Commit the failing regression test**

```powershell
git add -- tests/single-page.test.mjs
git commit -m "test: lock exact Nirmaya logo asset"
```

### Task 2: Install the exact JPEG and replace every legacy logo reference

**Files:**
- Create: `assets/images/nirmaya-logo-mark.jpeg`
- Delete: `assets/images/logo-mark.svg`
- Modify: `assets/js/components.js:22-25`
- Modify: `assets/css/styles.css:286-322`
- Modify: `assets/css/styles.css:974-981`
- Modify: `index.html:9`

- [ ] **Step 1: Copy the supplied JPEG byte-for-byte into production assets**

Run from the repository root:

```powershell
Copy-Item -LiteralPath 'nirmaya logo no nmae.jpeg' -Destination 'assets/images/nirmaya-logo-mark.jpeg'
Get-FileHash -Algorithm SHA256 -LiteralPath 'assets/images/nirmaya-logo-mark.jpeg' | Format-List Hash
```

Expected hash:

```text
EA1FE7BA4A42655FB621AC322F0BF619A0CB31C3151BE55C0153E907846494D2
```

This is a file copy only. Do not crop, recompress, regenerate, redraw, or otherwise modify the JPEG.

- [ ] **Step 2: Replace the shared-header image reference**

In `assets/js/components.js`, replace the existing brand image with:

```html
<img src="assets/images/nirmaya-logo-mark.jpeg" alt="" width="52" height="40">
```

Keep the following practitioner-name span unchanged:

```html
<span>${escapeHtml(clinic.practitioner)}</span>
```

- [ ] **Step 3: Replace the favicon reference**

In `index.html`, replace the legacy SVG favicon line with:

```html
<link rel="icon" href="assets/images/nirmaya-logo-mark.jpeg" type="image/jpeg">
```

- [ ] **Step 4: Make the embedded JPEG background blend into the header**

Replace the current `.site-nav`, `.site-brand`, and `.site-brand img` declarations with the following values while keeping unrelated declarations intact:

```css
.site-nav {
  position: sticky;
  z-index: 90;
  top: 0;
  height: 72px;
  border-bottom: 1px solid color-mix(in srgb, var(--gold) 38%, var(--border));
  background: color-mix(in srgb, var(--logo-ivory) 88%, transparent);
  backdrop-filter: blur(16px);
}

.site-nav__inner {
  display: flex;
  height: 72px;
  align-items: center;
  gap: 10px;
}

.site-brand {
  display: flex;
  min-width: max-content;
  align-items: center;
  gap: 12px;
  margin-right: auto;
  color: var(--heading);
  font-size: 20px;
  font-weight: 700;
}

.site-brand img {
  width: 52px;
  height: 40px;
  border-radius: 8px;
  background: var(--logo-ivory);
  object-fit: contain;
}
```

In the `@media (max-width: 640px)` block, replace the current mobile brand image rules with:

```css
.site-brand {
  gap: 9px;
  font-size: 16px;
}

.site-brand img {
  width: 45px;
  height: 35px;
}
```

Update `.hero` mobile height and booking anchor offsets to reflect the 72px header:

```css
.hero {
  min-height: calc(100svh - 72px);
  padding-block: 44px;
}

.booking-section {
  scroll-margin-top: 92px;
}
```

- [ ] **Step 5: Remove the legacy generated SVG**

```powershell
git rm -- assets/images/logo-mark.svg
```

- [ ] **Step 6: Run the focused exact-asset test**

```powershell
node --test --test-name-pattern="exact supplied Nirmaya JPEG" tests/single-page.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit the production logo replacement**

```powershell
git add -- assets/images/nirmaya-logo-mark.jpeg assets/js/components.js assets/css/styles.css index.html
git commit -m "feat: install exact Nirmaya header logo"
```

Do not add `nirmaya logo.jpeg`; it remains the user-supplied palette reference and is not loaded by the website.

### Task 3: Introduce and verify the approved light brand system

**Files:**
- Modify: `tests/single-page.test.mjs`
- Modify: `assets/css/styles.css:3-35`
- Modify: `assets/css/styles.css:84-176`
- Modify: `assets/css/styles.css:208-265`
- Modify: `assets/css/styles.css:349-357`
- Modify: `assets/css/styles.css:1043-1095`
- Modify: `assets/css/styles.css:1374-1395`

- [ ] **Step 1: Load the stylesheet in the structural tests**

Add this constant beside the existing `index` and `components` constants:

```js
const styles = readFileSync(join(root, "assets/css/styles.css"), "utf8");
```

- [ ] **Step 2: Add a palette and stale-color regression test**

Append:

```js
test("site uses the approved light Nirmaya palette", () => {
  const requiredTokens = [
    ["--background", "#fffdf9"],
    ["--foreground", "#263e3f"],
    ["--primary", "#337d7d"],
    ["--logo-ivory", "#fbf5ec"],
    ["--gold", "#c3a15a"],
    ["--blush", "#e4bcbc"],
  ];

  for (const [name, value] of requiredTokens) {
    assert.match(styles.toLowerCase(), new RegExp(`${name}:\\s*${value}`));
  }

  assert.doesNotMatch(styles.toLowerCase(), /#176d37|#22c35d|#168a46|#d6e1d6/);
  assert.match(styles, /\.section-heading::after[\s\S]*var\(--gold\)/);
  assert.match(styles, /\.whatsapp-action[\s\S]*background:\s*var\(--primary\)/);
});
```

- [ ] **Step 3: Run the palette test and verify it fails**

```powershell
node --test --test-name-pattern="approved light Nirmaya palette" tests/single-page.test.mjs
```

Expected: FAIL because the old green tokens are still present.

- [ ] **Step 4: Replace the light and dark theme token blocks**

Replace the `:root` and `[data-theme="dark"]` blocks with:

```css
:root {
  --background: #fffdf9;
  --foreground: #263e3f;
  --heading: #245657;
  --primary: #337d7d;
  --primary-foreground: #fffdf9;
  --hero-cta: #337d7d;
  --accent: #c3a15a;
  --gold: #c3a15a;
  --blush: #e4bcbc;
  --logo-ivory: #fbf5ec;
  --muted: #f0e4d7;
  --muted-foreground: #657170;
  --card: #fffaf2;
  --border: #e1d7c6;
  --shadow: 0 14px 34px rgb(51 88 87 / .12), 0 4px 10px rgb(51 88 87 / .06);
  --radius-card: 14px;
  --radius-control: 8px;
  --radius-hero-action: 999px;
  --container: 1216px;
  color-scheme: light;
}

[data-theme="dark"] {
  --background: #18302f;
  --foreground: #f8f2e8;
  --heading: #f5e9d5;
  --primary: #82c4c1;
  --primary-foreground: #163331;
  --hero-cta: #82c4c1;
  --accent: #d1b06a;
  --gold: #d1b06a;
  --blush: #b98082;
  --logo-ivory: #fbf5ec;
  --muted: #294442;
  --muted-foreground: #c8d1cd;
  --card: #203a38;
  --border: #48605c;
  --shadow: 0 14px 34px rgb(7 20 19 / .28);
  color-scheme: dark;
}
```

- [ ] **Step 5: Apply the restrained gold hierarchy treatment**

Add `color: var(--heading)` to the shared `h1, h2, h3, h4` rule, then update `.section-heading` and add its gold rule:

```css
.section-heading {
  position: relative;
  max-width: 800px;
  margin: 0 auto 40px;
  padding-bottom: 18px;
  text-align: center;
}

.section-heading::after {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 84px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
  content: "";
  transform: translateX(-50%);
}

.eyebrow {
  margin-bottom: 10px;
  color: color-mix(in srgb, var(--gold) 86%, var(--heading));
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
}
```

- [ ] **Step 6: Restyle surfaces, actions, forms, and WhatsApp controls**

Make these focused replacements:

```css
.site-section--sage {
  background: color-mix(in srgb, var(--logo-ivory) 72%, var(--blush) 28%);
}

.site-section--primary-tint {
  background: color-mix(in srgb, var(--primary) 5%, var(--background));
}

.button--assessment {
  border-color: var(--primary);
  background: var(--hero-cta);
  color: var(--primary-foreground);
  box-shadow: var(--shadow);
}

.button--whatsapp,
.site-nav__whatsapp {
  border-color: color-mix(in srgb, var(--primary) 70%, var(--gold));
  background: color-mix(in srgb, var(--primary) 10%, var(--background));
  color: var(--primary);
}

.button--whatsapp:hover,
.site-nav__whatsapp:hover,
.whatsapp-action:hover {
  background: var(--primary);
  color: var(--primary-foreground);
  box-shadow: 0 14px 34px color-mix(in srgb, var(--primary) 24%, transparent);
}

.button:focus-visible,
.site-nav__whatsapp:focus-visible,
.whatsapp-action:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--gold) 70%, white);
  outline-offset: 3px;
}

.whatsapp-action {
  background: var(--primary);
  color: var(--primary-foreground);
  box-shadow: var(--shadow);
}
```

Leave the existing layout, sizes, and non-color properties of these selectors unchanged.

- [ ] **Step 7: Replace hard-coded green hero decoration with brand tokens**

Use these backgrounds in the existing hero pseudo-elements:

```css
.hero::before {
  background:
    repeating-radial-gradient(circle at 70% 78%, transparent 0 17px, color-mix(in srgb, var(--primary) 10%, transparent) 18px 19px),
    radial-gradient(circle at 70% 75%, color-mix(in srgb, var(--logo-ivory) 76%, var(--blush)), transparent 62%);
}

.hero::after {
  background:
    repeating-radial-gradient(circle at 34% 28%, transparent 0 19px, color-mix(in srgb, var(--gold) 10%, transparent) 20px 21px),
    radial-gradient(circle at 30% 25%, color-mix(in srgb, var(--logo-ivory) 82%, var(--gold)), transparent 62%);
}
```

Change the selected protocol shadow to remove the stale hard-coded green:

```css
box-shadow: 0 8px 20px color-mix(in srgb, var(--primary) 12%, transparent);
```

- [ ] **Step 8: Run the focused and full structural tests**

```powershell
node --test --test-name-pattern="approved light Nirmaya palette" tests/single-page.test.mjs
node --test tests/single-page.test.mjs
```

Expected: focused test PASS; full suite PASS.

- [ ] **Step 9: Commit the palette refresh**

```powershell
git add -- tests/single-page.test.mjs assets/css/styles.css
git commit -m "feat: apply light Nirmaya brand palette"
```

### Task 4: Cache-bust, verify both themes and viewports, and deploy

**Files:**
- Modify: `tests/single-page.test.mjs`
- Modify: `index.html:10-11`
- Modify: `assets/js/main.js:1-3`
- Modify: `assets/js/components.js:1`
- Modify: `assets/js/forms.js:1`
- Modify: `assets/js/interactions.js:1`
- Modify locally only: `C:/Users/rishi/Documents/CrossPoint Holdings/.arunima-e2e/verify.py`

- [ ] **Step 1: Add a cache-version consistency test**

Add these module reads near the top of `tests/single-page.test.mjs`:

```js
const main = readFileSync(join(root, "assets/js/main.js"), "utf8");
const forms = readFileSync(join(root, "assets/js/forms.js"), "utf8");
const interactions = readFileSync(join(root, "assets/js/interactions.js"), "utf8");
```

Append:

```js
test("production entry assets share the current cache version", () => {
  const sources = [index, main, components, forms, interactions];
  for (const source of sources) {
    assert.doesNotMatch(source, /20260820g/);
  }
  assert.match(index, /styles\.css\?v=20260821a/);
  assert.match(index, /main\.js\?v=20260821a/);
  for (const source of [main, components, forms, interactions]) {
    assert.match(source, /20260821a/);
  }
});
```

- [ ] **Step 2: Run the cache-version test and verify it fails**

```powershell
node --test --test-name-pattern="current cache version" tests/single-page.test.mjs
```

Expected: FAIL because production files still use `20260820g`.

- [ ] **Step 3: Bump all production asset and module versions**

Replace every production occurrence of `20260820g` in `index.html` and `assets/js/*.js` with `20260821a`. Do not change form logic, clinic configuration, or interaction behavior.

- [ ] **Step 4: Run static verification**

```powershell
node --test tests/single-page.test.mjs
node --check assets/js/main.js
node --check assets/js/components.js
node --check assets/js/forms.js
node --check assets/js/interactions.js
node --check assets/js/site-config.js
git diff --check
rg -n "logo-mark\.svg|20260820g|#176d37|#22c35d|#168a46|#d6e1d6" index.html assets tests
```

Expected: all tests and syntax checks PASS; `git diff --check` has no errors; `rg` returns no matches.

- [ ] **Step 5: Update the local Playwright verifier for the refresh**

In `C:/Users/rishi/Documents/CrossPoint Holdings/.arunima-e2e/verify.py`, add these assertions after navigation:

```python
logo = page.locator('site-header img[src="assets/images/nirmaya-logo-mark.jpeg"]')
assert logo.count() == 1
assert logo.evaluate("el => el.naturalWidth > 0 && el.naturalHeight > 0")
assert page.locator('img[src*="logo-mark.svg"]').count() == 0
assert page.evaluate("document.documentElement.scrollWidth === document.documentElement.clientWidth")
```

Replace the old dark-background wait and assertion with:

```python
page.wait_for_function(
    "getComputedStyle(document.body).backgroundColor === 'rgb(24, 48, 47)'"
)
body_background = page.locator("body").evaluate(
    "el => getComputedStyle(el).backgroundColor"
)
assert body_background == "rgb(24, 48, 47)", body_background
```

- [ ] **Step 6: Run desktop and mobile Playwright verification**

Run through the existing server helper:

```powershell
python 'C:\Users\rishi\.agents\skills\webapp-testing\scripts\with_server.py' --server "python -m http.server 4173 --bind 127.0.0.1" --port 4173 --timeout 30 -- python 'C:\Users\rishi\Documents\CrossPoint Holdings\.arunima-e2e\verify.py'
```

Expected:

- Desktop `1440x1000` and mobile `390x844` complete successfully.
- The exact JPEG renders once in the header.
- No legacy SVG, placeholder images, navigation drawer, horizontal scroll, overlaps, console errors, or page errors are present.
- Invalid consultation submission opens no URL.
- Valid consultation submission opens `https://wa.me/916303196195?text=...` with the completed field values.
- Light theme is visibly warm and bright; dark theme body is `rgb(24, 48, 47)`.
- Reduced-motion behavior remains active in the reduced-motion browser context.

- [ ] **Step 7: Inspect all four screenshots**

Open and inspect:

```text
C:\Users\rishi\Documents\CrossPoint Holdings\.arunima-e2e\screenshots\single-page-desktop.png
C:\Users\rishi\Documents\CrossPoint Holdings\.arunima-e2e\screenshots\single-page-desktop-dark.png
C:\Users\rishi\Documents\CrossPoint Holdings\.arunima-e2e\screenshots\single-page-mobile.png
C:\Users\rishi\Documents\CrossPoint Holdings\.arunima-e2e\screenshots\single-page-mobile-dark.png
```

Confirm the JPEG blends with the header, teal is not visually heavy, gold lines remain subtle, blush is secondary, buttons are readable, the booking form is polished, and no section introduces unwanted empty space.

- [ ] **Step 8: Commit the verified cache-busted release**

```powershell
git add -- index.html assets/js/main.js assets/js/components.js assets/js/forms.js assets/js/interactions.js tests/single-page.test.mjs
git commit -m "chore: prepare Nirmaya brand refresh release"
```

- [ ] **Step 9: Push and verify GitHub Pages/custom-domain deployment**

```powershell
git push origin main
$releaseSha = git rev-parse --short HEAD
gh run list --limit 5
Invoke-WebRequest -UseBasicParsing "https://nirmayahomeopathy.com/?v=$releaseSha" | Select-Object StatusCode
```

Expected: push succeeds, the Pages workflow completes successfully, and the live URL returns HTTP 200.

Perform a final live-page check confirming:

- `assets/images/nirmaya-logo-mark.jpeg` loads successfully.
- `styles.css?v=20260821a` and `main.js?v=20260821a` are served.
- The visible header reads `Dr. Arunima Musthyala` beside the supplied JPEG.
- The booking form and all WhatsApp links still target `+91 63031 96195`.
- There are no console or page errors.
