# Episodic Build Plan

## 1. Product Vision

Episodic is a series-first social video app centered around Shows. Users create Shows instead of random posts, and each Show contains ordered Episodes. Viewers follow Shows, not just creators, so they can return to see what happens next. The product goal is to make serialized video feel easy to follow, resume, and anticipate.

## 2. Build Rules

- Only one phase and one step should be worked at a time.
- A step is not complete until its acceptance criteria pass.
- Future-phase features should not be built early.
- Existing completed work should not be reworked unless a defect is logged in Known Issues.
- Codex should propose file changes before applying them.
- Each step should keep changes minimal and focused.
- `plan.md` must be updated after every completed step.
- Files outside the current step's Files Allowed list should not be changed unless the plan is updated first.
- If a step reveals missing prerequisites, pause and update the plan before building around the gap.
- Verification must be recorded before marking a step complete.

## 3. Current Status

Current Phase: Phase 0 — Project Foundation  
Current Step: Step 0.1 — Create Build Plan  
Status: In Progress

## 4. Phase Roadmap

### Phase 0 — Project Foundation

Goal: Establish the app shell, routing, theme, folder structure, and development guardrails.

### Phase 1 — Shows

Goal: Make Shows the primary product object.

### Phase 2 — Episodes

Goal: Add ordered Episodes inside Shows.

### Phase 3 — Feed

Goal: Build a feed that surfaces Episodes while preserving Show context.

### Phase 4 — Follow Shows

Goal: Let users follow Shows and build a Show-based social graph.

### Phase 5 — Audience Interaction

Goal: Let viewers influence what happens next through polls and choices.

### Phase 6 — Continue Watching

Goal: Help viewers resume serialized content.

### Phase 7 — Previously On

Goal: Help viewers understand ongoing Shows with recap support.

### Phase 8 — Creator Collaboration

Goal: Add a Writers Room for co-creators and collaborative show planning.

### Phase 9 — Monetization

Goal: Add support for tipping, premium episodes, or season passes later.

## 5. Detailed Step List

## Phase 0 — Project Foundation

### Step 0.1 — Create Build Plan

Status: In Progress

Goal:
Create the `plan.md` file that will guide the entire build.

Acceptance Criteria:
- `plan.md` exists at the project root.
- `plan.md` includes product vision, build rules, phases, step list, acceptance criteria, progress log, decisions log, and out-of-scope list.
- No app code is changed.
- Current status is clearly marked.
- Next step is clearly identified.

Files Allowed:
- `plan.md`

Out of Scope:
- App screens
- Navigation
- Components
- Backend setup
- Database schema
- Mock data

Verification:
- Confirm `plan.md` was created.
- Confirm no other files were changed unless clearly explained.

### Step 0.2 — Confirm Project Foundation

Status: Not Started

Goal:
Inspect the existing project structure, dependencies, scripts, and Expo configuration before changing app behavior.

Acceptance Criteria:
- Existing project framework and routing setup are documented.
- Current package scripts are documented.
- Existing app folders and entry points are documented.
- Any setup gaps are logged in Known Issues.
- No feature code is added.

Files Allowed:
- `plan.md`

Out of Scope:
- New routes
- New components
- Theme changes
- Mock data
- Backend setup

Verification:
- Run a root file inspection.
- Review `package.json`, `app.json`, and existing app folder structure.
- Update `plan.md` with findings.

### Step 0.3 — Set Up Expo Router

Status: Not Started

Goal:
Ensure Expo Router is installed, configured, and used as the app navigation foundation.

Acceptance Criteria:
- Expo Router dependencies and configuration are present.
- Root layout exists and loads without errors.
- Initial route renders successfully.
- Changes are limited to routing setup.

Files Allowed:
- `package.json`
- `package-lock.json`
- `app.json`
- `app/_layout.tsx`
- `app/index.tsx`
- `plan.md`

Out of Scope:
- Bottom tabs
- Show screens
- Episode screens
- Feed logic
- Mock data

Verification:
- Run TypeScript or lint checks if available.
- Launch the app and confirm the root route renders.
- Update `plan.md` with completion notes.

### Step 0.4 — Add Bottom Tab Navigation

Status: Not Started

Goal:
Add the primary app navigation shell with bottom tabs.

Acceptance Criteria:
- Bottom tab layout exists.
- Initial tabs are minimal and aligned with near-term phases.
- Tabs render without navigation errors.
- Tab setup does not include future feature implementation.

