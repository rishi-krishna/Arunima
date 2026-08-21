import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const index = readFileSync(join(root, "index.html"), "utf8");
const components = readFileSync(join(root, "assets/js/components.js"), "utf8");
const styles = readFileSync(join(root, "assets/css/styles.css"), "utf8");
const main = readFileSync(join(root, "assets/js/main.js"), "utf8");
const forms = readFileSync(join(root, "assets/js/forms.js"), "utf8");
const interactions = readFileSync(join(root, "assets/js/interactions.js"), "utf8");

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
  assert.doesNotMatch(index, /bio-portrait--empty|article-card__media--empty|instagram-tile__media/);
  for (const route of ["about/", "book-appointment/", "blog/", "contact/", "patient-stories/", "pricing/", "research/", "treatments/"]) {
    assert.doesNotMatch(index, new RegExp(`href=["']${route}`, "i"));
  }
});

test("shared header contains no menu or drawer", () => {
  assert.doesNotMatch(components, /mobile-toggle|mobile-drawer|primaryRoutes|treatmentRoutes|nav-menu/);
  assert.match(components, /href="#consultation-booking"/);
});

test("shared branding uses the supplied transparent Nirmaya PNG", () => {
  const productionLogo = join(root, "assets/images/nirmaya-logo-mark-transparent.png");
  assert.equal(existsSync(productionLogo), true);
  const digest = createHash("sha256")
    .update(readFileSync(productionLogo))
    .digest("hex");

  assert.equal(
    digest,
    "3881bd78339b5ef32e66567c4d9a29ad6cc0294c16f103b86c7e8a31adc52346",
  );
  const bytes = readFileSync(productionLogo);
  assert.equal(bytes.toString("ascii", 1, 4), "PNG");
  assert.equal(bytes[25], 6);
  assert.match(index, /href="assets\/images\/nirmaya-logo-mark-transparent\.png" type="image\/png"/);
  assert.match(
    components,
    /<img src="assets\/images\/nirmaya-logo-mark-transparent\.png" alt="" width="54" height="36">/,
  );
  assert.doesNotMatch(`${index}\n${components}`, /logo-mark\.svg|nirmaya-logo-mark\.jpeg/);
});

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

test("production entry assets share the current cache version", () => {
  const sources = [index, main, components, forms, interactions];
  for (const source of sources) {
    assert.doesNotMatch(source, /20260821[bc]/);
  }
  assert.match(index, /styles\.css\?v=20260821d/);
  assert.match(index, /main\.js\?v=20260821d/);
  for (const source of [main, components, forms, interactions]) {
    assert.match(source, /20260821d/);
  }
});

test("header name keeps the softened logo teal in both themes", () => {
  const headerTokenMatches =
    styles.toLowerCase().match(/--header-foreground:\s*#23666b/g) ?? [];
  assert.equal(headerTokenMatches.length, 2);
  assert.match(
    styles,
    /\.site-brand\s*\{[\s\S]*?color:\s*var\(--header-foreground\)/,
  );
});

test("valid booking uses same-page WhatsApp navigation", () => {
  assert.match(forms, /window\.location\.assign\(bookingUrl\)/);
  assert.doesNotMatch(forms, /window\.open\(bookingUrl/);
  assert.match(forms, /fallback\.href = bookingUrl/);
  assert.match(forms, /fallback\.hidden = false/);
});

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

test("index is the only public content page", () => {
  const contentPages = htmlFiles(root).filter((file) => file !== "404.html").sort();
  assert.deepEqual(contentPages, ["index.html"]);
});
