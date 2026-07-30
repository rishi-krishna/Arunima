import test from "node:test";
import assert from "node:assert/strict";
import { validateEmail, validatePhone } from "../assets/js/forms.js";

test("email validation accepts complete addresses and rejects incomplete values", () => {
  assert.equal(validateEmail("patient@example.com"), true);
  assert.equal(validateEmail(" patient@example.com "), true);
  assert.equal(validateEmail("patient@"), false);
  assert.equal(validateEmail("patient example.com"), false);
});
test("Indian phone validation accepts common formats and rejects invalid numbers", () => {
  assert.equal(validatePhone("+91 98765 43210"), true);
  assert.equal(validatePhone("9876543210"), true);
  assert.equal(validatePhone("98765-43210"), true);
  assert.equal(validatePhone("123"), false);
  assert.equal(validatePhone("5876543210"), false);
});