Files Allowed:
- `app/_layout.tsx`
- `app/(tabs)/_layout.tsx`
- `app/(tabs)/index.tsx`
- `app/(tabs)/shows.tsx`
- `plan.md`

Out of Scope:
- Show detail screens
- Episode playback
- Feed algorithms
- Follow logic
- Polls

Verification:
- Run TypeScript or lint checks if available.
- Launch the app and confirm tabs render.
- Update `plan.md` with completion notes.

### Step 0.5 — Add Shared Theme

Status: Not Started

Goal:
Create a small shared theme for colors, spacing, typography, and basic UI constants.

Acceptance Criteria:
- Theme constants are centralized.
- Existing screens can import theme values.
- Theme scope is minimal and does not introduce a design system prematurely.
- No feature-specific styling is added.

Files Allowed:
- `src/theme/index.ts`
- `src/theme/colors.ts`
- `src/theme/spacing.ts`
- `src/theme/typography.ts`
- `plan.md`

Out of Scope:
- Complex component library
- Animations
- Brand illustration
- Feature screens
- User settings

Verification:
- Run TypeScript or lint checks if available.
- Confirm imports resolve.
- Update `plan.md` with completion notes.

### Step 0.6 — Add ThemedText and ThemedView

Status: Not Started

Goal:
Add basic reusable primitives for consistent text and layout styling.

Acceptance Criteria:
- `ThemedText` exists and supports core text variants.
- `ThemedView` exists and supports basic layout use.
- Components use the shared theme.
- Components remain generic and feature-neutral.

Files Allowed:
- `src/components/ThemedText.tsx`
- `src/components/ThemedView.tsx`
- `src/components/index.ts`
- `plan.md`

Out of Scope:
- Buttons
- Cards
- Forms
- Show-specific components
- Episode-specific components

Verification:
- Run TypeScript or lint checks if available.
- Confirm components can be imported.
- Update `plan.md` with completion notes.

### Step 0.7 — Establish Folder Conventions

Status: Not Started

Goal:
Define and create the minimal folder structure needed for upcoming phases.

Acceptance Criteria:
- Folder conventions are documented in `plan.md`.
- Only folders needed for near-term planned work are created.
- No placeholder feature files or mock data are added.
- Import conventions are clear.

Files Allowed:
- `src/components/`
- `src/features/`
- `src/theme/`
- `src/types/`
- `plan.md`

Out of Scope:
- Feature implementations
- Database folders
- API clients
- Mock data
- Tests for unbuilt features

Verification:
- Inspect folder structure.
- Confirm no feature code was added.
- Update `plan.md` with completion notes.

### Step 0.8 — Verify TypeScript and App Launch

Status: Not Started

Goal:
Confirm the foundation compiles, lints, and launches before product features begin.

Acceptance Criteria:
- TypeScript check passes if a script is available.
- Lint passes if a script is available.
- App launches successfully.
- Any remaining setup issues are logged.
- Phase 0 can be marked complete only after verification passes or accepted gaps are recorded.

Files Allowed:
- `plan.md`
- Configuration files only if verification reveals a required setup defect

Out of Scope:
- Product features
- UI polish
- New data models
- Backend setup
- Mock data

Verification:
- Run available check commands.
- Launch the app.
- Update `plan.md` with results and next phase.

## Phase 1 — Shows

### Step 1.1 — Define Show Types

Status: Not Started

Goal:
Define the TypeScript types that describe a Show as the primary product object.

Acceptance Criteria:
- Show type includes identity, title, description, creator reference, visibility, timestamps, and ordering-ready metadata.
- Types avoid backend-specific assumptions.
- No UI is built.

Files Allowed:
- `src/types/show.ts`
- `src/types/index.ts`
- `plan.md`

Out of Scope:
- Show data storage
- Show screens
- Episode types
- Follow logic

Verification:
- Run TypeScript check if available.
- Confirm exports resolve.
- Update `plan.md`.

### Step 1.2 — Add Show Data Model Placeholder

Status: Not Started

Goal:
Add a minimal local placeholder boundary for Show data access without committing to a final backend.

Acceptance Criteria:
- A Show data boundary exists.
- Data access shape supports list, get by id, create, and update later.
- No persistent backend is introduced.
- No mock catalog is added beyond what is required for development scaffolding.

Files Allowed:
- `src/features/shows/data/`
- `src/features/shows/types.ts`
- `plan.md`

Out of Scope:
- Database schema
- Authentication
- Real API calls
- Feed integration

