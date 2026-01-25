# Episodic App — Build Plan (Source of Truth)

## Goal

Episodic is series-first. Primary object is Show; uploads are Episodes (not posts).

## Differentiators

- Series mechanics: seasons/episodes, “Previously on…”, “Next episode drops in…”, cliffhanger/hook templates.
- Collaboration: “Writers room” for co-creators, drafts, scene stitching in order.
- Interactive storytelling: polls/choices influence what gets made next.
- Algorithm controls: user-tunable feed preferences (e.g., more comedy / less politics / local creators / new shows only).
- Monetization tied to shows: season passes + tipping per show (not only per creator).

## Workflow Rules

- Touch exactly one file/class per step (unless the step explicitly says otherwise).
- Define Acceptance Criteria before changes.
- Use a Copilot prompt with guardrails: state what to change, state what must not change (exports, routes, existing hook behavior, etc.).
- Implement + run the app/tests.
- Prove changes with:
  - `npx tsc --noEmit`
  - `npm run lint`
- Respond with: ✅ Pass — Phase X Step NN, or ❌ Fail — Phase X Step NN + error/output.
- Only then do we move to the next step.
- After every ✅ Pass: update the Progress Log in this file (one-file step).

## Guardrails

- Episode must belong to a Show (optional Season). No orphan episodes.
- Show Hub must render a canonical episode list for a show (not assembled from a single feed bucket).
- Feed contracts remain stable once introduced (EpisodeWithShow includes show + episode identifiers and S/E numbers).
- Specials: allowed as secondary content; not part of a Show, but must attach to at least one Show or Topic (e.g., recap, trailer, behind-the-scenes, Q&A).
- “Continue Watching” is a resume pointer: one entry per show with a target episode.

## Phases

### Phase 0 — Baseline & Guardrails

- Phase 0 — Step 01: Project scaffold (Expo + router) + basic tabs
- Phase 0 — Step 02: Route conventions + safe navigation helpers (avoid unmatched routes)
- Phase 0 — Step 03: Baseline smoke checklist documented (Home → Show → Episode)
- Phase 0 — Step 04: Lint + TypeScript baseline (tsc/lint must pass)
- Phase 0 — Step 05: API mock layer introduced (feed + mixed feed stubs)
- Phase 0 — Step 06: Step protocol locked (Pass must include Phase/Step)

### Phase 1 — ShowFeed Engine

- Phase 1 — Step 01: Feed boundary + multi-feed types wired to UI
- Phase 1 — Step 02: Show hub route + episode list by show
- Phase 1 — Step 03: Episode route + previous/up-next + S/E badge + next drop placeholder
- Phase 1 — Step 04: Specials: mixed feed + special route + special→show
- Phase 1 — Step 05: Special→Topic navigation + Topic route
- Phase 1 — Step 06: Topic→Special navigation (topic rows navigate to /special/[id])
- Phase 1 — Step 07: Topic→Show navigation from Attached Shows list
- Phase 1 — Step 08: Topic hub: episode rows navigate to /episode/[id]
- Phase 1 — Step 09: Show Hub surfaces specials + episodes cleanly (confirm both sections + navigation)
- Phase 1 — Step 10: Ensure topic has attached shows (derive from specials)
- Phase 1 — Step 11: Navigation from topic attached shows to show hubs
- Phase 1 — Step 12: Continue Watching feed type support (resume pointer semantics)
- Phase 1 — Step 13: Season-based grouping in show hub
- Phase 1 — Step 14: Show Hub season headers tappable collapse/expand
- Phase 1 — Step 15: Show Hub entrypoint polish: highlight + scroll to current episode when episodeId provided
- Phase 1 — Step 16: Continue Watching deep-link into show hub with highlight/scroll target
- Phase 1 — Step 17: Add "New Shows Only" feed type support (one item per show; pilot semantics)
- Phase 1 — Step 18: Canonical show-centric API: `getShowEpisodes(showId)`
- Phase 1 — Step 19: Show hub uses `getShowEpisodes(showId)` (no feed-pool assembly)
- Phase 1 — Step 20: Canonical contract hardening (normalize season/episode numbers; stable sorting)
- Phase 1 — Step 21: Continue Watching semantics hardening (one resume entry per show; no per-episode spam)
- Phase 1 — Step 22: Show Hub “Up Next” logic uses canonical list (episodeId → next episode)
- Phase 1 — Step 23: “Previously on…” placeholder section (data shape + UI stub)
- Phase 1 — Step 24: “Next episode drops in…” placeholder (data shape + UI stub)
- Phase 1 — Step 25: Algorithm controls v1 (local toggles affect feed selection; no ranking yet)
- Phase 1 — Step 26: Topic hub v2 (shows + episodes aggregated discovery view)
- Phase 1 — Step 27: Search stub (UI + mock results for shows/topics)
- Phase 1 — Step 28: Writers Room entrypoints (routes/UI stubs from show hub)
- Phase 1 — Step 29: Performance pass (FlatList keys, memo boundaries, reduce rerenders on toggles)
- Phase 1 — Step 30: Phase 1 hardening sweep (no unmatched routes + smoke checklist update)

  #### Hardening Proof
  - `npx tsc --noEmit`
  - `npm run lint`

