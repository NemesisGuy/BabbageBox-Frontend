# Implementation Plan: Layout & Audio Stabilization

Fix critical regressions in sidebar positioning, TTS character encoding, and audio playback controls.

## Proposed Changes

### [Backend] [MODIFY] [main.py](file:///c:/Users/Reign/Documents/Python%20Projects/BabbageBox/Babbagebox-Backend/app/main.py)

Implement a text-cleaning helper to sanitize LLM replies before sending them to the Supertonic TTS engine.

- Strip problematic characters: `<`, `>`, `{`, `}`, `=`, `[`, `]`.
- Ensure plain text is passed to `tts.synthesize`.

### [Frontend] [MODIFY] [App.vue](file:///c:/Users/Reign/Documents/Python%20Projects/BabbageBox/Babbagebox-Frontend/src/App.vue)

Refactor the main layout to allow the sidebar to anchor to the viewport edge.

- Move `max-width: 1200px` from `.content-container` into individual view components.
- Allow `.premium-main` to take full width.

### [Frontend] [MODIFY] [MainChat.vue](file:///c:/Users/Reign/Documents/Python%20Projects/BabbageBox/Babbagebox-Frontend/src/components/MainChat.vue)

- Adjust `.chat-container` to handle the full-width layout.
- Ensure the sidebar stays anchored to the left.
- Fix any remaining visibility issues with the audio player.

### [Frontend] [MODIFY] [AudioControls.vue](file:///c:/Users/Reign/Documents/Python%20Projects/BabbageBox/Babbagebox-Frontend/src/components/AudioControls.vue)

- Already patched for NaN and state syncing.
- Ensure `fixed` positioning is robust and centered.

### [Frontend] [MODIFY] [MemoryManager.vue](file:///c:/Users/Reign/Documents/Python%20Projects/BabbageBox/Babbagebox-Frontend/src/components/MemoryManager.vue), [McpSearch.vue](file:///c:/Users/Reign/Documents/Python%20Projects/BabbageBox/Babbagebox-Frontend/src/components/McpSearch.vue), [SupertonicPlayground.vue](file:///c:/Users/Reign/Documents/Python%20Projects/BabbageBox/Babbagebox-Frontend/src/components/SupertonicPlayground.vue), [LogsViewer.vue](file:///c:/Users/Reign/Documents/Python%20Projects/BabbageBox/Babbagebox-Frontend/src/components/LogsViewer.vue)

- Add `max-width: 1200px; margin: 0 auto;` to their root containers to maintain the centered premium look on desktop, now that `App.vue` is full width.
- Verify `pointer-events` to ensure no overlays block clicks.

## Verification Plan

### Automated Browser Verification

1.  **Sidebar Anchor**: Use browser subagent to verify sidebar `getBoundingClientRect().left` is near 0 (or at the edge of the screen).
2.  **TTS Character Fix**: Send a prompt that usually includes metrics (e.g., "Tell me a joke") and verify `[DEBUG] Playing audio` appears in logs without character errors.
3.  **Input Responsiveness**: Click and type on Search and Playground pages.
4.  **Audio Controls**: Verify seek bar shows real numbers (not NaN) and play/pause toggles correctly.

### Manual Verification

- Review visual aesthetics on wide screen vs mobile.