Verification:
- Run TypeScript check if available.
- Confirm no app UI behavior changes unless planned.
- Update `plan.md`.

### Step 1.3 — Create Show List UI

Status: Not Started

Goal:
Create the first UI for browsing Shows.

Acceptance Criteria:
- Show list screen renders available Shows.
- Empty state is present.
- UI treats Shows as the primary object.
- Navigation to detail is prepared or implemented only if allowed by routing state.

Files Allowed:
- `app/(tabs)/shows.tsx`
- `src/features/shows/components/`
- `src/features/shows/screens/`
- `plan.md`

Out of Scope:
- Episode lists
- Follow buttons
- Creator profiles
- Feed ranking

Verification:
- Run available checks.
- Launch app and inspect Show list.
- Update `plan.md`.

### Step 1.4 — Create Show Detail Screen

Status: Not Started

Goal:
Create a detail screen that frames a Show as a serialized destination.

Acceptance Criteria:
- Show detail route exists.
- Show title, description, creator, visibility, and basic metadata render.
- Episode area is reserved only if Phase 2 has not started.
- Missing Show state is handled.

Files Allowed:
- `app/shows/[showId].tsx`
- `src/features/shows/screens/`
- `src/features/shows/components/`
- `plan.md`

Out of Scope:
- Episode implementation
- Follow behavior
- Polls
- Monetization

Verification:
- Run available checks.
- Navigate from Show list to Show detail.
- Update `plan.md`.

### Step 1.5 — Add Create Show Screen

Status: Not Started

Goal:
Allow a user to create a Show shell.

Acceptance Criteria:
- Create Show route exists.
- Form includes required Show fields.
- Validation covers required inputs.
- Successful create follows the placeholder data boundary.

Files Allowed:
- `app/shows/new.tsx`
- `src/features/shows/screens/`
- `src/features/shows/components/`
- `src/features/shows/data/`
- `plan.md`

Out of Scope:
- Episode creation
- Image upload
- Payments
- Collaboration

Verification:
- Run available checks.
- Manually create a Show in the app flow.
- Update `plan.md`.

### Step 1.6 — Add Edit Show Support

Status: Not Started

Goal:
Allow editing basic Show metadata.

Acceptance Criteria:
- Edit Show route or state exists.
- Existing Show data populates the form.
- Updates persist through the placeholder data boundary.
- Missing or unauthorized states are handled at a placeholder level.

Files Allowed:
- `app/shows/[showId]/edit.tsx`
- `src/features/shows/screens/`
- `src/features/shows/components/`
- `src/features/shows/data/`
- `plan.md`

Out of Scope:
- Episode editing
- Role permissions beyond placeholders
- Collaboration
- Analytics

Verification:
- Run available checks.
- Manually edit a Show.
- Update `plan.md`.

### Step 1.7 — Add Public/Private Show Visibility Rules

Status: Not Started

Goal:
Add basic visibility behavior for public and private Shows.

Acceptance Criteria:
- Show visibility field is respected in list and detail behavior.
- Private Shows are not shown in public browsing surfaces.
- Visibility rules are centralized enough to avoid duplication.
- Limitations are documented.

Files Allowed:
- `src/features/shows/`
- `src/types/show.ts`
- `plan.md`

Out of Scope:
- Full authentication
- Role-based access control
- Backend security rules
- Follow requests

Verification:
- Run available checks.
- Confirm public/private filtering behavior.
- Update `plan.md`.

## Phase 2 — Episodes

### Step 2.1 — Define Episode Types

Status: Not Started

Goal:
Define TypeScript types for ordered Episodes inside Shows.

Acceptance Criteria:
- Episode type includes identity, show reference, title, description, season number, episode number, status, timestamps, and optional video placeholder fields.
- Types support ordering inside a Show.
- No UI is built.

Files Allowed:
- `src/types/episode.ts`
- `src/types/index.ts`
- `plan.md`

Out of Scope:
- Episode screens
- Video playback
- Polls
- Recaps

Verification:
- Run TypeScript check if available.
- Confirm exports resolve.
- Update `plan.md`.

### Step 2.2 — Add Episode Data Model Placeholder

Status: Not Started

Goal:
Add a minimal data boundary for Episode access inside Shows.

Acceptance Criteria:
- Episode data boundary supports list by Show, get by id, create, and update later.
- Episode ordering is preserved.
- No final backend is introduced.

Files Allowed:
- `src/features/episodes/data/`
- `src/features/episodes/types.ts`
- `plan.md`

