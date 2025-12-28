# Issues Log

## Active Issues

### [TEST-01] Playwright Verification Failures

- **Status**: Confirmed
- **Description**: Automated layout verification tests (`tests/layout_verification.spec.ts`) are failing.
- **Failures**: Sidebar anchoring (Test reports failure despite visual confirmation), Input interactibility.
- **Root Cause**: Likely hydration timing in headless mode. Manual verification confirms UI is functional.

### [UI-02] Chat Width Consistency

- **Status**: Monitoring
- **Description**: Chat area width varies slightly between pages; goal is a strict 1000px-1100px "Premium" width.
- **Action**: Enforced max-width in `ChatArea.vue`, awaiting regression test confirmation.

## Resolved Issues

- **[CRITICAL] Input Blocking**: `body::before` was overlaying the entire page. Fixed via `pointer-events: none`.
- **[Back-End] TTS Cleaning**: Supertonic engine crashed on `<` characters. Fixed via `_clean_text_for_tts`.
- **[Audio] NaN Display**: `AudioControl.vue` showed "NaN:NaN". Fixed via `Number.isFinite` guard.
