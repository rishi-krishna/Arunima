# Remove Obsolete Number From Current Repository Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the superseded WhatsApp number from every file in the current repository while preserving the current destination and ordinary Git history.

**Architecture:** Historical specifications and plans remain in place but their contact examples are aligned with the current destination. The structural test validates the complete set of WhatsApp destinations instead of storing a literal copy of the superseded number.

**Tech Stack:** Markdown, static HTML, JavaScript ES modules, Node.js built-in test runner, Git.

---

### Task 1: Clean retained documentation

**Files:**
- Modify: `docs/superpowers/plans/*.md`
- Modify: `docs/superpowers/specs/*.md`

- [ ] **Step 1: Replace superseded contact examples**

For historical examples that require a concrete destination, use:

```text
https://wa.me/919999999999
```

For negative checks or prose describing the earlier value, replace the literal value with the phrase `superseded WhatsApp destination` so the document remains logically correct.

- [ ] **Step 2: Search documentation for the superseded value**

Build the compact and formatted search strings from fragments in PowerShell, then search `docs` with `rg`.

Expected: no matches.

### Task 2: Remove the superseded test literal

**Files:**
- Modify: `tests/single-page.test.mjs`

- [ ] **Step 1: Replace the literal negative assertions**

Use destination-set validation:

```js
const whatsappNumbers = [...`${index}\n${siteConfig}`.matchAll(/wa\.me\/(\d+)/g)]
  .map((match) => match[1]);
assert.ok(whatsappNumbers.length >= 3);
assert.deepEqual(new Set(whatsappNumbers), new Set(["919999999999"]));
```

Keep the existing assertions for `whatsappNumber` and `whatsappBaseHref` so the formatted field and shared base URL remain covered.

- [ ] **Step 2: Run the structural test**

Run:

```powershell
node --test tests/single-page.test.mjs
```

Expected: all tests pass.

### Task 3: Verify and publish the cleanup

**Files:**
- Modify: documentation and test files identified above
- Create: `docs/superpowers/plans/2026-08-21-remove-obsolete-number.md`

- [ ] **Step 1: Search every tracked file and working-tree file**

Construct the superseded compact and formatted values from string fragments, then run both `git grep` and `rg` across the repository.

Expected: both searches return no matches.

- [ ] **Step 2: Run syntax and repository checks**

```powershell
node --check assets/js/main.js
node --check assets/js/components.js
node --check assets/js/interactions.js
node --check assets/js/forms.js
node --check assets/js/site-config.js
node --test tests/single-page.test.mjs
git diff --check
```

Expected: every command exits successfully.

- [ ] **Step 3: Commit and push only intended files**

```powershell
git add -- docs tests/single-page.test.mjs
git commit -m "docs: remove obsolete WhatsApp number"
git push origin main
```

Expected: `main` advances normally, with no force push and without adding the unrelated logo source files.