Out of Scope:
- Real video hosting
- Feed integration
- Watch tracking
- Polls

Verification:
- Run TypeScript check if available.
- Confirm ordering behavior at the data boundary.
- Update `plan.md`.

### Step 2.3 — Add Episode List to Show Detail

Status: Not Started

Goal:
Show ordered Episodes on the Show detail screen.

Acceptance Criteria:
- Show detail displays Episodes in season and episode order.
- Empty state is present.
- Episode rows preserve Show context.
- No feed behavior is added.

Files Allowed:
- `app/shows/[showId].tsx`
- `src/features/shows/`
- `src/features/episodes/`
- `plan.md`

Out of Scope:
- Episode playback
- Continue watching
- Recaps
- Polls

Verification:
- Run available checks.
- Inspect Show detail with and without Episodes.
- Update `plan.md`.

### Step 2.4 — Create Episode Detail Screen

Status: Not Started

Goal:
Create a detail screen for a single Episode.

Acceptance Criteria:
- Episode detail route exists.
- Episode title, description, numbering, and Show context render.
- Missing Episode state is handled.
- Navigation back to Show is available.

Files Allowed:
- `app/episodes/[episodeId].tsx`
- `src/features/episodes/screens/`
- `src/features/episodes/components/`
- `plan.md`

Out of Scope:
- Video playback
- Polls
- Watch tracking
- Recaps

Verification:
- Run available checks.
- Navigate from Show detail to Episode detail.
- Update `plan.md`.

### Step 2.5 — Add Create Episode Screen

Status: Not Started

Goal:
Allow creators to add Episodes to a Show.

Acceptance Criteria:
- Create Episode route exists.
- Form includes required Episode fields.
- Episode is associated with a Show.
- Ordering fields are validated.

Files Allowed:
- `app/shows/[showId]/episodes/new.tsx`
- `src/features/episodes/screens/`
- `src/features/episodes/components/`
- `src/features/episodes/data/`
- `plan.md`

Out of Scope:
- Video upload
- Poll creation
- Recap creation
- Monetization

Verification:
- Run available checks.
- Manually create an Episode for a Show.
- Update `plan.md`.

### Step 2.6 — Add Season and Episode Numbering

Status: Not Started

Goal:
Normalize how Episodes are numbered and displayed inside Shows.

Acceptance Criteria:
- Season and Episode labels are generated consistently.
- Duplicate numbering in the same Show is prevented or flagged.
- Sorting uses season and episode number.
- Display format is reused across screens.

Files Allowed:
- `src/features/episodes/`
- `src/types/episode.ts`
- `plan.md`

Out of Scope:
- Multi-season UI management beyond numbering
- Playback queues
- Continue watching
- Recaps

Verification:
- Run available checks.
- Confirm sorted display and duplicate handling.
- Update `plan.md`.

### Step 2.7 — Add Video Placeholder Support

Status: Not Started

Goal:
Represent Episode video availability without implementing full upload or streaming.

Acceptance Criteria:
- Episode can show a placeholder video state.
- UI distinguishes unavailable, processing, and available placeholder states.
- No real video upload or streaming service is added.

Files Allowed:
- `src/types/episode.ts`
- `src/features/episodes/`
- `plan.md`

Out of Scope:
- Video upload
- Transcoding
- CDN setup
- Player analytics

Verification:
- Run available checks.
- Inspect Episode detail video placeholder states.
- Update `plan.md`.

## Phase 3 — Feed

### Step 3.1 — Create Home Feed Layout

Status: Not Started

Goal:
Create the base Home feed layout.

Acceptance Criteria:
- Home feed route renders.
- Feed layout supports Episode cards.
- Empty and loading states exist.
- Feed remains Episode-focused while preserving Show context.

Files Allowed:
- `app/(tabs)/index.tsx`
- `src/features/feed/`
- `plan.md`

Out of Scope:
- Ranking algorithm
- Follow filtering
- Recommendations
- Ads

Verification:
- Run available checks.
- Launch app and inspect Home feed.
- Update `plan.md`.

### Step 3.2 — Display Recent Public Episodes

Status: Not Started

Goal:
Show recent public Episodes in the Home feed.

Acceptance Criteria:
- Feed includes only Episodes from public Shows.
- Episodes are sorted by publish or creation recency.
- Empty state handles no public Episodes.
- Visibility rules are reused.

Files Allowed:
- `src/features/feed/`
- `src/features/episodes/`
- `src/features/shows/`
- `plan.md`

