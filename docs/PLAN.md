# Episodic App — Build Plan (Source of Truth)

## Goal

Episodic is series-first. Primary object is **Show**; uploads are **Episodes** (not posts).

## Product Vision

Episodic should feel like “streaming-first + creator studio”:

- Viewers discover and watch **shows**, not random posts.
- Creators build **seasons/episodes**, with drafts, trailers, and publish gates.
- Discovery is **curated-first for v1** (no fully-open UGC discovery chaos).

## Differentiators

- Series mechanics: seasons/episodes, “Previously on…”, “Next episode drops in…”, cliffhanger/hook templates.
- Collaboration: Writers room for co-creators, drafts, scene stitching in order.
- Interactive storytelling: polls/choices influence what gets made next.
- Algorithm controls: user-tunable feed preferences (more comedy / less politics / local creators / new shows only).
- Monetization tied to shows: season passes + tipping per show (not only per creator).

---

## Workflow Rules

- Each step MUST define:
  1. **Surface Area**
  2. **Acceptance Criteria**
  3. **In-App Verification**
  4. **Guardrails / Must Not Change**
  5. **Build Gates**
- Use a Copilot prompt with guardrails:
  - what to change
  - what must NOT change (exports, routes, existing hook behavior, contracts)
- Implement + run the app.
- Prove changes with:
  - `npx tsc --noEmit`
  - `npm run lint`
- Respond with: ✅ Pass — Phase X Step NN, or ❌ Fail — Phase X Step NN + error/output.
- After every ✅ Pass: update the **Progress Log** in this file.

### Multi-file Rule (Updated)

We can edit multiple files in a step **when the step explicitly requires it**, but:

- The step must list intended surfaces (UI/state/routes/contracts).
- The step must still be “finishable” in one cycle without leaving loose ends.

---

## Guardrails (Non-Negotiable)

- Episode must belong to a Show (optional Season). **No orphan episodes.**
- Show Hub must render a canonical episode list for a show (not assembled from a single feed bucket).
- Feed contracts remain stable once introduced:
  - `EpisodeWithShow` includes show + episode identifiers and S/E numbers.
- Specials:
  - Allowed as secondary content; not part of a Show
  - Must attach to at least one Show or Topic (recap, trailer, BTS, Q&A).
- Continue Watching is a resume pointer:
  - **one entry per show**, target episode.
- Show eligibility for public feeds:
  - User-created shows do not appear in public feeds until at least one publish (episode OR trailer).

### Creation + Discoverability Rules (v1)

- Created shows are “owned” and appear immediately in **My Studio** without restart.
- Library sections are explicit and separate:
  - **Created Shows**
  - **Followed Shows**
  - **Saved Shows**
  - (Continue Watching entrypoint if present)
- Curated-only discovery for now:
  - Topics/curation drive discovery surfaces in v1.
- Trailer rule:
  - Trailer is a publish type for a brand-new show
  - Trailer unlocks feed eligibility
  - Trailer does NOT consume Episode numbering (Episode 1 should still be Episode 1)

---

## Ready-to-Ship Definition (v1)

- BOTH platforms
- Supabase backend/auth
- Mux video
- Sentry
- EAS release

Monetization is OPTIONAL for v1 (Phase 4 can be post-launch).

### Ship Gates Checklist

a) Auth + route gating working  
b) Real backend read/write for shows/episodes  
c) Mux upload + playback works on-device  
d) Crash reporting wired (Sentry)  
e) No unmatched routes; smoke checklist passes  
f) EAS build+submit ready for iOS+Android

---

## Production Readiness Workstreams (Required for v1)

### Phase P0 — Environment & Config

**Step P0-01: Env vars strategy (app.config + EAS secrets), dev/stage/prod configs**

- Surface Area:
  - Config: `app.config.*` / `app.json`, EAS config, `.env*` strategy (dev only)
  - Runtime: feature flags + API base URL + Mux/Sentry keys + Supabase keys
  - Docs: list of env vars + where set
- Acceptance Criteria:
  - Canonical env var list exists in plan (or a dedicated doc referenced from plan) including:
    - name, purpose, required/optional, default, where set (local vs EAS secret), and which profiles use it.
  - EAS profiles: dev / preview / production have correct values and no missing runtime keys.
  - App boots without “missing env” errors in all profiles.
  - No secrets committed to git.
- In-App Verification:
  - Run app in dev profile: app boots to tabs, no env errors.
  - Run preview/prod build (or simulate config): app boots, no env errors.
- Guardrails / Must Not Change:
  - Do not change routes, feed contracts, or auth flow behaviors.
  - Do not introduce hard-coded secrets into source.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`
  - EAS config validation (if applicable to current workflow)

**Step P0-02: Feature flags to switch mocks → real API**

- Surface Area:
  - State/config: feature flag source (env-based) and runtime behavior
  - Data layer: mock API clients vs real API clients
  - Screens: feeds/show hub/topic hub should not change routes based on flag
- Acceptance Criteria:
  - Single, documented flag toggles data source: mock vs real.
  - Default behavior:
    - dev: mock (unless explicitly flipped)
    - prod: real (once backend is ready)
  - Flipping flag does not change navigation/routes or UI structure—only the data source.
  - Clear fallback behavior if real API fails (error UI, no crash).
- In-App Verification:
  - With flag “mock”: app loads curated feeds and show hubs from mock data.
  - With flag “real”: app attempts real calls; if not wired yet, it fails gracefully with clear messaging.
- Guardrails / Must Not Change:
  - Do not change feed item contract shapes once introduced.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

### Phase P1 — Observability

**Step P1-01: Sentry wired (errors + basic performance)**

- Surface Area:
  - App bootstrap/init
  - Error boundary / global handlers
  - Optional: basic navigation/performance instrumentation
- Acceptance Criteria:
  - Sentry captures:
    - unhandled JS errors
    - explicit “captureException” call
  - Basic performance tracing is enabled (minimal baseline).
  - Environment tagging (dev/preview/prod) is correct.
- In-App Verification:
  - Trigger a test error path (dev-only) → confirm event appears in Sentry project.
- Guardrails / Must Not Change:
  - No PII in error payloads; avoid logging auth tokens.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step P1-02: Logging conventions (no PII)**

- Surface Area:
  - Logging helper (levels + formatting)
  - Places where logs exist (network, auth, upload, playback)
- Acceptance Criteria:
  - Standard logger helper exists; docs for “what is allowed to log”.
  - Explicit “no PII” guidance: no emails, tokens, session strings.
  - Any existing logs are aligned to helper (when touched).
- In-App Verification:
  - Run key flows; logs appear at expected levels; no sensitive data present.
- Guardrails / Must Not Change:
  - Do not spam logs in production builds; keep noise minimal.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

### Phase P2 — Backend & Auth (Supabase)

**Step P2-01: Supabase project setup (dev + prod) + RLS baseline plan**

- Surface Area:
  - Supabase projects/environments
  - Schema/RLS plan doc + initial tables (if created here)
- Acceptance Criteria:
  - Two environments defined (separate projects or env separation).
  - RLS baseline documented: who can read what (published vs drafts), who can write what (owner).
  - Connectivity works from app for both envs (once auth integrated).
- In-App Verification:
  - App can reach Supabase endpoint (no auth yet required if this step is doc-only; otherwise include a simple ping).
- Guardrails / Must Not Change:
  - Do not break mock mode; feature flag remains functional.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step P2-02: Supabase Auth integrated (session persistence + logout)**

- Surface Area:
  - Auth client
  - Auth UI shell (unauth vs authed)
  - Secure storage/session restore
- Acceptance Criteria:
  - Session persists across app relaunch.
  - Logout clears session + returns to unauth routes.
  - Token storage uses a secure mechanism appropriate for platform.
- In-App Verification:
  - Login → kill app → relaunch → still logged in.
  - Logout → relaunch → remains logged out.
- Guardrails / Must Not Change:
  - Do not rename routes; keep stable navigation helpers.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step P2-03: API client uses auth token; 401 handling**

- Surface Area:
  - API client wrapper
  - 401 behavior (refresh or logout)
  - UI error handling
- Acceptance Criteria:
  - Auth token is attached to authenticated requests.
  - 401 triggers predictable behavior:
    - refresh if supported; otherwise logout + message.
  - No infinite retry loops.
- In-App Verification:
  - Simulate 401 (mock or forced) → user is routed appropriately, no crash.
- Guardrails / Must Not Change:
  - Do not alter existing data contracts; wrap calls cleanly.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

### Phase P3 — Release

**Step P3-01: EAS build profiles + versioning**

- Surface Area:
  - EAS config + build profiles
  - Versioning strategy doc
- Acceptance Criteria:
  - dev/preview/prod profiles configured for iOS + Android.
  - Versioning strategy defined (build number + app version).
  - Builds succeed.
- In-App Verification:
  - Install preview build on device; app boots and navigates.
- Guardrails / Must Not Change:
  - No debug-only flags in prod profile by default.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`
  - EAS build succeeds (both platforms)

