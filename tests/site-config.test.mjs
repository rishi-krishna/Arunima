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