Out of Scope:
- Personalized ranking
- Follow filtering
- Ads
- Recommendations

Verification:
- Run available checks.
- Confirm private Show Episodes do not appear.
- Update `plan.md`.

### Step 3.3 — Preserve Show Context on Feed Cards

Status: Not Started

Goal:
Ensure every feed Episode card clearly identifies its Show.

Acceptance Criteria:
- Feed cards display Show title and Episode numbering.
- Users can understand the serialized context without opening detail screens.
- Card component remains reusable.

Files Allowed:
- `src/features/feed/components/`
- `src/features/feed/`
- `plan.md`

Out of Scope:
- Follow buttons
- Polls
- Recommendations
- Creator profiles

Verification:
- Run available checks.
- Inspect feed cards for Show context.
- Update `plan.md`.

### Step 3.4 — Navigate from Feed to Episode

Status: Not Started

Goal:
Allow feed users to open an Episode detail screen.

Acceptance Criteria:
- Tapping an Episode card opens Episode detail.
- Navigation passes the correct Episode identity.
- Missing Episode states remain handled.

Files Allowed:
- `src/features/feed/`
- `app/(tabs)/index.tsx`
- `plan.md`

Out of Scope:
- Autoplay
- Watch tracking
- Comments
- Poll voting

Verification:
- Run available checks.
- Navigate from feed to Episode detail.
- Update `plan.md`.

### Step 3.5 — Navigate from Feed to Show

Status: Not Started

Goal:
Allow feed users to open the parent Show from a feed item.

Acceptance Criteria:
- Feed card provides a clear route to Show detail.
- Navigation passes the correct Show identity.
- Episode navigation and Show navigation do not conflict.

Files Allowed:
- `src/features/feed/`
- `app/(tabs)/index.tsx`
- `plan.md`

Out of Scope:
- Follow behavior
- Creator profiles
- Recommendations
- Continue watching

Verification:
- Run available checks.
- Navigate from feed to Show detail.
- Update `plan.md`.

## Phase 4 — Follow Shows

### Step 4.1 — Define Show Follow Data Model

Status: Not Started

Goal:
Define how a user follows a Show.

Acceptance Criteria:
- Follow type includes user reference, Show reference, timestamps, and status if needed.
- Data shape supports follow and unfollow behavior.
- Model follows Show-first social graph assumptions.

Files Allowed:
- `src/types/follow.ts`
- `src/features/follows/`
- `plan.md`

Out of Scope:
- Creator follows
- Direct messaging
- Push notifications
- Recommendations

Verification:
- Run TypeScript check if available.
- Confirm exports resolve.
- Update `plan.md`.

### Step 4.2 — Add Follow/Unfollow Button

Status: Not Started

Goal:
Let users follow or unfollow Shows.

Acceptance Criteria:
- Show detail includes follow/unfollow control.
- Button state reflects current follow state.
- Toggle behavior uses the follow data boundary.
- Private Show limitations are handled.

Files Allowed:
- `src/features/follows/`
- `src/features/shows/`
- `app/shows/[showId].tsx`
- `plan.md`

Out of Scope:
- Push notifications
- Follower lists
- Creator follows
- Paid subscriptions

Verification:
- Run available checks.
- Toggle follow state on a Show.
- Update `plan.md`.

### Step 4.3 — Display Follower Count

Status: Not Started

Goal:
Show follower count for a Show.

Acceptance Criteria:
- Show detail displays follower count.
- Count updates after follow/unfollow.
- Count display handles zero followers.

Files Allowed:
- `src/features/follows/`
- `src/features/shows/`
- `app/shows/[showId].tsx`
- `plan.md`

Out of Scope:
- Follower identity list
- Analytics dashboard
- Notifications
- Social sharing

Verification:
- Run available checks.
- Confirm follower count behavior.
- Update `plan.md`.

### Step 4.4 — Add Followed Shows List

Status: Not Started

Goal:
Give users a place to view Shows they follow.

Acceptance Criteria:
- Followed Shows list renders followed Shows.
- Empty state is present.
- List routes to Show detail.

Files Allowed:
- `app/(tabs)/following.tsx`
- `src/features/follows/`
- `src/features/shows/`
- `plan.md`

Out of Scope:
- Feed filtering
- Notifications
- Creator following
- Recommendations

Verification:
- Run available checks.
- Inspect followed Shows list.
- Update `plan.md`.

### Step 4.5 — Add Followed Shows Feed Filter

Status: Not Started

Goal:
Allow feed users to filter Episodes to followed Shows.

