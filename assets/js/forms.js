export function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}
export function validatePhone(value) {
  const normalized = String(value).replace(/[()\s-]/g, "");
  return /^(?:(?:\+?91))?[6-9]\d{9}$/.test(normalized);
}

function validateMarkedFields(form) {
  let valid = true;

  form.querySelectorAll("[data-validate]").forEach((field) => {
    const validator = field.dataset.validate === "phone" ? validatePhone : validateEmail;
    const message =
      field.dataset.validate === "phone"
        ? "Enter a valid 10-digit Indian mobile number."
        : "Enter a complete email address.";
    field.setCustomValidity(field.value && !validator(field.value) ? message : "");
    if (!field.checkValidity()) valid = false;
  });

  return valid;
}

export function initForms(root = document) {
  root.querySelectorAll("[data-static-form]").forEach((form) => {
    if (form.dataset.formReady === "true") return;
    form.dataset.formReady = "true";

    form.querySelectorAll("[data-validate]").forEach((field) => {
      field.addEventListener("input", () => {
        field.setCustomValidity("");
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = form.querySelector("[data-form-status]");
      const markedFieldsValid = validateMarkedFields(form);

      if (!markedFieldsValid || !form.reportValidity()) {
        if (status) status.textContent = "Please review the highlighted fields.";
        return;
      }

      if (status) {
        status.textContent = "Demo complete — no information was transmitted or stored.";
      }
      form.reset();
    });
  });
}