**Step P3-02: iOS App Store submission checklist**

- Surface Area:
  - Docs/checklist + required assets list
- Acceptance Criteria:
  - Checklist includes required screenshots, privacy details, test accounts, and submission steps.
- In-App Verification:
  - Internal review run: checklist is complete and actionable.
- Guardrails / Must Not Change:
  - No claims about features not implemented.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step P3-03: Android Play Console setup checklist**

- Surface Area:
  - Docs/checklist + required assets list
- Acceptance Criteria:
  - Checklist includes required assets, testing tracks, and release steps.
- In-App Verification:
  - Internal review run: checklist is complete and actionable.
- Guardrails / Must Not Change:
  - No claims about features not implemented.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

---

# Phases

## Phase 0 — Baseline & Guardrails

**Step 0-01: Project scaffold (Expo + router) + basic tabs**

- Acceptance Criteria: app boots, tabs render, no red screens.
- Verification: run app on iOS simulator/device.

**Step 0-02: Route conventions + safe navigation helpers (avoid unmatched routes)**

- Acceptance Criteria: consistent route naming; no unmatched route errors.
- Verification: smoke navigation across main routes.

**Step 0-03: Baseline smoke checklist documented (Home → Show → Episode)**

- Acceptance Criteria: checklist exists and is used.
- Verification: run checklist once and record.

### Smoke Checklist (Updated)

- Home feed → tap show → show hub opens
- Show hub → tap episode → episode detail opens
- Follow a show → Library shows it → open it
- Toggle Following/Discovery → relaunch → persists
- Tap topic chip → topic hub shows content
- Vote on poll → placeholder updates → relaunch persists
- Add comment → relaunch persists

**Step 0-04: Lint + TypeScript baseline (tsc/lint must pass)**

- Acceptance Criteria: `tsc` + `lint` pass.
- Verification: run commands.

**Step 0-05: API mock layer introduced (feed + mixed feed stubs)**

- Acceptance Criteria: app can run entirely from mocks.
- Verification: disable network and still render feeds.

**Step 0-06: Step protocol locked (Pass must include Phase/Step)**

- Acceptance Criteria: every completion uses standard format.
- Verification: process adherence.

---

## Phase 1 — ShowFeed Engine

**Step 1-01: Feed boundary + multi-feed types wired to UI**

- Acceptance Criteria:
  - Feed supports multiple types (local/new/etc.) without breaking UI.
- Verification:
  - Switch feed types; no crashes.

**Step 1-02: Show hub route + episode list by show**

- Acceptance Criteria:
  - `/show/[id]` renders a stable show hub and episode list.
- Verification:
  - Navigate to show hub from feed.

**Step 1-03: Episode route + previous/up-next + S/E badge + next drop placeholder**

- Acceptance Criteria:
  - `/episode/[id]` renders; has placeholder sections.
- Verification:
  - Navigate show → episode.

**Step 1-04: Specials: mixed feed + special route + special→show**

- Acceptance Criteria:
  - Special content renders and links to show.
- Verification:
  - Tap special in feed → routes resolve.

**Step 1-05: Special→Topic navigation + Topic route**

- Acceptance Criteria:
  - Special links to topic; topic renders.
- Verification:
  - Tap special topic chip → topic page.

**Step 1-06: Topic→Special navigation (topic rows navigate to /special/[id])**

- Acceptance Criteria:
  - Topic special list items open special.
- Verification:
  - Tap topic special row.

**Step 1-07: Topic→Show navigation from Attached Shows list**

- Acceptance Criteria:
  - Topic attached shows open show hubs.
- Verification:
  - Tap attached show.

**Step 1-08: Topic hub: episode rows navigate to /episode/[id]**

- Acceptance Criteria:
  - Topic episode rows open episode.
- Verification:
  - Tap topic episode row.

**Step 1-09: Show Hub surfaces specials + episodes cleanly**

- Acceptance Criteria:
  - Specials section and Episodes section both present and navigable.
- Verification:
  - Show hub has both sections; tap items.

**Step 1-10: Ensure topic has attached shows (derive from specials)**

- Acceptance Criteria:
  - Topics derive attached shows reliably.
- Verification:
  - Topic shows list is not empty when specials attach.

**Step 1-11: Navigation from topic attached shows to show hubs**

- Acceptance Criteria:
  - Works consistently (no unmatched routes).
- Verification:
  - Tap several shows.

**Step 1-12: Continue Watching feed type support (resume pointer semantics)**

- Acceptance Criteria:
  - One entry per show, points to episode.
- Verification:
  - Resume takes user to correct episode/show.

**Step 1-13: Season-based grouping in show hub**

- Acceptance Criteria:
  - Show hub groups episodes by season.
- Verification:
  - Season headers appear.

**Step 1-14: Show Hub season headers tappable collapse/expand**

- Acceptance Criteria:
  - Headers expand/collapse without losing ordering.
- Verification:
  - Tap headers.

**Step 1-15: Show Hub entrypoint polish: highlight + scroll to current episode when episodeId provided**

- Acceptance Criteria:
  - With episodeId param, list scrolls and highlights.
- Verification:
  - Deep-link into show hub.

**Step 1-16: Continue Watching deep-link into show hub with highlight/scroll target**

- Acceptance Criteria:
  - Continue Watching opens show hub to correct episode.
- Verification:
  - Tap continue watching item.

**Step 1-17: Add "New Shows Only" feed type support**

- Acceptance Criteria:
  - One item per show; no duplicates.
- Verification:
  - Feed shows unique shows.

**Step 1-18: Canonical show-centric API: `getShowEpisodes(showId)`**

- Acceptance Criteria:
  - Canonical list returned for show.
- Verification:
  - Function used by show hub.

**Step 1-19: Show hub uses `getShowEpisodes(showId)` (no feed-pool assembly)**

- Acceptance Criteria:
  - Show hub episode list is not derived from feed buckets.
- Verification:
  - Code audit confirms data source.

**Step 1-20: Canonical contract hardening (normalize S/E numbers; stable sorting)**

- Acceptance Criteria:
  - Sorting stable across reloads; S/E normalized.
- Verification:
  - Refresh multiple times; order stable.

**Step 1-21: Continue Watching semantics hardening**

- Acceptance Criteria:
  - One resume entry per show; updates replace.
- Verification:
  - Watch multiple episodes; continue watching remains one per show.

**Step 1-22: Show Hub “Up Next” logic uses canonical list**

- Acceptance Criteria:
  - Next episode computed from canonical list.
- Verification:
  - Open an episode mid-season; up-next correct.

