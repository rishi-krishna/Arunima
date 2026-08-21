# Temporary WhatsApp Number Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Route every live WhatsApp action to `919999999999` while keeping existing messages and navigation behavior unchanged.

**Architecture:** `assets/js/site-config.js` remains the single source used by the booking form, while `index.html` contains the two static WhatsApp actions. The pulled homepage already contains the requested number, so implementation updates the shared configuration and adds a structural regression test covering both sources.

**Tech Stack:** Static HTML, JavaScript ES modules, Node.js built-in test runner, Git.

---

### Task 1: Add destination regression coverage

**Files:**
- Modify: `tests/single-page.test.mjs`

- [ ] **Step 1: Read the shared configuration in the structural test**

Add this alongside the existing fixture reads:

```js
const siteConfig = readFileSync(join(root, "assets/js/site-config.js"), "utf8");
```

- [ ] **Step 2: Add the failing destination test**

```js
test("all live WhatsApp actions use the temporary destination", () => {
  assert.doesNotMatch(index, /wa\.me\/916303196195/);
  assert.doesNotMatch(siteConfig, /916303196195|\+91 63031 96195/);
  assert.match(index, /wa\.me\/919999999999/);
  assert.match(siteConfig, /whatsappNumber:\s*"\+91 99999 99999"/);
  assert.match(siteConfig, /whatsappBaseHref:\s*"https:\/\/wa\.me\/919999999999"/);
});
```

- [ ] **Step 3: Run the test and verify it fails on the old shared configuration**

Run:

```powershell
node --test tests/single-page.test.mjs
```

Expected: the new destination test fails because `assets/js/site-config.js` still contains `916303196195`.

### Task 2: Update the shared WhatsApp configuration

**Files:**
- Modify: `assets/js/site-config.js`

- [ ] **Step 1: Replace the three shared contact values**

Use these exact values while preserving the existing message text:

```js
whatsappNumber: "+91 99999 99999",
whatsappBaseHref: "https://wa.me/919999999999",
whatsappHref:
  "https://wa.me/919999999999?text=Hello%20Dr.%20Arunima%20Musthyala%2C%20I%20would%20like%20to%20know%20more%20about%20a%20consultation.",
```

- [ ] **Step 2: Run structural and syntax checks**

Run:

```powershell
node --check assets/js/site-config.js
node --check assets/js/forms.js
node --test tests/single-page.test.mjs
```

Expected: every command exits successfully and the complete test suite passes.

- [ ] **Step 3: Confirm no old live destination remains**

Run:

```powershell
rg -n "916303196195|63031 96195" index.html assets tests
```

Expected: no matches.

- [ ] **Step 4: Commit and push only the intended files**

```powershell
git add -- assets/js/site-config.js tests/single-page.test.mjs docs/superpowers/plans/2026-08-21-temporary-whatsapp-number.md
git commit -m "fix: update temporary WhatsApp number"
git push origin main
```

Expected: `main` is pushed successfully without adding the unrelated local logo source files.