Acceptance Criteria:
- Feed can show all public Episodes or followed Show Episodes.
- Filter state is clear.
- Empty state handles no followed Shows or no Episodes.
- Existing visibility rules still apply.

Files Allowed:
- `src/features/feed/`
- `src/features/follows/`
- `app/(tabs)/index.tsx`
- `plan.md`

Out of Scope:
- Ranking algorithm
- Push notifications
- Recommendations
- Ads

Verification:
- Run available checks.
- Confirm filter behavior.
- Update `plan.md`.

## Phase 5 — Audience Interaction

### Step 5.1 — Define Episode Poll Types

Status: Not Started

Goal:
Define types for Episode polls and viewer choices.

Acceptance Criteria:
- Poll type supports prompt, choices, status, Episode reference, and result counts.
- Vote type supports user reference, poll reference, and selected choice.
- Types do not assume a final backend.

Files Allowed:
- `src/types/poll.ts`
- `src/features/polls/`
- `plan.md`

Out of Scope:
- Poll UI
- Voting behavior
- Real-time updates
- Comments

Verification:
- Run TypeScript check if available.
- Confirm exports resolve.
- Update `plan.md`.

### Step 5.2 — Add Poll Creation Support

Status: Not Started

Goal:
Allow creators to add a poll to an Episode.

Acceptance Criteria:
- Poll creation UI exists in the Episode creation or edit flow.
- At least two choices are required.
- Poll is associated with an Episode.
- Validation prevents invalid poll states.

Files Allowed:
- `src/features/polls/`
- `src/features/episodes/`
- `plan.md`

Out of Scope:
- Voting
- Poll results
- Comments
- Recommendations

Verification:
- Run available checks.
- Create an Episode poll manually.
- Update `plan.md`.

### Step 5.3 — Display Poll on Episode Detail

Status: Not Started

Goal:
Show an Episode poll to viewers.

Acceptance Criteria:
- Episode detail displays active poll prompt and choices.
- Closed or missing poll states are handled.
- Poll display does not allow duplicate voting yet unless Step 5.4 is complete.

Files Allowed:
- `src/features/polls/`
- `src/features/episodes/`
- `app/episodes/[episodeId].tsx`
- `plan.md`

Out of Scope:
- Vote persistence
- Results display
- Real-time updates
- Comments

Verification:
- Run available checks.
- Inspect Episode detail with and without a poll.
- Update `plan.md`.

### Step 5.4 — Allow One Vote Per User

Status: Not Started

Goal:
Allow each user to vote once per Episode poll.

Acceptance Criteria:
- Vote action records one choice per user per poll.
- Existing vote state prevents duplicate votes.
- User can see their selected choice.
- Anonymous or placeholder user behavior is documented.

Files Allowed:
- `src/features/polls/`
- `app/episodes/[episodeId].tsx`
- `plan.md`

Out of Scope:
- Vote changing unless explicitly planned
- Real-time results
- Authentication hardening
- Notifications

Verification:
- Run available checks.
- Attempt duplicate voting and confirm prevention.
- Update `plan.md`.

### Step 5.5 — Show Poll Results

Status: Not Started

Goal:
Show poll results after voting or when a poll is closed.

Acceptance Criteria:
- Results display vote counts or percentages.
- Results state appears only when allowed.
- Zero-vote state is handled.
- Selected choice remains clear.

Files Allowed:
- `src/features/polls/`
- `app/episodes/[episodeId].tsx`
- `plan.md`

Out of Scope:
- Real-time updates
- Advanced analytics
- Comments
- Creator dashboards

Verification:
- Run available checks.
- Vote and confirm results display.
- Update `plan.md`.

## Phase 6 — Continue Watching

### Step 6.1 — Track Watched Episodes

Status: Not Started

Goal:
Track which Episodes a viewer has watched.

Acceptance Criteria:
- Watched Episode type or state exists.
- Episode detail can mark an Episode watched.
- Tracking is scoped to a placeholder user if auth is not complete.
- Data model supports future backend persistence.

Files Allowed:
- `src/types/watch.ts`
- `src/features/watch/`
- `src/features/episodes/`
- `plan.md`

Out of Scope:
- Playback progress timing
- Notifications
- Recommendations
- Analytics

Verification:
- Run available checks.
- Mark an Episode watched.
- Update `plan.md`.

### Step 6.2 — Determine Next Unwatched Episode

Status: Not Started

Goal:
Identify the next Episode a viewer should watch for each Show.