**Step 1-23: “Previously on…” placeholder section (data shape + UI stub)**

- Acceptance Criteria:
  - UI stub exists; data shape stable.
- Verification:
  - No crashes; section renders.

**Step 1-24: “Next episode drops in…” placeholder (data shape + UI stub)**

- Acceptance Criteria:
  - UI stub exists; date placeholder stable.
- Verification:
  - Section renders.

**Step 1-25: Algorithm controls v1 (local toggles affect feed selection; no ranking yet)**

- Acceptance Criteria:
  - Toggles filter feed types deterministically.
- Verification:
  - Toggle changes feed selection.

**Step 1-26: Topic hub v2 (shows + episodes aggregated discovery view)**

- Acceptance Criteria:
  - Topic page aggregates show + episodes consistently.
- Verification:
  - Topic renders both lists.

**Step 1-27: Search stub (UI + mock results for shows/topics)**

- Acceptance Criteria:
  - Search input filters; results navigate.
- Verification:
  - Search + tap show/topic.

**Step 1-28: Writers Room entrypoints (routes/UI stubs from show hub)**

- Acceptance Criteria:
  - Show hub exposes writers room entrypoints.
- Verification:
  - Tap entrypoint; route resolves.

**Step 1-29: Performance pass (FlatList keys, memo boundaries)**

- Acceptance Criteria:
  - No key warnings; minimal rerenders on toggles.
- Verification:
  - Console clean; scroll smooth.

**Step 1-30: Phase 1 hardening sweep**

- Acceptance Criteria:
  - No unmatched routes; smoke checklist updated.
  - `tsc` + `lint` pass.
- Verification:
  - Run commands and checklist.

---

## Phase 2 — Capture & Creation

**Step 2-01: Creator entrypoint: “Create Episode” routes to capture flow (UI only)**

- Acceptance Criteria:
  - If launched from show hub: carries `showId`.
  - If launched globally: requires show picker before continuing.
- Verification:
  - Test both entrypoints.

**Step 2-01b: Remove “Create Episode” entrypoint from Library**

- Acceptance Criteria:
  - Library remains viewer-only (except Created/Followed/Saved sections).
- Verification:
  - No create CTA inside Library.

**Step 2-01c: Creator entrypoint must be from Show Hub OR Studio; enforce no orphan episodes**

- Acceptance Criteria:
  - No flow allows creating draft without showId.
  - Create tab routes into create flow (not show hub) when intent is create.
- Verification:
  - Attempt create without show; blocked or picker shown.

**Step 2-02: Capture screen scaffold (permissions + placeholder record UI)**

- Acceptance Criteria:
  - Permissions request; scaffold UI for capture exists.
- Verification:
  - Deny/allow permissions; app stable.

**Step 2-03: Upload pipeline stub (mock upload; progress + retry)**

- Acceptance Criteria:
  - Mock upload supports progress + retry UI.
- Verification:
  - Trigger retry; progress updates.

**Step 2-04: Drafts v1 (save draft metadata locally; list drafts)**

- Acceptance Criteria:
  - Draft includes title + season + episode number.
  - Draft appears in drafts list.
- Verification:
  - Create draft; reopen list.

**Step 2-04b: Draft appears in Show Hub episode list**

- Acceptance Criteria:
  - Draft stored keyed by showId.
  - Draft appears in correct show hub.
- Verification:
  - Create draft; go to show hub; see draft.

**Step 2-04c: Draft resume restores title/hook/previously-on/next-drop**

- Acceptance Criteria:
  - Tapping draft returns to create episode with pre-filled fields.
  - Updates persist when navigating away/back.
- Verification:
  - Edit draft; back out; reopen; state retained.

**Step 2-05: Cliffhanger/hook templates v1**

- Acceptance Criteria:
  - Select template; store on draft.
- Verification:
  - Reopen draft; template still selected.

**Step 2-06: Scheduling v1 (“next drop” date stored on episode)**

- Acceptance Criteria:
  - Select date; stored on draft/published episode.
- Verification:
  - Reopen; date retained.

**Step 2-07: “Previously on” builder v1**

- Acceptance Criteria:
  - Select prior episodes; stored on draft.
- Verification:
  - Reopen; selections retained.

**Step 2-08: Background upload safety v1**

- Acceptance Criteria:
  - Upload resumes when app returns.
- Verification:
  - Background app mid-upload; return; continues.

**Step 2-09: Create Show flow v1 (title + topic selection)**

- Acceptance Criteria:
  - Create show with title and topic.
- Verification:
  - Create show; navigate to show hub.

**Step 2-09b-a: Creator store (Zustand) introduced**

- Acceptance Criteria:
  - Single source of truth for created shows.
- Verification:
  - Create show updates store immediately.

**Step 2-09b-b: Create Show + Studio list wired to store**

- Acceptance Criteria:
  - Show appears in Studio without restart.
- Verification:
  - Create show; see it instantly.

**Step 2-09c: My Studio v1 polish (professional layout + no VirtualizedList nesting warnings)**

- Acceptance Criteria:
  - Clean layout, spacing, empty states.
  - No VirtualizedList nesting warnings.
- Verification:
  - Console clean; scroll smooth.

**Step 2-09d: Library “Created Shows” section separate from Saved Shows**

- Acceptance Criteria:
  - Library sections: Created Shows + Saved Shows.
  - Navigation works from both.
- Verification:
  - Tap created show; opens show hub.

**Step 2-10: Episode publish v1 (draft → published; appears in show hub)**

- Acceptance Criteria:
  - Publish converts draft to published and visible.
- Verification:
  - Publish; show hub lists published.

**Step 2-10a: Trailer creation/publish as special episode type**

- Acceptance Criteria:
  - Trailer publishes as `trailer` type.
  - Trailer does not increment Episode numbering.
  - Trailer is labeled “Trailer” and may optionally display “(for Episode X)”.
- Verification:
  - Create trailer then Episode 1 → Episode remains Episode 1.

**Step 2-10b: Publish gating enforced (showId selected + title non-empty)**

- Acceptance Criteria:
  - Cannot publish without showId and title.
- Verification:
  - Try publish with missing fields; blocked.

**Step 2-10c: Feed eligibility enforced**

- Acceptance Criteria:
  - Created shows appear in public feeds only after first publish (episode or trailer).
  - Titles persist in feed cards; no duplicates.
- Verification:
  - Create show only → not in public feed.
  - Publish trailer → now eligible and appears correctly.

**Step 2-11: Media playback reliability pass**

- Acceptance Criteria:
  - Buffer/loading states; no crashes.
- Verification:
  - Play multiple episodes; background/foreground.

**Step 2-12: Creator QA smoke run**

- Acceptance Criteria:
  - Create show → create episode → publish → appears.
- Verification:
  - Full smoke checklist run.

---

## Phase 3 — Social + Discovery + Interactive Story

### Phase 3 Principles (v1)

- Discovery is curated-first.
- Social actions must have **library representation** (not hidden only in feeds).
- “Follow” is meaningful: it creates a predictable “Following” surface.

**Step 3-01: Follow graph v1 (follow creator/show; store locally)**

- Acceptance Criteria:
  - User can follow/unfollow show (and/or creator if supported).
  - Following state persists locally.
  - Feed can show “Following” status consistently.
- Verification:
  - Follow a show; relaunch app; follow state preserved.

**Step 3-01b: Library Followed Shows section**

- Acceptance Criteria:
  - Library includes a distinct “Followed Shows” section.
  - Followed shows appear there immediately.
  - Navigation from Followed Shows → Show Hub works.
  - Following your own created show is allowed OR disallowed per policy, but behavior is consistent and clearly communicated.
- Verification:
  - Follow show; open Library; see it; tap; navigate.

**Step 3-01c: Followed Shows eligibility + sorting**

