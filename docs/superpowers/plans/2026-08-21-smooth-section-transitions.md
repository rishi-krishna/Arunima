# Smooth Light-Mode Section Transitions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Blend differing light-mode section backgrounds over 40px while preserving the existing section colors, layout, interactions, and unchanged dark mode.

**Architecture:** Represent each section’s solid color with a CSS custom property, then let one shared light-theme linear gradient paint from the preceding section color into the current section color. Adjacent selectors configure only the boundaries where colors differ; dark mode continues to paint the current section color as a solid background.

**Tech Stack:** CSS custom properties and gradients, Node.js built-in test runner, Playwright, GitHub Pages.

---

## File Structure

| Path | Responsibility | Planned change |
|---|---|---|
| `assets/css/styles.css` | Theme tokens and section surfaces | Add section-color tokens, 40px light-theme gradients, and adjacent-boundary mappings |
| `tests/single-page.test.mjs` | Static regression suite | Assert gradient depth, light-theme scope, boundary mappings, and unchanged solid dark mode |
| `index.html` and `assets/js/{main,components,forms,interactions}.js` | Cache-busted production entry points | Bump `20260821b` to `20260821c` |
| `C:/Users/rishi/Documents/CrossPoint Holdings/.arunima-e2e/verify.py` | Local browser verification helper | Assert computed gradient in light mode, solid dark backgrounds, and preserved layout/behavior |

### Task 1: Add failing transition regressions

**Files:**
- Modify: `tests/single-page.test.mjs`

- [ ] **Step 1: Add the light-mode transition test**

Append:

```js
test("light mode blends differing section colors over 40px", () => {
  assert.match(
    styles,
    /\[data-theme="light"\] \.site-section\s*\{[\s\S]*?linear-gradient\([\s\S]*?40px/,
  );
  assert.match(styles, /\.hero \+ \.site-section[\s\S]*?--section-from:\s*var\(--section-default\)/);
  assert.match(styles, /\.site-section--sage \+ \.experiences-section[\s\S]*?--section-from:\s*var\(--section-soft\)/);
  assert.match(styles, /\.experiences-section \+ \.site-section--primary-tint[\s\S]*?--section-from:\s*var\(--section-experiences\)/);
  assert.match(styles, /\.site-section--primary-tint \+ \.site-section[\s\S]*?--section-from:\s*var\(--section-primary-tint\)/);
});
```

- [ ] **Step 2: Add the unchanged-dark-mode regression test**

Append:

```js
test("dark mode keeps solid section backgrounds", () => {
  assert.match(
    styles,
    /\[data-theme="dark"\] \.site-section\s*\{\s*background:\s*var\(--section-color\);\s*\}/,
  );
  const darkSectionRule = styles.match(
    /\[data-theme="dark"\] \.site-section\s*\{[\s\S]*?\}/,
  )?.[0] ?? "";
  assert.doesNotMatch(darkSectionRule, /linear-gradient/);
});
```

- [ ] **Step 3: Run the focused tests and verify they fail**

```powershell
node --test --test-name-pattern="section colors|section backgrounds" tests/single-page.test.mjs
```

Expected: both tests FAIL because section-aware gradients and the explicit dark solid rule do not yet exist.

- [ ] **Step 4: Commit the failing regressions**

```powershell
git add -- tests/single-page.test.mjs
git commit -m "test: cover smooth section transitions"
```

### Task 2: Implement 40px section-aware gradients

**Files:**
- Modify: `assets/css/styles.css:3-50`
- Modify: `assets/css/styles.css:141-160`
- Modify: `assets/css/styles.css:1255-1258`

- [ ] **Step 1: Add named section colors to both theme blocks**

Add these tokens to `:root` after `--section-soft`:

```css
--section-default: var(--background);
--section-primary-tint: color-mix(in srgb, var(--primary) 5%, var(--background));
--section-experiences: color-mix(in srgb, var(--muted) 30%, var(--background));
```

Add the same three token declarations after `--section-soft` in `[data-theme="dark"]`. They remain useful as named solid colors even though dark mode does not blend them.

- [ ] **Step 2: Replace direct section backgrounds with section-color properties**

Update the base section rules to:

```css
.site-section {
  --section-color: var(--section-default);
  padding-block: 64px;
  background: var(--section-color);
}

.site-section--sage {
  --section-color: var(--section-soft);
}

.site-section--primary-tint {
  --section-color: var(--section-primary-tint);
}
```

Replace the later `.experiences-section` background declaration with:

```css
.experiences-section {
  --section-color: var(--section-experiences);
  padding-bottom: 0;
}
```

Keep all other declarations in these blocks unchanged.

- [ ] **Step 3: Add the light-gradient and dark-solid rendering rules**

Place these rules after the section variants:

```css
[data-theme="light"] .site-section {
  background: linear-gradient(
    to bottom,
    var(--section-from, var(--section-color)) 0,
    var(--section-color) 40px
  );
}

[data-theme="dark"] .site-section {
  background: var(--section-color);
}
```

The gradient is inside the following section’s own box, so it does not alter height, overlap content, or intercept clicks.

- [ ] **Step 4: Map only the boundaries with different colors**

Add:

```css
[data-theme="light"] .hero + .site-section {
  --section-from: var(--section-default);
}

[data-theme="light"] .site-section--sage + .experiences-section {
  --section-from: var(--section-soft);
}

[data-theme="light"] .experiences-section + .site-section--primary-tint {
  --section-from: var(--section-experiences);
}

[data-theme="light"] .site-section--primary-tint + .site-section {
  --section-from: var(--section-primary-tint);
}

[data-theme="light"] .site-section:not(.site-section--sage) + .site-section--sage {
  --section-from: var(--section-default);
}
```

Do not add rules for soft-to-soft boundaries; their fallback start and end colors remain identical.

- [ ] **Step 5: Run the focused and full structural suites**

```powershell
node --test --test-name-pattern="section colors|section backgrounds" tests/single-page.test.mjs
node --test tests/single-page.test.mjs
```

Expected: focused tests PASS and the complete suite PASS.

- [ ] **Step 6: Commit the CSS implementation**

```powershell
git add -- assets/css/styles.css
git commit -m "feat: blend light section backgrounds"
```

### Task 3: Cache-bust, browser-test, and deploy

**Files:**
- Modify: `tests/single-page.test.mjs`
- Modify: `index.html:10-11`
- Modify: `assets/js/main.js:1-3`
- Modify: `assets/js/components.js:1`
- Modify: `assets/js/forms.js:1`
- Modify: `assets/js/interactions.js:1`
- Modify locally only: `C:/Users/rishi/Documents/CrossPoint Holdings/.arunima-e2e/verify.py`

- [ ] **Step 1: Update the cache-version regression**

Require `20260821c` and reject `20260821b`:

```js
test("production entry assets share the current cache version", () => {
  const sources = [index, main, components, forms, interactions];
  for (const source of sources) {
    assert.doesNotMatch(source, /20260821b/);
  }
  assert.match(index, /styles\.css\?v=20260821c/);
  assert.match(index, /main\.js\?v=20260821c/);
  for (const source of [main, components, forms, interactions]) {
    assert.match(source, /20260821c/);
  }
});
```

- [ ] **Step 2: Verify the cache-version test fails**

```powershell
node --test --test-name-pattern="current cache version" tests/single-page.test.mjs
```

Expected: FAIL while production entry files still use `20260821b`.

- [ ] **Step 3: Bump production references to `20260821c`**

Replace every production occurrence of `20260821b` in `index.html` and `assets/js/*.js` with `20260821c`.

- [ ] **Step 4: Extend the local browser verifier**

After the light theme loads, add:

```python
process_section = page.locator('[aria-labelledby="process-title"]')
process_background = process_section.evaluate(
    "el => getComputedStyle(el).backgroundImage"
)
assert process_background.startswith("linear-gradient"), process_background
assert "40px" in process_background, process_background
```

After switching to dark mode, add:

```python
dark_process_background = process_section.evaluate(
    "el => getComputedStyle(el).backgroundImage"
)
assert dark_process_background == "none", dark_process_background
```

Retain the existing desktop/mobile screenshots, overflow checks, booking anchor check, computed header color, form validation, one-request/zero-popup WhatsApp check, dark body color, reduced-motion check, and error collection.

- [ ] **Step 5: Run static verification**

```powershell
node --test tests/single-page.test.mjs
node --check assets/js/main.js
node --check assets/js/components.js
node --check assets/js/forms.js
node --check assets/js/interactions.js
node --check assets/js/site-config.js
git diff --check
rg -n "20260821b" index.html assets
```

Expected: all tests and syntax checks PASS; `git diff --check` has no errors; the stale production-version search returns no matches.

- [ ] **Step 6: Run Playwright on an unused local port**

Set the verifier’s `BASE_URL` to `http://127.0.0.1:4213/`, then run:

```powershell
python 'C:\Users\rishi\.agents\skills\webapp-testing\scripts\with_server.py' --server "python -m http.server 4213 --bind 127.0.0.1" --port 4213 --timeout 30 -- python 'C:\Users\rishi\Documents\CrossPoint Holdings\.arunima-e2e\verify.py'
```

Expected:

- Desktop `1440x1000` and mobile `390x844` pass.
- The process section has a computed light-mode linear gradient containing `40px`.
- The same section has no background image in dark mode.
- No horizontal overflow, layout overlap, popup window, console error, or page error occurs.
- Booking, theme, reduced-motion, and WhatsApp checks remain successful.

- [ ] **Step 7: Visually inspect representative boundaries**

Inspect the desktop and mobile light screenshots, focusing on:

- Hero to consultation process: warm white into blush.
- Biography to patient experiences: blush into the experiences surface.
- FAQ to reading insights: primary tint into warm white.
- Reading insights to Instagram: warm white into blush.
- Instagram to booking: no artificial band because both use the same soft color.

Confirm each differing boundary blends over a narrow, subtle band and content spacing remains unchanged.

- [ ] **Step 8: Commit and deploy the verified release**

```powershell
git add -- index.html assets/js/main.js assets/js/components.js assets/js/forms.js assets/js/interactions.js tests/single-page.test.mjs
git commit -m "chore: prepare smooth transition release"
git push origin main
$releaseSha = git rev-parse --short HEAD
Invoke-WebRequest -UseBasicParsing "https://nirmayahomeopathy.com/?v=$releaseSha" | Select-Object StatusCode
```

Expected: push succeeds, the live page returns HTTP 200, live HTML references `20260821c`, the live stylesheet contains the light-only 40px gradient, and dark mode retains solid section backgrounds.