### Phase 2 — Capture & Creation

- Phase 2 — Step 01: Creator entrypoint: “Create Episode” routes to capture flow (UI only)
- Phase 2 — Step 02: Capture screen scaffold (permissions + placeholder record UI)
- Phase 2 — Step 03: Upload pipeline stub (mock upload; progress + retry)
- Phase 2 — Step 04: Drafts v1 (save draft metadata locally; list drafts)
- Phase 2 — Step 05: Cliffhanger/hook templates v1 (select template; store on draft)
- Phase 2 — Step 06: Scheduling v1 (“next drop” date stored on episode)
- Phase 2 — Step 07: “Previously on” builder v1 (select prior episodes; store recap refs)
- Phase 2 — Step 08: Background upload safety v1 (resume upload when app returns)
- Phase 2 — Step 09: Create Show flow v1 (show title + topic selection)
- Phase 2 — Step 10: Episode publish v1 (draft → published; appears in show hub)
- Phase 2 — Step 11: Media playback reliability pass (buffer/loading states; no crashes)
- Phase 2 — Step 12: Creator QA smoke run (create show → create episode → publish → appears)

### Phase 3 — Social + Discovery + Interactive Story

- Phase 3 — Step 01: Follow graph v1 (follow creator/show; store locally)
- Phase 3 — Step 02: Feed personalization v1 (following feed vs discovery feed toggle)
- Phase 3 — Step 03: Topics/hashtags v1 (tag shows/episodes; topic discovery improves)
- Phase 3 — Step 04: Writers Room v1 (invite co-creator; roles: owner/editor/viewer)
- Phase 3 — Step 05: Draft sharing v1 (share draft with writers room)
- Phase 3 — Step 06: Stitch scenes v1 (ordered list of clips; render order)
- Phase 3 — Step 07: Polls v1 (episode contains poll; viewer can vote)
- Phase 3 — Step 08: Poll results influence “next episode prompt” placeholder
- Phase 3 — Step 09: Comments v1 (episode comments; basic post)
- Phase 3 — Step 10: Notifications v1 (invites, new episode, poll posted)
- Phase 3 — Step 11: Discovery surfaces v1 (Trending shows/topics mock)
- Phase 3 — Step 12: Phase 3 hardening sweep (navigation + state persistence smoke)

### Phase 4 — Monetization + Safety

- Phase 4 — Step 01: Entitlements model v1 (season pass per show; mock purchase)
- Phase 4 — Step 02: Tips per show v1 (mock tip flow; receipt UI)
- Phase 4 — Step 03: Creator earnings dashboard stub (UI only)
- Phase 4 — Step 04: Content reporting hooks (report episode/show)
- Phase 4 — Step 05: Rate limit + abuse guard stubs (local throttles)
- Phase 4 — Step 06: Moderation queue stub (flagged content list UI)
- Phase 4 — Step 07: Privacy controls v1 (hide show/hide episodes; mock)
- Phase 4 — Step 08: Phase 4 hardening sweep (end-to-end smoke + no regressions run)

## Auth & Accounts

Phase A0 — Auth foundations (during Phase 1 hardening)

- Phase A0 — Step 01: Auth decision + provider + token strategy
- Phase A0 — Step 02: App auth shell (unauth stack vs authed tabs) + route gating
- Phase A0 — Step 03: Session persistence (secure storage) + logout
- Phase A0 — Step 04: API client auth header + 401 handling (redirect/refresh)

Phase A1 — Auth flows (start of Phase 2)

- Phase A1 — Step 01: Login screen UI + validation
- Phase A1 — Step 02: Signup screen UI + validation
- Phase A1 — Step 03: Password reset / magic link verify flow
- Phase A1 — Step 04: Profile minimal (username/avatar) + edit

Phase A2 — Roles & permissions (Phase 3)

- Phase A2 — Step 01: Writers Room roles enforced (owner/editor/viewer)
- Phase A2 — Step 02: Creator-only actions gated (create/publish)

## UX & Design System

Phase U0 — Design system (during Phase 1)