- Surface Area:
  - Screens/Routes: Library
  - State/Stores: follow store/selectors
  - Components/UX: section header + list rows
- Acceptance Criteria:
  - Followed Shows section is sorted (most recently followed first).
  - No duplicates across Followed Shows section.
  - Unfollow removes immediately.
- In-App Verification:
  - Follow Show A then Show B → B appears above A.
  - Unfollow B → B disappears without restart.
- Guardrails / Must Not Change:
  - Do not change existing show navigation routes.
  - Do not merge Followed into Created/Saved; keep separate section.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step 3-02: Feed personalization v1 (following feed vs discovery feed toggle)**

- Acceptance Criteria:
  - Toggle between Following feed and Discovery/Curated feed.
  - Following feed shows content only from followed shows (or creators, if applicable).
  - Discovery feed remains curated-only for now.
- Verification:
  - Follow a show; toggle to Following; see its content.

**Step 3-02b: Personalization state persistence**

- Acceptance Criteria:
  - User’s feed preference persists across app relaunch.
- Verification:
  - Toggle; relaunch; stays.

---

### REMAINING PHASE 3 STEPS (UPGRADED)

**Step 3-03: Topics/hashtags v1 (tag shows/episodes; topic discovery improves)**

- Surface Area:
  - Screens/Routes:
    - Show Hub (show-level tags)
    - Episode detail (episode-level tags)
    - Feed cards (show + episode tags where applicable)
    - Topic Hub route (existing `/topic/[id]` or canonical topic route used)
  - State/Stores:
    - Topic source of truth (curated dataset for v1) and any mapping:
      - showId → topics[]
      - episodeId → topics[] (optional but supported)
  - APIs/Contracts:
    - Topic tag shape (id + label + slug or id)
    - Ensure stability of existing show/episode contracts; tags may be additive fields
  - Components/UX:
    - Tag chip UI (pressable)
    - Topic hub header that shows topic name and clear sections
- Acceptance Criteria:
  - Shows display at least one topic tag visibly (when topic exists).
  - Episodes display topic tags visibly (inherit show topics OR explicit episode topics; rule documented in this step).
  - Tapping any topic tag navigates to Topic Hub for that topic (no unmatched routes).
  - Topic Hub provides meaningful discovery:
    - lists **Attached Shows** (shows tagged with this topic)
    - lists **Episodes** (episodes tagged or from attached shows, curated-first rules allowed)
  - Negative test:
    - A show created with topic “Comedy” must surface “Comedy” visibly (in Show Hub and at least one other surface: feed card OR episode detail).
- In-App Verification:
  - Create or use a show tagged “Comedy”.
  - Confirm:
    - Show Hub displays “Comedy” chip.
    - Episode detail displays “Comedy” chip.
    - Tap “Comedy” chip → Topic Hub opens and shows:
      - Attached Shows includes that show
      - Episodes section is non-empty OR explicitly shows empty state with explanation (curated-first).
- Guardrails / Must Not Change:
  - Do not break existing Topic Hub navigation.
  - Do not change route naming conventions.
  - Do not remove curated-first behavior; do not introduce open discovery uploads.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step 3-03b: Topic tagging coverage audit + empty state polish**

- Surface Area:
  - Screens/Routes: Topic Hub, Show Hub, Episode detail
  - Components/UX: empty states, chip visibility
- Acceptance Criteria:
  - All curated shows have at least one topic tag.
  - Topic Hub never appears “broken”: either lists items or shows a clear empty state describing why.
- In-App Verification:
  - Tap 3 different topic chips from different shows → each Topic Hub feels complete.
- Guardrails / Must Not Change:
  - No contract breaking changes.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step 3-04: Writers Room v1 (invite co-creator; roles: owner/editor/viewer)**

- Surface Area:
  - Screens/Routes:
    - Writers Room screen (from show hub entrypoint)
    - Invite flow UI (modal/screen)
  - State/Stores:
    - Writers room membership store (local for v1)
    - Role model (owner/editor/viewer)
  - APIs/Contracts:
    - Membership shape (userId/email placeholder, role)
  - Components/UX:
    - Member list UI, role badges
    - Role-gated controls
- Acceptance Criteria:
  - Roles exist: owner/editor/viewer.
  - Role affects UI:
    - owner/editor can invite/remove (mock)
    - viewer cannot invite/remove and sees read-only UI
  - No unmatched routes introduced.
- In-App Verification:
  - Open Writers Room from a show.
  - Toggle role in a dev/mock way (or use seeded roles):
    - As viewer: invite button absent/disabled.
    - As editor/owner: invite button works and adds member (mock).
- Guardrails / Must Not Change:
  - Do not allow viewer to access create/publish actions.
  - Do not change show hub route.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step 3-05: Draft sharing v1 (share draft with writers room)**

- Surface Area:
  - Screens/Routes: Create Episode draft screen, Writers Room draft list
  - State/Stores: draft store + shared-with-writers metadata
  - Components/UX: “Share draft” action + shared badge
- Acceptance Criteria:
  - A draft can be marked “shared” (local flag) and appears in Writers Room draft list.
  - Role gating:
    - owner/editor can share/unshare
    - viewer cannot
  - No data loss: sharing does not change draft content.
- In-App Verification:
  - Create a draft → share it → open Writers Room → see draft listed.
  - Unshare → it disappears from writers room list.
- Guardrails / Must Not Change:
  - Do not change draft creation requirements (must have showId).
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step 3-06: Stitch scenes v1 (ordered list of clips; render order)**

- Surface Area:
  - Screens/Routes: Episode creation/edit “Scenes” editor screen
  - State/Stores: draft episode scenes array
  - Components/UX: reorder UI (drag handles or up/down controls)
- Acceptance Criteria:
  - Scene list exists on draft (local only).
  - Scenes can be reordered; order persists when leaving and returning to draft.
  - UI clearly shows order (1..N).
- In-App Verification:
  - Add 3 scenes → reorder them → leave screen → return → order preserved.
- Guardrails / Must Not Change:
  - Do not introduce real video stitching yet (mock clip references only).
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step 3-07: Polls v1 (episode contains poll; viewer can vote)**

- Surface Area:
  - Screens/Routes: Episode detail
  - State/Stores: poll state + vote record (local, keyed by episodeId)
  - Components/UX: poll card, choices, results
- Acceptance Criteria:
  - Episode can display a poll (curated/mock or creator-defined later).
  - One vote per user per poll (local enforcement).
  - After vote, UI shows selected choice and disables revote.
- In-App Verification:
  - Open an episode with poll → vote → UI locks and shows selection.
  - Relaunch app → selection persists.
- Guardrails / Must Not Change:
  - Do not block episode playback due to poll.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step 3-08: Poll results influence “next episode prompt” placeholder**

- Surface Area:
  - Screens/Routes: Episode detail (next-episode placeholder section)
  - State/Stores: poll vote result reader
  - Components/UX: “Next episode prompt” text changes based on poll winner/selection
- Acceptance Criteria:
  - Next-episode placeholder reflects poll result deterministically:
    - either show “You voted for X” OR “Top choice is X” (pick one and document)
  - No crashes when no poll exists.
- In-App Verification:
  - Vote on poll → confirm placeholder updates.
  - Open episode without poll → placeholder remains default.
- Guardrails / Must Not Change:
  - Do not introduce backend dependencies here.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step 3-09: Comments v1 (episode comments; basic post)**

- Surface Area:
  - Screens/Routes: Episode detail comments section/screen
  - State/Stores: comments store keyed by episodeId
  - Components/UX: comment list, composer input, submit
- Acceptance Criteria:
  - Add comment works locally and appears immediately.
  - Comments persist across relaunch.
  - Basic validation (non-empty, max length) and error UI (inline) exists.