Acceptance Criteria:
- Utility returns the next unwatched Episode by Show.
- Ordering respects season and episode number.
- Completed Shows are handled.
- Missing watch state is handled.

Files Allowed:
- `src/features/watch/`
- `src/features/episodes/`
- `plan.md`

Out of Scope:
- UI sections
- Recommendations
- Notifications
- Autoplay

Verification:
- Run available checks.
- Confirm next Episode logic with multiple watch states.
- Update `plan.md`.

### Step 6.3 — Add Continue Watching Section

Status: Not Started

Goal:
Add a section that helps viewers resume Shows.

Acceptance Criteria:
- Continue Watching section appears on the Home feed or appropriate tab.
- Section shows next unwatched Episodes.
- Empty state is present.
- Show context is visible.

Files Allowed:
- `src/features/watch/`
- `src/features/feed/`
- `app/(tabs)/index.tsx`
- `plan.md`

Out of Scope:
- Push notifications
- Advanced recommendations
- Playback progress bars unless separately planned
- Ads

Verification:
- Run available checks.
- Inspect Continue Watching behavior.
- Update `plan.md`.

### Step 6.4 — Deduplicate Continue Watching by Show

Status: Not Started

Goal:
Ensure Continue Watching shows one next Episode per Show.

Acceptance Criteria:
- Section does not show multiple Episodes from the same Show.
- The selected Episode is the earliest unwatched Episode.
- Completed Shows are omitted or clearly marked.

Files Allowed:
- `src/features/watch/`
- `src/features/feed/`
- `plan.md`

Out of Scope:
- Recommendation ranking
- Notifications
- Creator analytics
- Playback queues

Verification:
- Run available checks.
- Confirm one item per Show.
- Update `plan.md`.

### Step 6.5 — Route to Correct Episode

Status: Not Started

Goal:
Open the correct next Episode from Continue Watching.

Acceptance Criteria:
- Tapping Continue Watching opens the expected Episode detail.
- Route includes correct Episode identity.
- Missing Episode state remains handled.

Files Allowed:
- `src/features/watch/`
- `src/features/feed/`
- `app/(tabs)/index.tsx`
- `plan.md`

Out of Scope:
- Autoplay
- Notifications
- Recommendations
- Poll prioritization

Verification:
- Run available checks.
- Navigate from Continue Watching to Episode detail.
- Update `plan.md`.

## Phase 7 — Previously On

### Step 7.1 — Add Recap Field to Episode

Status: Not Started

Goal:
Add Episode recap support for serialized viewing.

Acceptance Criteria:
- Episode type supports an optional recap field.
- Create or edit Episode flow can capture recap text if those flows exist.
- Existing Episodes without recaps render safely.

Files Allowed:
- `src/types/episode.ts`
- `src/features/episodes/`
- `plan.md`

Out of Scope:
- AI-generated recaps
- Video recap clips
- Recap analytics
- Notifications

Verification:
- Run available checks.
- Confirm Episode detail handles recap and no-recap states.
- Update `plan.md`.

### Step 7.2 — Display Previously On Section

Status: Not Started

Goal:
Show recap context before or near an Episode.

Acceptance Criteria:
- Episode detail displays a Previously On section when recap exists.
- Section is hidden when recap is missing.
- Display supports serialized Show context.

Files Allowed:
- `src/features/episodes/`
- `app/episodes/[episodeId].tsx`
- `plan.md`

Out of Scope:
- AI recap generation
- Collapsible behavior
- Playback gating
- Analytics

Verification:
- Run available checks.
- Inspect Episode detail with and without recap.
- Update `plan.md`.

### Step 7.3 — Allow Recap Collapse/Skip

Status: Not Started

Goal:
Let viewers collapse or skip recap content.

Acceptance Criteria:
- Recap section can be collapsed or skipped.
- Default state is sensible for serialized viewing.
- Interaction does not affect Episode watch state.

Files Allowed:
- `src/features/episodes/`
- `app/episodes/[episodeId].tsx`
- `plan.md`

Out of Scope:
- Persistent user preference
- AI summaries
- Video recap clips
- Analytics

Verification:
- Run available checks.
- Toggle recap visibility.
- Update `plan.md`.

### Step 7.4 — Show Recap Before Episode Playback

Status: Not Started

Goal:
Place recap context before Episode playback or placeholder playback.

Acceptance Criteria:
- Previously On content appears before playback area when present.
- Skip or collapse behavior remains available.
- Missing recap state does not leave blank UI.