- Phase U0 — Step 01: Design tokens (colors/spacing/typography) + light/dark rules
- Phase U0 — Step 02: Component kit baseline (buttons/cards/chips/headers)
- Phase U0 — Step 03: Navigation patterns (modal/sheet/back behavior)
- Phase U0 — Step 04: Standard loading/empty/error states

Phase U1 — Screen polish passes (Phases 2–3)
(buttons/cards/chips/headers)

- Phase U0 — Step 03: Navigation patterns (modal/sheet/back behavior)
- Phase U0 — Step 04: Standard loading/empty/error states

Phase U1 — Screen polish passes (Phases 2–3)

- Phase U1 — Step 01: Feed UI polish pass
- Phase U1 — Step 02: Show Hub UI polish pass
- Phase U1 — Step 03: Episode detail UI polish pass
- Phase U1 — Step 04: Creator flow UX polish (draft/upload/retry)

## Data Layer & Backend (Database + APIs)

This workstream introduces real persistence and APIs. It runs alongside Phases 2–4 once Phase 1 contracts are stable.

### Phase D0 — Data Contracts & Storage Choice (after Phase 1 core contracts)

- Phase D0 — Step 01: Choose persistence stack + hosting target (e.g., Postgres + Prisma/Drizzle or Mongo + Mongoose)
- Phase D0 — Step 02: Define canonical schemas: User, Show, Season(optional), Episode, Special, Topic, WritersRoomMembership
- Phase D0 — Step 03: ID strategy + indexing plan + join tables (TopicShows, SpecialShows, SpecialTopics)
- Phase D0 — Step 04: API contracts frozen v1 + versioning rules
- Phase D0 — Step 05: Users schema + sessions/refresh tokens (or provider mapping)

### Phase D1 — Core Read APIs

- Phase D1 — Step 01: Implement `GET /shows/:id` + `GET /shows/:id/episodes` (canonical list)
- Phase D1 — Step 02: Implement `GET /feed/new`, `GET /feed/newShowsOnly`, `GET /feed/continue`
- Phase D1 — Step 03: Implement `GET /topics/:id` (attached shows + aggregation)
- Phase D1 — Step 04: Replace mocks with real API client behind a feature flag

### Phase D2 — Write APIs (Creation)

- Phase D2 — Step 01: `POST /shows` create show
- Phase D2 — Step 02: `POST /episodes` create draft episode + metadata
- Phase D2 — Step 03: Upload session model (pre-signed URLs or direct upload) + status tracking
- Phase D2 — Step 04: Publish workflow (draft → published) + feed inclusion rules
- Phase D2 — Step 05: Auth endpoints/provider integration (login/signup/refresh/logout)

### Phase D3 — Social/Interactive Persistence

- Phase D3 — Step 01: Follows + Writers Room invites/membership
- Phase D3 — Step 02: Polls + votes
- Phase D3 — Step 03: Comments + moderation flags

### Phase D4 — Monetization/Safety Persistence

- Phase D4 — Step 01: Entitlements (season pass per show)
- Phase D4 — Step 02: Tips/transactions ledger
- Phase D4 — Step 03: Reports + moderation queue + audit trail

## Progress Log

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
- [x] Phase 1 — Step 24: “Next drop in…” scheduling placeholder (data shape only; UI placeholder)
- [x] Phase 1 — Step 25: Algorithm controls v1 (local toggles affect feed selection; no ranking yet)
- [x] Phase 1 — Step 26: Topic hub v2 (shows + episodes aggregated discovery view)
- [x] Phase 1 — Step 27: Explore search stub (search input filters mock Shows + Topics; tap navigates to /show/[id] and /topic/[id])
- [x] Phase 1 — Step 28: Search results v1 from real data (use existing feed/mock sources; no backend yet)
- [x] Phase 1 — Step 29: Library tab v1 (saved shows/topics + continue watching entrypoint)
- [x] Phase 1 — Step 30: Phase 1 hardening sweep (no unmatched routes + smoke checklist update)
- [ ] Phase 2 — Step 01 CURRENT: Creator entrypoint: “Create Episode” routes to capture flow (UI only)
- [ ] Phase 2 — Step 02 NEXT: Capture screen scaffold (permissions + placeholder record UI)

## Definition of Done (per step)

- App runs with no red screens.
- No new console errors/warnings introduced (or explicitly accepted).
- Key flows still work for what’s already implemented (smoke-click checklist for impacted screens).
- Exports/routes remain unchanged unless the step explicitly says they will change.
- `npx tsc --noEmit` passes.
- `npm run lint` passes.
- Acceptance Criteria met and confirmed ✅ Pass — Phase X Step NN before moving on.