- In-App Verification:
  - Add 2 comments → close app → reopen → comments still present.
- Guardrails / Must Not Change:
  - No PII logging.
  - Do not allow comments to break playback screen layout.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step 3-10: Notifications v1 (invites, new episode, poll posted)**

- Surface Area:
  - Screens/Routes: Notifications inbox screen (new tab/route or entrypoint)
  - State/Stores: notification store (local) with types
  - Components/UX: notification rows + read/unread
- Acceptance Criteria:
  - Notification list UI exists.
  - At least 3 notification types render distinctly (invite, new episode, poll).
  - “Mark read” behavior exists (local).
- In-App Verification:
  - Trigger mock notifications → they appear in list.
  - Tap one → optional navigation or detail; mark read toggles.
- Guardrails / Must Not Change:
  - No push notifications required yet (local only).
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step 3-11: Discovery surfaces v1 (Trending shows/topics mock)**

- Surface Area:
  - Screens/Routes: Discover/Explore surfaces (where trending lives)
  - State/Stores: curated dataset for trending
  - Components/UX: trending sections, stable content
- Acceptance Criteria:
  - Trending shows/topics sections exist and are curated-first (mock).
  - Tapping trending show navigates to show hub.
  - Tapping trending topic navigates to topic hub.
  - No duplicates; stable ordering across reload.
- In-App Verification:
  - Open trending → tap show → show hub opens.
  - Tap topic → topic hub opens.
- Guardrails / Must Not Change:
  - Do not introduce open “random upload discovery”.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step 3-12: Phase 3 hardening sweep (navigation + persistence + quality gates)**

- Surface Area:
  - Navigation: all Phase 3 routes and deep links
  - State persistence: follows, feed mode, topics, polls, comments
  - UX: empty/error/loading states
- Acceptance Criteria:
  - No unmatched routes introduced.
  - No new console warnings/errors introduced (unless explicitly accepted).
  - State persistence verified for:
    - Followed shows
    - Feed mode toggle
    - Votes
    - Comments
  - Smoke checklist updated with Phase 3 flows.
- In-App Verification:
  - Run Phase 3 smoke:
    - Follow a show → Library shows it → open it
    - Toggle Following/Discovery → relaunch → persists
    - Tap topic chip → topic hub shows content
    - Vote on poll → placeholder updates → relaunch persists
    - Add comment → relaunch persists
- Guardrails / Must Not Change:
  - Do not change existing feed/show/episode contracts without explicit version bump.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

---

## Phase 4 — Monetization + Safety (Optional for v1 but planned)

**Step 4-01: Entitlements model v1 (season pass per show; mock purchase)**

- Surface Area:
  - Screens/Routes: Show hub paywall surface, optional “Purchase” screen/modal
  - State/Stores: entitlements store keyed by showId (local)
  - Components/UX: locked badges, purchase CTA
- Acceptance Criteria:
  - Entitlement model exists (local): showId → hasSeasonPass boolean (or tier).
  - Mock purchase flow toggles entitlement and unlocks gated content surfaces.
  - Clear UI for locked vs unlocked.
- In-App Verification:
  - Open a gated show/season → see locked UI → “buy” → unlock.
  - Relaunch app → entitlement persists.
- Guardrails / Must Not Change:
  - No real payments in v1 mock step; no App Store purchase APIs yet.
  - Do not block creator access to their own content due to paywall.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step 4-02: Tips per show v1 (mock tip flow; receipt UI)**

- Surface Area:
  - Screens/Routes: tip modal/screen
  - State/Stores: tips ledger local store
  - Components/UX: amounts, confirm, receipt display
- Acceptance Criteria:
  - Tip UI supports selecting amount and submitting (mock).
  - Receipt UI shows show title, amount, timestamp (mock).
  - Ledger entry stored locally and visible in creator earnings stub later.
- In-App Verification:
  - Tip a show → receipt appears → relaunch → receipt/ledger remains.
- Guardrails / Must Not Change:
  - No real payment provider.
  - No PII logged.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step 4-03: Creator earnings dashboard stub (UI only)**

- Surface Area:
  - Screens/Routes: Creator earnings screen (from studio)
  - State/Stores: read-only view from tips/entitlements ledger (local)
- Acceptance Criteria:
  - Screen exists and does not crash.
  - Shows placeholders + basic totals derived from local mock ledger.
- In-App Verification:
  - Tip a show → open earnings dashboard → total reflects tip.
- Guardrails / Must Not Change:
  - No claims of real payouts.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step 4-04: Content reporting hooks (report episode/show)**

- Surface Area:
  - Screens/Routes: Report action on show hub and episode detail
  - State/Stores: local reports store
  - Components/UX: report modal with reasons + confirmation
- Acceptance Criteria:
  - Report action exists on show and episode.
  - Submitting a report creates a local report record with:
    - type (show/episode), targetId, reason, timestamp
  - Confirmation UI shown; user can dismiss.
- In-App Verification:
  - Report an episode → see confirmation → open moderation queue stub → report visible.
- Guardrails / Must Not Change:
  - Do not expose personal data in report record.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step 4-05: Rate limit + abuse guard stubs (local throttles)**

- Surface Area:
  - Actions: comment submit, report submit (and any other spam-prone actions)
  - State/Stores: local rate-limit tracker
  - Components/UX: friendly error messaging/toast
- Acceptance Criteria:
  - Explicit local throttle rules (document in step):
    - e.g., reports: max 2 per 30 seconds
    - comments: max 5 per 30 seconds
  - When throttled: action blocked, clear message shown, no crash.
- In-App Verification:
  - Rapid-submit reports/comments → observe throttle message and no duplicate records.
- Guardrails / Must Not Change:
  - Do not block normal usage; only rapid spam.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step 4-06: Moderation queue stub (flagged content list UI)**

- Surface Area:
  - Screens/Routes: Moderation Queue screen (creator/admin stub)
  - State/Stores: reads from local reports store
- Acceptance Criteria:
  - Queue lists reported items (show/episode) with timestamp and reason.
  - Tapping item navigates to target (show hub / episode detail) or opens detail modal.
- In-App Verification:
  - Report content → open queue → see entry → tap → navigate.
- Guardrails / Must Not Change:
  - This is a stub; no real moderation actions required yet.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step 4-07: Privacy controls v1 (hide show/hide episodes; mock)**

- Surface Area:
  - Screens/Routes: Studio show settings (owner), viewer surfaces (feeds/library/search)
  - State/Stores: local hidden flags keyed by showId/episodeId
- Acceptance Criteria:
  - Owner can hide/unhide:
    - a show (hides from viewer feeds/library/search)
    - an episode (hides from viewer episode lists and feed cards)
  - Hidden content behavior:
    - Hidden show/episodes are removed from viewer surfaces
    - Still visible in creator studio (owned content management)
- In-App Verification:
  - Hide a show → it disappears from feeds/library/search but remains in Studio.
  - Unhide → it returns.
- Guardrails / Must Not Change:
  - Do not break created shows section in Library.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**Step 4-08: Phase 4 hardening sweep**

- Surface Area:
  - Safety surfaces, moderation queue, privacy controls, rate limit behaviors
- Acceptance Criteria:
  - No unmatched routes introduced.
  - No new console warnings/errors introduced (unless explicitly accepted).
  - Safety flows are predictable and discoverable.
- In-App Verification:
  - Report → queue → open target
  - Rate limit test
  - Hide/unhide test
- Guardrails / Must Not Change:
  - No real payments.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

---

# Auth & Accounts

## Phase A0 — Auth foundations (during Phase 1 hardening)

**A0-01: Auth decision + provider + token strategy (Supabase Auth)**

- Surface Area:
  - Docs: auth decision + token strategy
  - API client: token attach plan
