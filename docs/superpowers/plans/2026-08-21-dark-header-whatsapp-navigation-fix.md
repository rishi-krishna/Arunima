# Dark Header Contrast and WhatsApp Navigation Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the doctor’s name readable on the ivory header in both themes and prevent valid consultation submissions from creating a blank browser tab before opening WhatsApp.

**Architecture:** Add a dedicated theme-stable header foreground token and use it only for the shared brand name. Replace the form’s new-window call with same-page navigation, then protect both changes with static regression tests and a Playwright navigation interception test.

**Tech Stack:** CSS custom properties, vanilla JavaScript, Node.js built-in test runner, Playwright, GitHub Pages.

---

## File Structure

| Path | Responsibility | Planned change |
|---|---|---|
| `assets/css/styles.css` | Theme tokens and shared header presentation | Add `--header-foreground: #23666b` to both themes and use it for `.site-brand` |
| `assets/js/forms.js` | Booking validation, message construction, and WhatsApp handoff | Replace the new-window call with `window.location.assign(bookingUrl)` |
| `tests/single-page.test.mjs` | Static regression tests | Assert the dedicated header color and same-page handoff |
| `index.html` and `assets/js/{main,components,forms,interactions}.js` | Browser cache entry points | Bump all production versions from `20260821a` to `20260821b` |
| `C:/Users/rishi/Documents/CrossPoint Holdings/.arunima-e2e/verify.py` | Local browser verification helper | Intercept the WhatsApp navigation and assert that no popup opens |

### Task 1: Add failing regression tests for the approved behavior

**Files:**
- Modify: `tests/single-page.test.mjs`

- [ ] **Step 1: Add the header contrast regression test**

Append:

```js
test("header name keeps the softened logo teal in both themes", () => {
  const headerTokenMatches =
    styles.toLowerCase().match(/--header-foreground:\s*#23666b/g) ?? [];
  assert.equal(headerTokenMatches.length, 2);
  assert.match(
    styles,
    /\.site-brand\s*\{[\s\S]*?color:\s*var\(--header-foreground\)/,
  );
});
```

- [ ] **Step 2: Add the same-page WhatsApp regression test**

Append:

```js
test("valid booking uses same-page WhatsApp navigation", () => {
  assert.match(forms, /window\.location\.assign\(bookingUrl\)/);
  assert.doesNotMatch(forms, /window\.open\(bookingUrl/);
});
```

- [ ] **Step 3: Run both focused tests and verify they fail**

```powershell
node --test --test-name-pattern="header name|same-page WhatsApp" tests/single-page.test.mjs
```

Expected: both tests FAIL because `.site-brand` still uses `var(--heading)` and the form still calls `window.open`.

- [ ] **Step 4: Commit the failing regression tests**

```powershell
git add -- tests/single-page.test.mjs
git commit -m "test: cover header contrast and WhatsApp handoff"
```

### Task 2: Implement the header color and same-page handoff

**Files:**
- Modify: `assets/css/styles.css:3-45`
- Modify: `assets/css/styles.css:333-344`
- Modify: `assets/js/forms.js:62-86`

- [ ] **Step 1: Add the dedicated header token to both themes**

Add this token to both the `:root` and `[data-theme="dark"]` blocks:

```css
--header-foreground: #23666b;
```

Place it immediately after `--heading` so the relationship remains clear.

- [ ] **Step 2: Use the token only for the shared brand name**

In `.site-brand`, replace:

```css
color: var(--heading);
```

with:

```css
color: var(--header-foreground);
```

Do not change `.hero__credentials` or global heading colors.

- [ ] **Step 3: Navigate the current page to WhatsApp**

In the valid form-submission branch of `assets/js/forms.js`, replace:

```js
window.open(bookingUrl, "_blank", "noopener,noreferrer");
```

with:

```js
window.location.assign(bookingUrl);
```

Keep validation, fallback-link population, status text, message construction, and the WhatsApp number unchanged.

- [ ] **Step 4: Run the focused and complete regression suites**

```powershell
node --test --test-name-pattern="header name|same-page WhatsApp" tests/single-page.test.mjs
node --test tests/single-page.test.mjs
```

Expected: focused tests PASS and the complete suite PASS.

- [ ] **Step 5: Commit the implementation**

```powershell
git add -- assets/css/styles.css assets/js/forms.js
git commit -m "fix: improve header contrast and WhatsApp handoff"
```

### Task 3: Cache-bust, verify in browsers, and deploy

**Files:**
- Modify: `tests/single-page.test.mjs`
- Modify: `index.html:10-11`
- Modify: `assets/js/main.js:1-3`
- Modify: `assets/js/components.js:1`
- Modify: `assets/js/forms.js:1`
- Modify: `assets/js/interactions.js:1`
- Modify locally only: `C:/Users/rishi/Documents/CrossPoint Holdings/.arunima-e2e/verify.py`

