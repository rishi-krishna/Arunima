import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

export const routes = [
  "index.html",
  "404.html",
  "about/index.html",
  "adenoid-treatment/index.html",
  "allergy-treatment/index.html",
  "approach/index.html",
  "book-appointment/index.html",
  "case-studies/index.html",
  "contact/index.html",
  "hair-loss-treatment/index.html",
  "my-journey/index.html",
  "patient-reviews/index.html",
  "patient-stories/index.html",
  "pcod-treatment/index.html",
  "pricing/index.html",
  "privacy-policy/index.html",
  "research/index.html",
  "skin-treatment/index.html",
  "teleconsultation-policy/index.html",
  "terms-of-service/index.html",
  "thyroid-treatment/index.html",
  "treatments/index.html",
  "why-choose-us/index.html",
  "why-homeopathy/index.html",
  "blog/index.html",
  "blog/best-homeopathy-clinic-kukatpally-kphb-hyderabad-guide/index.html",
  "blog/homeopathy-for-allergic-rhinitis/index.html",
  "blog/how-to-boost-your-immunity-naturally/index.html",
  "blog/managing-eczema-in-children-with-homeopathy/index.html",
  "blog/menopause-homeopathic-treatment-clinical-study/index.html",
  "blog/truth-about-steroids-in-skin-treatment/index.html",
  "blog/understanding-pcos-and-homeopathy/index.html",
  "locations/index.html",
  "locations/gachibowli/index.html",
  "locations/kondapur/index.html",
  "locations/kphb/index.html",
  "locations/kukatpally/index.html",
  "locations/madhapur/index.html",
  "locations/miyapur/index.html",
  "locations/moosapet/index.html",
];

test("the complete public route manifest exists", () => {
  assert.equal(routes.length, 40, "Update the expected route count with the manifest");
  for (const route of routes) {
    assert.ok(existsSync(route), `Missing route document: ${route}`);
  }
});