- Acceptance Criteria:
  - Provider confirmed (Supabase Auth).
  - Token handling strategy documented:
    - where stored
    - refresh approach
    - logout behavior
- In-App Verification:
  - N/A (doc step) or minimal stub confirming config is present.
- Guardrails / Must Not Change:
  - Do not change existing route layout.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**A0-02: App auth shell (unauth stack vs authed tabs) + route gating**

- Surface Area:
  - Navigation layout for authed vs unauth
  - Route guards for protected screens
- Acceptance Criteria:
  - When logged out:
    - protected tabs/routes are blocked and user is routed to auth flow
  - When logged in:
    - authed tabs render and protected routes accessible
  - No unmatched routes introduced.
- In-App Verification:
  - Logged out → attempt to open protected route → redirected.
  - Log in → protected routes accessible.
- Guardrails / Must Not Change:
  - Do not rename existing routes; only gate them.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**A0-03: Session persistence + logout**

- Surface Area:
  - Secure storage/session restore
  - Logout action placement
- Acceptance Criteria:
  - Session restores across relaunch.
  - Logout clears tokens and local session.
- In-App Verification:
  - Login → relaunch still authed.
  - Logout → relaunch remains unauth.
- Guardrails / Must Not Change:
  - Do not log tokens.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**A0-04: API client auth header + 401 handling**

- Surface Area:
  - API wrapper
  - 401 path UI + navigation
- Acceptance Criteria:
  - Auth header is attached when authed.
  - 401 results in refresh or logout + user feedback.
- In-App Verification:
  - Force 401 → user returned to login (or refreshed) without crash.
- Guardrails / Must Not Change:
  - Do not alter API contracts.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

## Phase A1 — Auth flows (start of Phase 2)

**A1-01: Login screen UI + validation**

- Surface Area:
  - Screens/Routes: login
  - Components/UX: input validation
- Acceptance Criteria:
  - Form validates email/password format.
  - Errors displayed inline; no crash.
- In-App Verification:
  - Submit empty/invalid → see validation.
  - Submit valid credentials (mock/real) → success route.
- Guardrails / Must Not Change:
  - Do not change overall tab route structure.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**A1-02: Signup screen UI + validation**

- Surface Area:
  - Screens/Routes: signup
- Acceptance Criteria:
  - Validations exist; can create account (mock/real).
- In-App Verification:
  - Signup → authed state reachable.
- Guardrails / Must Not Change:
  - No PII logging.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**A1-03: Password reset / magic link verify flow**

- Surface Area:
  - Screens/Routes: reset request + verify
- Acceptance Criteria:
  - Reset request UI exists; verify step handles link/token.
- In-App Verification:
  - Walk through reset UI; verify no broken routes.
- Guardrails / Must Not Change:
  - Never print tokens in logs.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**A1-04: Profile minimal (username/avatar) + edit**

- Surface Area:
  - Screens/Routes: profile view/edit
  - State: user profile store
- Acceptance Criteria:
  - User can set username/avatar.
  - Changes persist (local or backend depending on mode).
- In-App Verification:
  - Edit profile → relaunch → persists.
- Guardrails / Must Not Change:
  - Don’t block core watch flows if profile incomplete.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

## Phase A2 — Roles & permissions (Phase 3)

**A2-01: Writers Room roles enforced (owner/editor/viewer)**

- Surface Area:
  - Writers Room routes and actions
- Acceptance Criteria:
  - Roles gate actions consistently.
- In-App Verification:
  - Switch role → confirm gated actions toggle.
- Guardrails / Must Not Change:
  - Viewer cannot publish/edit show content.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**A2-02: Creator-only actions gated (create/publish)**

- Surface Area:
  - Create episode/show flows, publish actions
- Acceptance Criteria:
  - Only creators/owners can create/publish.
- In-App Verification:
  - Non-creator cannot access create/publish.
- Guardrails / Must Not Change:
  - Do not break existing creator flows for owners.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

---

# UX & Design System

## Phase U0 — Design system (during Phase 1)

**U0-01: Design tokens (colors/spacing/typography) + light/dark rules**

- Surface Area:
  - Theme/tokens module, component styles
- Acceptance Criteria:
  - Tokens exist and are used by core components/screens.
  - Light/dark rules defined.
- In-App Verification:
  - Toggle system theme → app remains readable and consistent.
- Guardrails / Must Not Change:
  - Do not break layout on Library/Show/Episode.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**U0-02: Component kit baseline (buttons/cards/chips/headers)**

- Surface Area:
  - Reusable components used in feed, show hub, library
- Acceptance Criteria:
  - Components exist and are reused (no one-off styling for same control).
- In-App Verification:
  - Spot-check: feed card, show hub header, tag chip all consistent.
- Guardrails / Must Not Change:
  - Keep navigation routes stable.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**U0-03: Navigation patterns (modal/sheet/back behavior)**

- Surface Area:
  - Router navigation patterns, modal usage
- Acceptance Criteria:
  - Back behavior predictable; modals close without leaving orphan routes.
- In-App Verification:
  - Open/close modals; back navigations do not break.
- Guardrails / Must Not Change:
  - No unmatched routes.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**U0-04: Standard loading/empty/error states**

- Surface Area:
  - Shared components for loading/empty/error
- Acceptance Criteria:
  - All major screens have non-janky loading/empty/error states.
- In-App Verification:
  - Simulate empty lists and errors in mock mode → UX still professional.
- Guardrails / Must Not Change:
  - Do not hide errors silently; show user-friendly messaging.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

## Phase U1 — Screen polish passes (Phases 2–3)

**U1-00: Safe-area compliance pass**

- Surface Area:
  - Library, Show Hub, Episode detail, Create flows
- Acceptance Criteria:
  - No header overlap with iOS status bar.
- In-App Verification:
  - Check each surface on iOS device.
- Guardrails / Must Not Change:
  - Do not introduce nested VirtualizedList warnings.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**U1-01: Feed UI polish pass**

- Surface Area:
  - Feed screens/cards
- Acceptance Criteria:
  - Professional spacing/typography; consistent card styles; no layout jumps.
- In-App Verification:
  - Scroll feed for 30 seconds; no jank/warnings.
- Guardrails / Must Not Change:
  - Feed contracts remain stable.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**U1-02: Show Hub UI polish pass**

- Surface Area:
  - Show hub header, episode list, sections (specials, trailer)
- Acceptance Criteria:
  - Clear hierarchy; season grouping readable; trailer label clean.
- In-App Verification:
  - Open a show with trailer + episodes + drafts; feels cohesive.
- Guardrails / Must Not Change:
  - Canonical episode ordering rules remain.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**U1-03: Episode detail UI polish pass**

- Surface Area:
  - Episode detail layout, placeholders, poll/comments (if present)
- Acceptance Criteria:
  - Consistent spacing; placeholder sections look intentional.
- In-App Verification:
  - Open multiple episodes; no overlap; no warnings.
- Guardrails / Must Not Change:
  - Do not break playback.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**U1-04: Creator flow UX polish (draft/upload/retry)**

- Surface Area:
  - Create Episode capture/upload/publish flow
- Acceptance Criteria:
  - Clear states: draft vs uploading vs published; retry UX is obvious.
- In-App Verification:
  - Simulate upload fail → retry path is clean.
- Guardrails / Must Not Change:
  - Publish gating remains enforced.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**U1-05: App Store readiness polish (icons/splash/empty/loading/error consistency)**

- Surface Area:
  - app icons, splash, global states
- Acceptance Criteria:
  - Assets present; empty/loading/error patterns consistent on key screens.
- In-App Verification:
  - Cold start looks professional; empty states are intentional.
- Guardrails / Must Not Change:
  - No debug banners in prod.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

---

# Data Layer & Backend (Database + APIs)

This workstream runs alongside Phases 2–4 once Phase 1 contracts are stable.

