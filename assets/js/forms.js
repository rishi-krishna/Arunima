import { clinic } from "./site-config.js?v=20260821g";

export function buildWhatsAppBookingUrl(values) {
  const lines = [
    "Hello Dr. Arunima Musthyala, I would like to request a consultation.",
    "",
    `Name: ${values.name}`,
    `Consultation: ${values.appointmentType}`,
    `Primary concern: ${values.condition}`,
    `Preferred date: ${values.preferredDate}`,
    `Preferred time: ${values.preferredTime}`,
  ];

  if (values.note) lines.push(`Brief note: ${values.note}`);
  lines.push(
    "",
    "Please confirm availability. I understand this request is not confirmed and WhatsApp is not an emergency service.",
  );

  return `${clinic.whatsappBaseHref}?text=${encodeURIComponent(lines.join("\n"))}`;
}

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

      const values = Object.fromEntries(new FormData(form).entries());
      const bookingUrl = buildWhatsAppBookingUrl(values);
      const fallback = form.querySelector("[data-whatsapp-fallback]");

      if (fallback) {
        fallback.href = bookingUrl;
        fallback.hidden = false;
      }
      if (status) {
        status.textContent =
          "Your request is ready. Continue in WhatsApp to send it to Dr. Arunima.";
      }
      window.location.assign(bookingUrl);
    });
  });
}
