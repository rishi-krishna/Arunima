# Temporary WhatsApp Number Update

## Goal

Temporarily route every live WhatsApp action on the single-page website to `919999999999`.

## Scope

- Keep the phone number hidden from visible page content.
- Update the header WhatsApp link, the booking-section WhatsApp link, and the shared booking-form configuration.
- Preserve all existing pre-filled WhatsApp messages and same-page navigation behavior.
- Leave historical design and implementation documents unchanged because they describe earlier approved states.
- Do not modify or commit the unrelated local logo source files.

## Verification

- Search production files to confirm every live WhatsApp reference uses the current destination.
- Confirm the booking URL builder produces a `https://wa.me/919999999999?text=...` URL.
- Run the existing structural tests and JavaScript syntax checks.