## Phase D0 — Data Contracts & Storage Choice

**D0-01: Choose persistence stack + hosting target (Supabase Postgres + Edge Functions)**

- Surface Area:
  - Docs + architecture outline
- Acceptance Criteria:
  - Decision recorded and aligns with ship gates.
- In-App Verification:
  - N/A (doc), unless a connection test is added.
- Guardrails / Must Not Change:
  - Keep feature flag plan intact.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**D0-02: Define canonical schemas** (User, Show, Season?, Episode, Special, Topic, WritersRoomMembership)

- Surface Area:
  - Schema docs + TypeScript contract types
- Acceptance Criteria:
  - Schemas defined with required indexes and relationships.
  - Trailer and special types are represented.
- In-App Verification:
  - N/A (doc), but types compile.
- Guardrails / Must Not Change:
  - Avoid breaking existing mock contract shapes; plan additive migrations.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**D0-03: ID strategy + indexing plan + join tables**

- Surface Area:
  - DB join tables (TopicShows, SpecialShows, SpecialTopics)
- Acceptance Criteria:
  - IDs stable; indexes documented for key queries.
- In-App Verification:
  - N/A (doc)
- Guardrails / Must Not Change:
  - Keep route ids string stable.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**D0-04: API contracts frozen v1 + versioning rules**

- Surface Area:
  - API contract docs + client types
- Acceptance Criteria:
  - Versioning rules defined; no breaking changes without bump.
- In-App Verification:
  - N/A (doc)
- Guardrails / Must Not Change:
  - Feed/show/episode contracts remain stable once frozen.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**D0-05: Users schema + sessions/refresh tokens mapping**

- Surface Area:
  - Auth model + DB tables (if needed)
- Acceptance Criteria:
  - Session mapping documented and compatible with Supabase Auth.
- In-App Verification:
  - N/A (doc)
- Guardrails / Must Not Change:
  - Do not log tokens.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

## Phase D1 — Core Read APIs

**D1-01: GET /shows/:id + GET /shows/:id/episodes**

- Surface Area:
  - Backend endpoints + client
  - Show hub data source
- Acceptance Criteria:
  - Endpoints return canonical list (ordering stable) and show detail.
  - Trailer returned as kind=trailer and does not consume episode numbers.
- In-App Verification:
  - Flip feature flag to real → show hub loads.
- Guardrails / Must Not Change:
  - Contract stability: additive only unless version bump.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**D1-02: GET /feed/new, /feed/newShowsOnly, /feed/continue**

- Surface Area:
  - Backend endpoints + client
  - Feed screens
- Acceptance Criteria:
  - Shapes match existing mock feed contracts.
  - Continue Watching semantics preserved.
- In-App Verification:
  - Switch feeds → data loads, no route changes.
- Guardrails / Must Not Change:
  - No breaking feed contract changes.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**D1-03: GET /topics/:id**

- Surface Area:
  - Topic hub data source
- Acceptance Criteria:
  - Topic hub returns attached shows and discoverable content per v1 rules.
- In-App Verification:
  - Tap topic chip → topic hub loads from real API behind flag.
- Guardrails / Must Not Change:
  - Topic route stable.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**D1-04: Replace mocks with real API behind feature flag**

- Surface Area:
  - Feature flag switching
  - API client layering
- Acceptance Criteria:
  - Flip flag changes data source only; no UI/route changes.
  - Errors handled gracefully.
- In-App Verification:
  - Mock mode works; real mode works; toggle is stable.
- Guardrails / Must Not Change:
  - Keep mock path available for dev/testing.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

## Phase D2 — Write APIs (Creation)

**D2-01: POST /shows**

- Surface Area:
  - Create show flow + backend endpoint
- Acceptance Criteria:
  - Show persists; ownership recorded; returns showId.
- In-App Verification:
  - Create show on device → appears in Studio and via real read APIs.
- Guardrails / Must Not Change:
  - Created shows still appear immediately (optimistic or fast refresh).
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**D2-02: POST /episodes (draft metadata)**

- Surface Area:
  - Draft creation + persistence
- Acceptance Criteria:
  - Draft belongs to show; includes title + S/E + kind (episode/trailer).
- In-App Verification:
  - Create draft → appears in show hub.
- Guardrails / Must Not Change:
  - No orphan episodes.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**D2-03: Upload session model + status**

- Surface Area:
  - Upload session endpoints + client
  - UI progress mapping
- Acceptance Criteria:
  - Upload session created; status tracked; retries supported.
- In-App Verification:
  - Start upload → observe progress; simulate interruption → status recovers.
- Guardrails / Must Not Change:
  - Avoid blocking UI on transient network errors.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**D2-04: Publish workflow + feed inclusion rules**

- Surface Area:
  - Publish endpoint + client
  - Feed eligibility logic
- Acceptance Criteria:
  - Publish transitions draft → published.
  - Feed eligibility rule enforced (show appears only after first publish).
- In-App Verification:
  - Create show → not in public feed → publish → appears.
- Guardrails / Must Not Change:
  - Keep trailer rule intact.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**D2-05: Auth endpoints/provider integration**

- Surface Area:
  - Auth wiring for write endpoints
- Acceptance Criteria:
  - Writes require auth; reads for published are public (per RLS).
- In-App Verification:
  - Logged out cannot publish; logged in can publish.
- Guardrails / Must Not Change:
  - 401 handling stable.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**D2-06: Swap mock feed.api to real behind flag**

- Surface Area:
  - Feed client
- Acceptance Criteria:
  - No contract changes; swap behind flag.
- In-App Verification:
  - Toggle flag; feeds still render.
- Guardrails / Must Not Change:
  - Keep mock for dev.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**D2-07: Remove mock-only paths for prod build**

- Surface Area:
  - Build config + feature flags
- Acceptance Criteria:
  - prod defaults to real; mock code excluded or disabled appropriately.
- In-App Verification:
  - prod build uses real endpoints.
- Guardrails / Must Not Change:
  - dev retains mock option.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**D2-08: RLS policies**

- Surface Area:
  - Supabase RLS rules
- Acceptance Criteria:
  - Owner can write; public can read published only.
- In-App Verification:
  - Logged out cannot see drafts; can see published.
  - Owner can edit/publish their own.
- Guardrails / Must Not Change:
  - No accidental public access to drafts.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

## Phase D3 — Social/Interactive Persistence

**D3-01: Follows + Writers Room invites/membership**  
**D3-02: Polls + votes**  
**D3-03: Comments + moderation flags**

- Surface Area:
  - Backend tables + endpoints + client
- Acceptance Criteria:
  - Social data persists per user and is isolated by auth.
- In-App Verification:
  - Relauch and cross-user sanity check (if possible).
- Guardrails / Must Not Change:
  - No PII logging.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

## Phase D4 — Monetization/Safety Persistence

**D4-01: Entitlements**  
**D4-02: Tips/transactions ledger**  
**D4-03: Reports/moderation queue/audit trail**

- Surface Area:
  - Backend ledger tables + read endpoints
- Acceptance Criteria:
  - Financial/reporting records are immutable and auditable.
- In-App Verification:
  - Create mock entries and verify read surfaces.
- Guardrails / Must Not Change:
  - No real payment processing until explicitly added.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

---

# Video (Mux) Integration

**V-01: Mux direct upload flow**

- Surface Area:
  - Backend upload URL creation
  - Client upload + progress
- Acceptance Criteria:
  - Upload URL created; client uploads; progress shows.
  - Failure states handled; retry supported.
- In-App Verification:
  - Upload from device; see progress and completion.
- Guardrails / Must Not Change:
  - Don’t block the app on asset processing; show “processing” states.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**V-02: Persist playbackId + asset status**

- Surface Area:
  - DB fields for playbackId + asset status
  - Client polling/webhook placeholder
