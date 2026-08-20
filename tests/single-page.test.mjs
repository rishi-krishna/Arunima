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
  assert.doesNotMatch(index, /bio-portrait--empty|article-card__media--empty|instagram-tile__media/);
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