Files Allowed:
- `src/features/episodes/`
- `app/episodes/[episodeId].tsx`
- `plan.md`

Out of Scope:
- Full video player
- AI-generated recaps
- Playback analytics
- Recommendations

Verification:
- Run available checks.
- Inspect Episode detail layout.
- Update `plan.md`.

## Phase 8 — Creator Collaboration

### Step 8.1 — Define Writers Room Concept

Status: Not Started

Goal:
Define the collaboration model for Show co-creators before implementation.

Acceptance Criteria:
- Writers Room roles and permissions are documented.
- Collaboration boundaries are listed.
- Implementation steps are added before code changes begin.

Files Allowed:
- `plan.md`

Out of Scope:
- Collaboration UI
- Invitations
- Real-time editing
- Comments

Verification:
- Review documented roles and boundaries.
- Update next implementation steps.

### Step 8.2 — Add Writers Room Data Types

Status: Not Started

Goal:
Define types for Show collaborators and planning artifacts.

Acceptance Criteria:
- Collaborator type includes Show reference, user reference, role, and status.
- Planning artifact types are minimal and Show-scoped.
- Permissions are represented without backend assumptions.

Files Allowed:
- `src/types/collaboration.ts`
- `src/features/collaboration/`
- `plan.md`

Out of Scope:
- Real-time collaboration
- Invitations
- Chat
- Direct messaging

Verification:
- Run TypeScript check if available.
- Confirm exports resolve.
- Update `plan.md`.

### Step 8.3 — Add Writers Room Entry Point

Status: Not Started

Goal:
Expose a Show-scoped entry point for collaboration.

Acceptance Criteria:
- Eligible creators can access a Writers Room entry point from Show detail.
- Ineligible viewers do not see creator-only controls.
- Placeholder permission behavior is documented.

Files Allowed:
- `src/features/collaboration/`
- `src/features/shows/`
- `app/shows/[showId].tsx`
- `plan.md`

Out of Scope:
- Real-time editing
- Chat
- Comments
- Notifications

Verification:
- Run available checks.
- Inspect creator and viewer states.
- Update `plan.md`.

## Phase 9 — Monetization

### Step 9.1 — Define Monetization Strategy

Status: Not Started

Goal:
Choose and document the first monetization path before implementation.

Acceptance Criteria:
- Tipping, premium Episodes, and season passes are compared.
- First monetization option is selected or deferred.
- Risks and dependencies are documented.
- No payment code is added.

Files Allowed:
- `plan.md`

Out of Scope:
- Payment integration
- Premium UI
- Subscription logic
- Revenue analytics

Verification:
- Review decision entry.
- Update next implementation steps only after a decision is made.

### Step 9.2 — Add Monetization Types

Status: Not Started

Goal:
Define minimal types for the selected monetization path.

Acceptance Criteria:
- Types match the selected strategy.
- Types avoid payment processor assumptions where possible.
- Access states are represented clearly.

Files Allowed:
- `src/types/monetization.ts`
- `src/features/monetization/`
- `plan.md`

Out of Scope:
- Payment processing
- Receipts
- Refunds
- Creator payouts

Verification:
- Run TypeScript check if available.
- Confirm exports resolve.
- Update `plan.md`.

### Step 9.3 — Add Monetization Placeholder UI

Status: Not Started

Goal:
Represent monetized Episode or Show states without real payments.

Acceptance Criteria:
- UI shows locked, unlocked, or tip-supported states as applicable.
- Placeholder behavior is clearly documented.
- No real payment flow is introduced.

Files Allowed:
- `src/features/monetization/`
- `src/features/episodes/`
- `src/features/shows/`
- `plan.md`

Out of Scope:
- Payment processor integration
- In-app purchases
- Creator payouts
- Tax handling

Verification:
- Run available checks.
- Inspect monetization placeholder states.
- Update `plan.md`.

## 6. Progress Log

| Date | Phase | Step | Status | Summary | Files Changed | Verification |
| --- | --- | --- | --- | --- | --- | --- |

## 7. Decisions Log

| Date | Decision | Reason | Revisit Later? |
| --- | --- | --- | --- |

## 8. Known Issues

No known issues have been logged yet.

## 9. Out of Scope Until Later

- Payments
- Ads
- AI-generated content
- Push notifications
- Direct messaging
- Live streaming
- Advanced recommendation algorithm
- Full creator analytics
- Web app

## 10. Next Step

Next Step:  
Step 0.2 — Confirm Project Foundation