- Acceptance Criteria:
  - playbackId stored; asset state tracked; UI reflects readiness.
- In-App Verification:
  - Refresh show hub/episode; status persists and updates.
- Guardrails / Must Not Change:
  - Don’t crash when playbackId missing/not-ready.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

**V-03: Player uses Mux playback URL; buffering states validated**

- Surface Area:
  - Player component
  - Episode detail playback UI
- Acceptance Criteria:
  - Robust playback with loading/buffer UI; no crashes.
- In-App Verification:
  - Real device testing: poor network → buffering UI; playback recovers.
- Guardrails / Must Not Change:
  - Do not regress existing playback reliability step.
- Build Gates:
  - `npx tsc --noEmit`
  - `npm run lint`

---

# Progress Log

We track steps in chat as: ✅ Pass — Phase X Step NN. This log mirrors progress.

- [x] Phase 1 — Step 01: Feed boundary + multi-feed types wired to UI
- [x] Phase 1 — Step 02: Show hub route + episode list by show
- [x] Phase 1 — Step 03: Episode route + previous/up-next + S/E badge + next drop placeholder
- [x] Phase 1 — Step 04: Specials: mixed feed + special route + special→show
- [x] Phase 1 — Step 05: Special→Topic navigation + Topic route
- [x] Phase 1 — Step 06: Topic→Special navigation (topic rows navigate to /special/[id])
- [x] Phase 1 — Step 07: Topic→Show navigation from Attached Shows list
- [x] Phase 1 — Step 08: Topic hub: episode rows navigate to /episode/[id]
- [x] Phase 1 — Step 09: Show Hub surfaces specials + episodes cleanly (confirm both sections + navigation)
- [x] Phase 1 — Step 10: Ensure topic has attached shows (derive from specials)
- [x] Phase 1 — Step 11: Navigation from topic attached shows to show hubs
- [x] Phase 1 — Step 12: Continue Watching feed type support (resume pointer semantics)
- [x] Phase 1 — Step 13: Season-based grouping in show hub
- [x] Phase 1 — Step 14: Show Hub season headers tappable collapse/expand
- [x] Phase 1 — Step 15: Show Hub entrypoint polish: highlight + scroll to current episode when episodeId provided
- [x] Phase 1 — Step 16: Continue Watching deep-link into show hub with highlight/scroll target
- [x] Phase 1 — Step 17: Add "New Shows Only" feed type support (one item per show; pilot semantics)
- [x] Phase 1 — Step 18: Canonical show-centric API: `getShowEpisodes(showId)`
- [x] Phase 1 — Step 19: Show hub uses `getShowEpisodes(showId)` (no feed-pool assembly)
- [x] Phase 1 — Step 20: Canonical contract hardening (normalize season/episode numbers; stable sorting)
- [x] Phase 1 — Step 21: Continue Watching semantics hardening (one resume entry per show; no per-episode spam)
- [x] Phase 1 — Step 22: Show Hub “Up Next” logic uses canonical list (episodeId → next episode)
- [x] Phase 1 — Step 23: “Previously on…” stub section (data shape only; UI placeholder)
- [x] Phase 1 — Step 24: “Next drop in…” scheduling placeholder (data shape + UI stub)
- [x] Phase 1 — Step 25: Algorithm controls v1 (local toggles affect feed selection; no ranking yet)
- [x] Phase 1 — Step 26: Topic hub v2 (shows + episodes aggregated discovery view)
- [x] Phase 1 — Step 27: Explore search stub (search input filters mock Shows + Topics; tap navigates to /show/[id] and /topic/[id])
- [x] Phase 1 — Step 28: Search results v1 from real data (use existing feed/mock sources; no backend yet)
- [x] Phase 1 — Step 29: Library tab v1 (saved shows/topics + continue watching entrypoint)
- [x] Phase 1 — Step 30: Phase 1 hardening sweep (no unmatched routes + smoke checklist update)
- [x] Phase 2 — Step 01: Creator entrypoint: “Create Episode” routes to capture flow (UI only)
- [x] Phase 2 — Step 01b: Remove “Create Episode” entrypoint from Library
- [x] Phase 2 — Step 01c: Creator entrypoint rules + no orphan episodes
- [x] Phase 2 — Step 02: Capture scaffold
- [x] Phase 2 — Step 03: Upload pipeline stub
- [x] Phase 2 — Step 04: Drafts v1
- [x] Phase 2 — Step 04b: Draft appears in Show Hub list
- [x] Phase 2 — Step 04c: Draft resume restores fields
- [x] Phase 2 — Step 05: Hook templates v1
- [x] Phase 2 — Step 06: Scheduling v1
- [x] Phase 2 — Step 07: Previously on builder v1
- [x] Phase 2 — Step 08: Background upload safety v1
- [x] Phase 2 — Step 09: Create Show flow v1
- [x] Phase 2 — Step 09b-a: Creator store introduced
- [x] Phase 2 — Step 09b-b: Studio list wired to creator store
- [x] Phase 2 — Step 09c: My Studio polish pass
- [x] Phase 2 — Step 09d: Library Created Shows section
- [x] Phase 2 — Step 10: Publish v1
- [x] Phase 2 — Step 10a: Trailer publish type
- [x] Phase 2 — Step 10b: Publish gating verified
- [x] Phase 2 — Step 10c: Feed eligibility enforced
- [x] Phase 2 — Step 11: Playback reliability pass
- [x] Phase 2 — Step 12: Creator QA smoke run
- [x] Phase 3 — Step 01: Follow graph v1
- [x] Phase 3 — Step 01b: Library Followed Shows section
- [x] Phase 3 — Step 02: Following vs Discovery feed toggle
- [x] Phase 3 — Step 02b: Persist Feed Mode (Curated vs Discovery)
- [x] Phase 3 — Step 03: Topics/hashtags v1 (tag shows/episodes; topic discovery improves)
- [x] Phase 3 — Step 04: Writers Room v1 (invite co-creator; roles: owner/editor/viewer)
- [x] Phase 3 — Step 05: Draft sharing v1 (share draft with writers room)
- [x] Phase 3 — Step 06: Stitch scenes v1 (ordered list of clips; render order)
- [x] Phase 3 — Step 07: Polls v1 (episode contains poll; viewer can vote)
- [x] Phase 3 — Step 08: Poll results influence “next episode prompt” placeholder
- [x] Phase 3 — Step 09: Comments v1 (episode comments; basic post)
- [x] Phase 3 — Step 10: Notifications v1 (invites, new episode, poll posted)
- [x] Phase 3 — Step 11: Discovery surfaces v1 (Trending shows/topics mock)
- [x] Phase 3 — Step 12: Phase 3 hardening sweep (navigation + persistence + quality gates)

---

# Definition of Done (per step)

- App runs with no red screens.
- No new console errors/warnings introduced (or explicitly accepted).
- Key flows still work for what’s already implemented (smoke-click checklist for impacted screens).
- Exports/routes remain unchanged unless the step explicitly says they will change.
- `npx tsc --noEmit` passes.
- `npm run lint` passes.
- Acceptance Criteria met and confirmed ✅ Pass — Phase X Step NN before moving on.

---

# Final Ship Checklist

- EAS production builds succeed for iOS + Android
- Smoke checklist:
  - Home→Show→Episode
  - Create Show → Create Episode → Draft → Resume → Publish
  - Show Hub → Create Episode → Publish (preferred path)
  - My Studio → Create Show → View Show Hub
  - Library → Created Shows → Show Hub
  - Library → Followed Shows → Show Hub
  - Feeds: created show appears only after first publish (episode or trailer)
  - Toggle: Discovery vs Following feed behaves correctly
- Sentry receives a test error event
- Supabase prod env connected (no mocks)
- Mux playback works on-device