- [ ] **Step 1: Update the cache-version regression test**

In `tests/single-page.test.mjs`, update the cache-version test to require `20260821b`:

```js
test("production entry assets share the current cache version", () => {
  const sources = [index, main, components, forms, interactions];
  for (const source of sources) {
    assert.doesNotMatch(source, /20260821a/);
  }
  assert.match(index, /styles\.css\?v=20260821b/);
  assert.match(index, /main\.js\?v=20260821b/);
  for (const source of [main, components, forms, interactions]) {
    assert.match(source, /20260821b/);
  }
});
```

- [ ] **Step 2: Verify the cache-version test fails**

```powershell
node --test --test-name-pattern="current cache version" tests/single-page.test.mjs
```

Expected: FAIL because the production entry files still use `20260821a`.

- [ ] **Step 3: Bump every production cache reference**

Replace every production occurrence of `20260821a` in `index.html` and `assets/js/*.js` with `20260821b`.

- [ ] **Step 4: Update the Playwright form-navigation check**

In `C:/Users/rishi/Documents/CrossPoint Holdings/.arunima-e2e/verify.py`, replace the `window.open` override and related `window.__opened` assertions with request interception:

```python
whatsapp_requests = []
popup_count = 0

def record_popup(_popup):
    nonlocal popup_count
    popup_count += 1

def intercept_whatsapp(route):
    whatsapp_requests.append(route.request.url)
    route.abort()

page.on("popup", record_popup)
page.route("https://wa.me/**", intercept_whatsapp)
```

After invalid submission, assert:

```python
assert whatsapp_requests == []
assert popup_count == 0
```

After valid submission, assert:

```python
assert len(whatsapp_requests) == 1, whatsapp_requests
whatsapp_url = whatsapp_requests[0]
assert whatsapp_url.startswith("https://wa.me/919999999999?text="), whatsapp_url
assert popup_count == 0
```

Keep the existing prefilled-message assertions, fallback-link assertion, theme checks, viewport checks, screenshots, and error collection.

- [ ] **Step 5: Add a computed-color browser assertion**

After the header renders, add:

```python
brand_color = page.locator(".site-brand").evaluate(
    "el => getComputedStyle(el).color"
)
assert brand_color == "rgb(35, 102, 107)", brand_color
```

Repeat the same assertion after switching to dark mode to prove the ivory header keeps the readable softened-logo teal.

- [ ] **Step 6: Run static verification**

```powershell
node --test tests/single-page.test.mjs
node --check assets/js/main.js
node --check assets/js/components.js
node --check assets/js/forms.js
node --check assets/js/interactions.js
node --check assets/js/site-config.js
git diff --check
rg -n "window\.open\(bookingUrl|20260821a" index.html assets
```

Expected: all tests and syntax checks PASS; `git diff --check` has no errors; `rg` finds no production stale calls or cache versions.

- [ ] **Step 7: Run Playwright on a free local port**

Set `BASE_URL` in the local verifier to the selected free port, then run:

```powershell
python 'C:\Users\rishi\.agents\skills\webapp-testing\scripts\with_server.py' --server "python -m http.server 4201 --bind 127.0.0.1" --port 4201 --timeout 30 -- python 'C:\Users\rishi\Documents\CrossPoint Holdings\.arunima-e2e\verify.py'
```

Expected:

- Desktop `1440x1000` and mobile `390x844` pass.
- Header name computes to `rgb(35, 102, 107)` in both themes.
- Invalid submission creates no WhatsApp request and no popup.
- Valid submission creates one intercepted WhatsApp request containing all completed fields and no popup.
- Existing fallback link, theme behavior, reduced-motion behavior, anchor placement, and overlap checks pass.
- Console and page error arrays are empty.

- [ ] **Step 8: Commit the cache-busted verified release**

```powershell
git add -- index.html assets/js/main.js assets/js/components.js assets/js/forms.js assets/js/interactions.js tests/single-page.test.mjs
git commit -m "chore: prepare header and WhatsApp fix release"
```

- [ ] **Step 9: Push and verify the custom-domain deployment**

```powershell
git push origin main
$releaseSha = git rev-parse --short HEAD
Invoke-WebRequest -UseBasicParsing "https://nirmayahomeopathy.com/?v=$releaseSha" | Select-Object StatusCode
```

Expected: the push succeeds, the live URL returns HTTP 200, live HTML references `20260821b`, `.site-brand` uses the softened logo teal in dark mode, and the deployed form contains `window.location.assign(bookingUrl)` with no `window.open(bookingUrl, ...)` call.
