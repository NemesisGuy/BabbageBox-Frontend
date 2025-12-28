# BabbageBox Development Tasks

## Completed Phases

### Phase 1: Planning & Research ✅

### Phase 2: Implementation (Frontend & Backend) ✅

### Phase 3: Verification & Polish ✅

### Phase 4: Layout, TTS & Footer Hotfixes ✅

### Phase 5: Layout Stabilization & Audio Control Fixes ✅

- [x] Implement backend text-cleaning for TTS
- [x] Fix NaN and playback syncing in `AudioControls.vue`
- [x] Refactor `App.vue` for full-width sidebar anchoring
- [x] Apply 1200px max-width to individual view components
- [x] Verify fix with comprehensive browser audit

### Phase 6: Hotfixes & Stabilization ✅

- [x] Fix `body::before` blocking inputs (CSS `pointer-events: none`)
- [x] Fix "Unknown" model name (Updated `/api/config`)
- [x] Fix CORS errors (Hardened `CORSMiddleware`)
- [x] Verify functionality (Verified manually & unit tests passed)

### Phase 7: Responsive Refinement & Chat Profiles ✅

- [x] Fix model name not displayed (added fallback + unit tests)
- [x] Create Playwright visual regression tests
- [x] Audit Mobile/Tablet responsiveness (Playwright tests cover mobile viewport)
- [x] Implement Chat Profiles (Chat / Code / Anonymous)
- [x] Fix footer layout (removed `position: fixed`, now uses flexbox flow)
- [x] Final "Premium" Visual Polish
  - [x] Footer positioning rules verified via Playwright
  - [x] Footer is not sticky/fixed
  - [x] Footer flows naturally with content

---

## Test Coverage Summary

### Unit Tests (Vitest) - 11 passing

- `MainChat.spec.ts`: 6 tests (model name fallback, chat profiles, config fetching)
- `MemoryManager.spec.ts`: 5 tests (CRUD operations, delete functionality)

### E2E Tests (Playwright) - 9 passing

- Sidebar anchoring
- Chat area centering
- Input interactivity on all pages
- Audio controls (no NaN)
- CORS connectivity
- Mobile layout (iPhone 14)
- Footer positioning (not sticky/fixed)
- Footer visibility
- Model name display

---

## Future Phases

### Phase 8: Regression Protection & Operational Hardening

- [ ] Add Playwright viewport matrix (Desktop 1440x900, Tablet 768x1024, Mobile 375x667)
- [ ] Add slow-network simulation tests (chat streaming)
- [ ] Add empty-state & error-state UI tests
- [ ] Lock visual baselines (screenshots)
- [ ] DOM-level bounding box assertions for layout laws
- [ ] Add frontend error boundary (global fallback UI)
- [ ] Add user-visible error states (API down, timeout, 5xx)
- [ ] Add structured frontend logging (levels + context)
- [ ] Add backend request correlation IDs
- [ ] Verify graceful degradation when TTS fails
- [ ] Verify graceful degradation when model config fails

### Phase 9A: Tool Calling Foundations

- [ ] Define tool contract schema (inputs, outputs, errors)
- [ ] Implement tool execution timeout & sandboxing
- [ ] Add tool failure handling (partial success)
- [ ] Add tool invocation audit logging
- [ ] Integrate DuckDuckGo search via MCP
- [ ] Test tool calling with LLM responses

### Phase 9B: RAG Foundations

- [ ] Define document ingestion pipeline
- [ ] Define embedding versioning strategy
- [ ] Implement retrieval fallback when no context found
- [ ] Add relevance thresholding
- [ ] FAISS index management
- [ ] Memory-aware context injection

### Phase 10: Personas, Policy & Safety

- [ ] Implement persona prompt isolation
- [ ] Add persona-specific system instructions
- [ ] Prevent persona leakage across chats
- [ ] Add persona regression tests
- [ ] Verify persona behavior under tool calling
- [ ] Implement content moderation hooks

### Phase 11: Performance, Load & Cost Control

- [ ] Define latency budgets (UI, API, TTS)
- [ ] Measure cold vs warm start times
- [ ] Add Playwright performance assertions (basic)
- [ ] Add backend request timing metrics
- [ ] Implement rate limiting & abuse protection
- [ ] Add per-session / per-user limits
- [ ] Token usage tracking

### Phase 12: Release Discipline

- [ ] Semantic versioning
- [ ] Changelog generation
- [ ] Release tagging
- [ ] Rollback strategy
- [ ] Deployment documentation

---

## Current Status

| Category                  | Status                 |
| ------------------------- | ---------------------- |
| **Features**              | ✅ Complete            |
| **Visual Correctness**    | ✅ Complete            |
| **Test Coverage**         | ✅ Complete (20 tests) |
| **Operational Hardening** | ⏳ Phase 8 (Next)      |
| **Tool Calling / RAG**    | ⏳ Phase 9 (Future)    |

---

_Last Updated: 2025-12-28_
