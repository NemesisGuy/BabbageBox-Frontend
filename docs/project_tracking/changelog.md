# Project Changelog

## [Phase 6] Hotfixes & Stabilization (2025-12-27)

### Fixed

- **UI Blocking**: Resolved `body::before` overlay blocking inputs by adding `pointer-events: none` to the background glow elements in `style.css`.
- **Model Identification**: Updated `/api/config` to return the `current_model` filename, ensuring the chat UI displays the active model instead of "Unknown".
- **CORS Issues**: Hardened `CORSMiddleware` in `main.py` to explicitly allow `localhost:5173` and valid headers, resolving frequent network errors.
- **Audio Controls**: Fixed "NaN" duration display in `AudioControls.vue` by adding `Number.isFinite` checks and better state synchronization with the `HTMLAudioElement`.
- **TTS Generation**: Implemented a backend text-cleaning helper `_clean_text_for_tts` to strip unsupported characters (`<`, `=`, `{`) that were causing Supertonic engine failures.

### Changed

- **Layout Architecture**:
  - Refactored `App.vue` to remove global `max-width: 1200px`, enabling full-width layouts.
  - Anchored `AppSidebar.vue` to the viewport edge (`left: 0`).
  - Applied centered 1200px constraints to `MainChat.vue` and `ChatArea.vue` individually.
  - Switched from `height: 100vh` to `min-height: 100vh` for natural document scrolling.

### Added

- **Project Tracking**: Created `docs/project_tracking` to store agent artifacts (`task.md`, `implementation_plan.md`) for build postmortems.
