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

Current Phase: Phase 7 — Previously On  
Current Step: Step 7.4 — Show Recap Before Episode Playback  
Status: Ready for Review

## 4. Phase Roadmap

### Phase 0 — Project Foundation

Status: Complete

Goal: Establish the app shell, routing, theme, folder structure, and development guardrails.

### Phase 1 — Shows

Status: Complete

Goal: Make Shows the primary product object.

### Phase 2 — Episodes

Status: Complete

Goal: Add ordered Episodes inside Shows.

### Phase 3 — Feed

Status: Complete

Goal: Build a feed that surfaces Episodes while preserving Show context.

### Phase 4 — Follow Shows

Status: Complete

Goal: Let users follow Shows and build a Show-based social graph.

### Phase 5 — Audience Interaction

Status: Complete

Goal: Let viewers influence what happens next through polls and choices.

### Phase 6 — Continue Watching

Status: Complete

Goal: Help viewers resume serialized content.

### Phase 7 — Previously On

Status: In Progress

Goal: Help viewers understand ongoing Shows with recap support.

### Phase 8 — Creator Collaboration

Goal: Add a Writers Room for co-creators and collaborative show planning.

### Phase 9 — Monetization

Goal: Add support for tipping, premium episodes, or season passes later.

## 5. Detailed Step List

## Phase 0 — Project Foundation

### Step 0.1 — Create Build Plan

Status: Complete

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

Status: Complete

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

Findings:
- Project type: Expo React Native app. `package.json` uses `expo-router/entry` as the main entry, `app.json` contains Expo configuration, and dependencies include `expo`, `react`, and `react-native`.
- TypeScript: Configured through `tsconfig.json`, extending `expo/tsconfig.base`, with `strict` enabled and `@/*` mapped to the project root.
- Routing: Expo Router is already installed and configured. `app.json` includes the `expo-router` plugin and typed routes are enabled. Existing routes are `app/_layout.tsx`, which renders `<Stack />`, and `app/index.tsx`, which renders the initial screen.
- React Navigation: `@react-navigation/native` is a direct dependency. Additional React Navigation packages are present transitively through Expo Router in `package-lock.json`, but the app code currently uses Expo Router directly.
- Folder structure: Present root folders include `app`, `assets`, `.expo`, and `.vscode`. `assets/images` contains app icons, splash assets, favicon, and default React logo images. No root `components`, `constants`, `hooks`, `scripts`, or `src` folders are present yet.
- UI and theming: No shared theme files, color constants, `ThemedText`, `ThemedView`, or reusable UI component folders are present. `app/index.tsx` currently uses local `StyleSheet` styles with `Text` and `View` from `react-native`.
- Relevant dependencies: Direct dependencies include `expo`, `react`, `react-dom`, `react-native`, `expo-router`, `expo-constants`, `expo-linking`, `expo-splash-screen`, `expo-status-bar`, `@react-navigation/native`, `react-native-safe-area-context`, `react-native-screens`, `react-native-web`. No direct Supabase dependency is listed in `package.json`. `react-native-reanimated` is not a direct dependency.
- Scripts: Available scripts are `start` (`expo start`), `android` (`expo run:android`), `ios` (`expo run:ios`), `web` (`expo start --web`), and `lint` (`expo lint`). No dedicated TypeScript check or test script is currently defined.
- Existing app entry surface: No `App.tsx` entry point is present; the app is using Expo Router file-based routing.
- Current gaps for Phase 0: Shared theme, themed primitives, bottom tab navigation, folder conventions, TypeScript check script, and test script are not present yet. These should be handled only in their planned future steps.
- Setup risks: Step 0.3 should avoid reinstalling Expo Router because it is already present and configured. Step 0.8 may need to account for the absence of a TypeScript check script and test script.
- Verification performed: Inspected `git status --short`, root files, folder structure, `package.json`, `package-lock.json`, `tsconfig.json`, `app.json`, `eslint.config.js`, `app/_layout.tsx`, and `app/index.tsx`.

### Step 0.3 — Verify Expo Router Setup

Status: Complete

Goal:
Verify Expo Router is installed, configured, and used as the app navigation foundation without duplicating existing setup.

Acceptance Criteria:
- Expo Router setup is clearly verified.
- Existing routing entry point is confirmed.
- Existing `app/_layout.tsx` and `app/index.tsx` roles are summarized.
- Any routing gaps or risks are documented.
- No duplicate routing setup is added.
- No app code is changed unless a minimal correction is required to fix an actual routing configuration issue.

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
- Inspect `package.json`, `app.json`, `tsconfig.json`, `app/_layout.tsx`, and `app/index.tsx`.
- Confirm Expo Router configuration is present and non-duplicated.
- Update `plan.md` with completion notes.

Findings:
- `package.json` confirms Expo Router is installed with `expo-router` `~6.0.23`.
- `package.json` confirms the app entry point is `expo-router/entry`.
- Relevant direct dependencies are present and aligned with the Expo app foundation: `expo` `~54.0.33`, `react` `19.1.0`, `react-native` `0.81.5`, `react-native-safe-area-context` `~5.6.0`, and `react-native-screens` `~4.16.0`.
- `app.json` includes the `expo-router` plugin.
- `app.json` has `experiments.typedRoutes` enabled.
- `tsconfig.json` extends `expo/tsconfig.base` and includes `.expo/types/**/*.ts`, supporting Expo Router generated route types.
- `app/_layout.tsx` exists and exports the root layout. It renders an Expo Router `<Stack />`, making stack navigation the current root navigation behavior.
- `app/index.tsx` exists and serves as the current index route rendered by the root stack.
- No `App.tsx` entry point is present.
- No duplicate routing entry point or conflicting navigation container was found.
- No routing configuration correction was needed, so no app code was changed.
- Routing gaps or risks: Bottom tab navigation is not present yet and remains planned for Step 0.4. The current root stack is intentionally minimal. Future work should extend the existing Expo Router setup instead of reinstalling or duplicating router configuration.
- Verification performed: Inspected `git status --short`, `package.json`, `app.json`, `tsconfig.json`, `app/_layout.tsx`, and `app/index.tsx`; ran `npm run lint`, which passed.

### Step 0.4 — Add Bottom Tab Navigation

Status: Complete

Goal:
Add the primary app navigation shell with bottom tabs.

Acceptance Criteria:
- Bottom tab layout exists.
- The bottom tabs are Home, Explore, Create, Notifications, and Profile.
- Each tab has a simple placeholder screen.
- Tabs render without navigation errors.
- Tab setup does not include future feature implementation.
- No Supabase, database, auth, video, feed, Show, or Episode logic is added.
- No shared theme or themed primitives are added.
- No packages are installed.

Files Allowed:
- `app/_layout.tsx`
- `app/index.tsx`
- `app/(tabs)/_layout.tsx`
- `app/(tabs)/home.tsx`
- `app/(tabs)/explore.tsx`
- `app/(tabs)/create.tsx`
- `app/(tabs)/notifications.tsx`
- `app/(tabs)/profile.tsx`
- `plan.md`

Out of Scope:
- Show detail screens
- Episode playback
- Feed algorithms
- Follow logic
- Polls
- Shared theme
- ThemedText
- ThemedView
- Supabase setup
- Authentication
- Icons requiring new dependencies
- Design polish

Verification:
- Run TypeScript or lint checks if available.
- Launch the app and confirm tabs render.
- Update `plan.md` with completion notes.

Findings:
- Added the Expo Router `(tabs)` route group for the initial bottom tab shell.
- Preserved the root Expo Router stack in `app/_layout.tsx` and configured the `(tabs)` stack screen with `headerShown: false`.
- Updated `app/index.tsx` to redirect the root route to the Home tab.
- Added five placeholder tab screens: Home, Explore, Create, Notifications, and Profile.
- Each placeholder screen renders only the tab name with minimal local React Native styles.
- No shared theme, `ThemedText`, `ThemedView`, Supabase setup, mock data, auth, video, feed, Show, Episode, notification, or profile logic was added.
- No packages were installed.
- TypeScript note: the root redirect uses an Expo Router `Href` assertion because generated typed-route files did not immediately include the newly added `/home` route during direct `tsc` verification.
- Verification performed: inspected app route structure, ran `npm run lint`, and ran `npx tsc --noEmit`; both checks passed.

### Step 0.5 — Add Shared Theme

Status: Complete

Goal:
Create a shared theme foundation for colors, spacing, typography, border radius, and shadows.

Acceptance Criteria:
- A shared theme file exists.
- Theme exports colors, spacing, typography, border radius, and basic shadow or elevation tokens.
- Theme is typed or structured clearly enough for TypeScript usage.
- No `ThemedText` or `ThemedView` components are added.
- No Supabase, auth, database, Show, Episode, feed, or poll logic is added.
- No packages are installed.

Files Allowed:
- `constants/theme.ts`
- `plan.md`

Out of Scope:
- Complex component library
- Animations
- Brand illustration
- Feature screens
- User settings
- ThemedText
- ThemedView
- Redesigning placeholder screens
- Installing packages

Verification:
- Run TypeScript or lint checks if available.
- Confirm imports resolve.
- Update `plan.md` with completion notes.

Findings:
- Created `constants/theme.ts` as the shared theme foundation.
- Exported TypeScript-friendly token objects for `colors`, `spacing`, `typography`, `radius`, and `shadows`.
- Exported a combined `theme` object and `Theme` type for future imports.
- Kept the theme app-agnostic and dark-compatible, with neutral backgrounds, readable text colors, and strong brand/accent colors.
- Did not redesign existing placeholder screens or wire the theme into app UI yet.
- Did not add `ThemedText` or `ThemedView`; those remain planned for Step 0.6.
- Did not add Supabase, auth, database, Show, Episode, feed, poll, notification, or profile logic.
- No packages were installed.
- Verification performed: inspected `constants/theme.ts`, ran `npm run lint`, and ran `npx tsc --noEmit`; both checks passed.

### Step 0.6 — Add ThemedText and ThemedView

Status: Complete

Goal:
Create shared themed wrapper components that use theme tokens from `constants/theme.ts`.

Acceptance Criteria:
- `ThemedText` exists.
- `ThemedView` exists.
- Both components import and use `constants/theme.ts`.
- Both components support style overrides.
- Both components pass through standard React Native props.
- `ThemedText` supports basic variants.
- `ThemedView` supports basic layout variants or a reusable default pattern.
- No Supabase, auth, database, Show, Episode, feed, or poll logic is added.
- No packages are installed.

Files Allowed:
- `components/ThemedText.tsx`
- `components/ThemedView.tsx`
- `plan.md`

Out of Scope:
- Buttons
- Cards
- Forms
- Show-specific components
- Episode-specific components
- Redesigning all placeholder screens
- Adding icons
- Installing packages
- Changing tab navigation behavior

Verification:
- Run TypeScript or lint checks if available.
- Confirm components can be imported.
- Update `plan.md` with completion notes.

Findings:
- Created `components/ThemedText.tsx`.
- Created `components/ThemedView.tsx`.
- Both components import and use tokens from `constants/theme.ts`.
- `ThemedText` passes through standard React Native `Text` props, supports style overrides, and includes `body`, `title`, `subtitle`, and `caption` variants.
- `ThemedView` passes through standard React Native `View` props, supports style overrides, and includes `default`, `screen`, and `card` variants.
- Existing placeholder screens were not redesigned or updated in this step.
- No Supabase, auth, database, Show, Episode, feed, poll, notification, or profile logic was added.
- No packages were installed.
- Verification performed: inspected the component files, ran `npm run lint`, and ran `npx tsc --noEmit`; both checks passed.

### Step 0.7 — Establish Folder Conventions

Status: Complete

Goal:
Document the project folder conventions so future work has a clear place to go without duplicate folders or unnecessary moves.

Acceptance Criteria:
- Current folder structure is inspected.
- Folder conventions are documented in `plan.md`.
- Existing folders are assigned clear purposes.
- Future folders are documented with guidance on when to create them.
- No unnecessary empty folders are created.
- No existing files are moved unless clearly justified.
- No feature logic is added.
- No packages are installed.

Files Allowed:
- `plan.md`

Out of Scope:
- Moving routes
- Moving components
- Creating product folders early
- Creating empty future folders
- Adding barrel exports
- Creating Shows, Episodes, Feed, Auth, Supabase, or mock data
- Installing packages
- Redesigning screens
- Changing tab navigation behavior

Verification:
- Inspect folder structure.
- Confirm no feature code was added.
- Update `plan.md` with completion notes.

Folder Conventions:
- `app/`: Expo Router routes only. Route groups such as `app/(tabs)` are used for navigation structure. Screens that are directly routable belong here.
- `app/(tabs)/`: Bottom tab route group. Contains the Home, Explore, Create, Notifications, and Profile tab routes.
- `components/`: Reusable UI components. Shared components such as `ThemedText` and `ThemedView` belong here. Feature-specific components should only be added later when an approved feature step needs them.
- `constants/`: Shared constants and design tokens. `constants/theme.ts` belongs here.
- `assets/`: Static images, fonts, icons, and other bundled assets.
- `hooks/`: Reusable React hooks. Do not create until a real hook is needed.
- `types/`: Shared TypeScript types. Do not create until Step 1.1 or another approved step needs shared types.
- `services/`: API, backend, or data access services. Do not create until backend or data-service steps require it.
- `lib/`: Shared client setup or integration helpers, such as a future Supabase client. Do not create until an approved setup step requires it.
- `scripts/`: Local maintenance or development scripts. Do not create unless a real script is added.
- `src/`: Do not introduce `src/` at this time. The project currently uses root-level `app`, `components`, `constants`, and future root folders.

Findings:
- Current folder structure was inspected.
- Existing folders with app-owned source are `app`, `app/(tabs)`, `components`, `constants`, and `assets`.
- No `src`, `hooks`, `types`, `services`, `lib`, or `scripts` folder currently exists.
- No files were moved.
- No empty future folders were created.
- No feature logic, product data, Supabase, auth, Shows, Episodes, feed, or mock data was added.
- No packages were installed.
- Verification performed: inspected current folder structure, ran `npm run lint`, and ran `npx tsc --noEmit`; both checks passed.

### Step 0.8 — Verify TypeScript and App Launch

Status: Complete

Goal:
Confirm the foundation compiles, lints, and launches before product features begin.

Acceptance Criteria:
- `npm run lint` passes.
- `npx tsc --noEmit` passes.
- Expo start command is attempted and the result is documented.
- Current route structure is summarized.
- Any remaining Phase 0 gaps are documented.
- No product logic is added.
- No packages are installed.
- No app code is changed unless required to fix a real verification failure.

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

Findings:
- `npm run lint` passed.
- `npx tsc --noEmit` passed.
- `npm start` was attempted. Expo printed `Starting project at /Users/kerrypolvadore/KerryP/episodic-mobile` and stayed running without an immediate app-code error before it was stopped with `Ctrl-C`.
- Current route structure was inspected. The app uses `app/_layout.tsx` as the root stack, `app/index.tsx` as a redirect into the tab experience, and `app/(tabs)/_layout.tsx` with Home, Explore, Create, Notifications, and Profile tab routes.
- Phase 0 foundation is ready for Phase 1 review from a lint and TypeScript perspective.
- Remaining Phase 0 gaps: no dedicated `typecheck` script is defined in `package.json`; direct `npx tsc --noEmit` is currently used for TypeScript verification. No test script exists yet, and tests should be introduced deliberately when testable product behavior exists.
- No product logic, Supabase, auth, Shows, Episodes, feed, mock data, backend setup, or package installation was added.
- No app code was changed for Step 0.8.

## Phase 1 — Shows

### Step 1.1 — Define Show Types

Status: Complete

Goal:
Define the TypeScript types that describe a Show as the primary product object.

Acceptance Criteria:
- `types/show.ts` exists.
- A reusable `Show` type is exported.
- `CreateShowInput` and `UpdateShowInput` are exported.
- Show-related supporting types are exported where helpful.
- Show type includes identity, title, description, creator reference, visibility, and timestamps.
- Types avoid backend-specific assumptions.
- No UI is built.
- No mock data is added.
- No Supabase, backend, or database logic is added.
- No packages are installed.

Files Allowed:
- `types/show.ts`
- `plan.md`

Out of Scope:
- Episode types
- Show data storage
- Show screens
- Follow logic
- Supabase setup
- Database schema
- Services
- Repositories
- Mock data
- Authentication
- Feed logic
- Navigation changes
- Styling changes
- Installing packages

Verification:
- Run TypeScript check if available.
- Confirm exports resolve.
- Update `plan.md`.

Findings:
- Created `types/show.ts`.
- Exported `ShowId`, `UserId`, `ISODateString`, `ShowCategory`, `ShowVisibility`, `Show`, `CreateShowInput`, and `UpdateShowInput`.
- `Show` includes identity, owner user reference, title, description, cover URL, category, public/private state through `isPublic`, and ISO timestamp strings.
- `CreateShowInput` supports future create forms without requiring backend-generated fields.
- `UpdateShowInput` supports partial updates to editable Show fields.
- Types are app-facing and avoid Supabase, database schema, repository, service, mock data, Episode, moderation, analytics, and monetization assumptions.
- No UI, navigation, styling, backend, or product behavior was added.
- No packages were installed.
- Verification performed: inspected `types/show.ts`, ran `npm run lint`, and ran `npx tsc --noEmit`; both checks passed.

### Step 1.2 — Add Show Data Model Placeholder

Status: Complete

Goal:
Create a lightweight app-facing Show model placeholder for defaults, options, and helpers without adding persistence or backend behavior.

Acceptance Criteria:
- `models/show.ts` exists.
- The file imports Show-related types from `types/show.ts`.
- The file exports useful Show defaults, options, or helpers for future UI.
- No backend, database, Supabase, service, or repository logic is added.
- No mock data records are added.
- No UI is added.
- No navigation changes are made.
- No packages are installed.

Files Allowed:
- `models/show.ts`
- `plan.md`

Out of Scope:
- Show UI
- Show list screen
- Show detail screen
- Create Show screen
- Edit Show screen
- Episode types
- Supabase setup
- Database schema
- Services
- Repositories
- Mock data
- Authentication
- Feed integration
- Navigation changes
- Styling changes
- Installing packages
- Moving existing files
- Creating `src/`

Verification:
- Run TypeScript check if available.
- Confirm no app UI behavior changes unless planned.
- Update `plan.md`.

Findings:
- Created `models/show.ts`.
- Imported `CreateShowInput`, `ShowCategory`, `ShowVisibility`, and `UserId` from `types/show.ts`.
- Exported `defaultShowCategory`, `defaultShowVisibility`, `showCategories`, and `showVisibilityOptions`.
- Exported small model-level helpers: `isShowPublic`, `getShowVisibility`, `normalizeShowTitle`, `isValidShowTitle`, and `getDefaultCreateShowInput`.
- `getDefaultCreateShowInput` returns safe default values for future Create Show UI while requiring the caller to provide an owner user id.
- No backend, database, Supabase, service, repository, persistence method, fetch/create/update/delete method, or mock Show record was added.
- No UI, navigation, styling, or product behavior was added.
- No packages were installed.
- Verification performed: inspected `models/show.ts`, ran `npm run lint`, and ran `npx tsc --noEmit`; both checks passed.

### Step 1.3 — Create Show List UI

Status: Complete

Goal:
Create the first UI surface for Shows by adding a simple Show list experience.

Acceptance Criteria:
- A Show list UI renders in the app.
- The list displays Show title, description, category, and visibility.
- The UI uses existing `ThemedText` and `ThemedView` components.
- The UI uses the shared theme where appropriate.
- Placeholder Show items, if used, are clearly temporary and UI-only.
- No backend, database, Supabase, service, repository, or persistence logic is added.
- No Show detail screen is added yet.
- No Create Show screen is added yet.
- No packages are installed.

Files Allowed:
- `app/(tabs)/home.tsx`
- `plan.md`

Out of Scope:
- Show detail screen
- Create Show screen
- Edit Show screen
- Episode types
- Episode UI
- Supabase setup
- Database schema
- Services
- Repositories
- Real mock data layer
- Authentication
- Feed algorithm
- Navigation changes beyond the existing Home tab
- Installing packages
- Moving existing files
- Creating `src/`

Verification:
- Run available checks.
- Launch app and inspect Show list.
- Update `plan.md`.

Findings:
- Updated `app/(tabs)/home.tsx` to render the first Show list UI.
- Used existing `ThemedText` and `ThemedView` components.
- Used shared theme tokens from `constants/theme.ts` for spacing and colors.
- Added three temporary placeholder Show items local to `app/(tabs)/home.tsx`.
- Each placeholder card displays title, description, category, visibility, and an `Episodes coming soon` label.
- Placeholder Shows are UI-only and are not a mock data layer.
- No backend, database, Supabase, service, repository, persistence, Show detail screen, Create Show screen, navigation change, or package installation was added.
- Verification performed: inspected `app/(tabs)/home.tsx`, ran `npm run lint`, and ran `npx tsc --noEmit`; both checks passed.

### Step 1.4 — Create Show Detail Screen

Status: Complete

Goal:
Create a UI-only Show detail screen and allow users to navigate from the Home Show list to a selected Show detail view.

Acceptance Criteria:
- A Show detail screen exists.
- Tapping a Show from the Home list opens the Show detail screen.
- The detail screen displays Show title, description, category, and visibility.
- The detail screen includes a placeholder cover/header area.
- The detail screen includes a placeholder episode section.
- The UI uses existing `ThemedText` and `ThemedView` components.
- The UI uses shared theme tokens where appropriate.
- No backend, database, Supabase, service, repository, or persistence logic is added.
- No Create Show or Edit Show screen is added.
- No Episode types or real Episode data model is added.
- No packages are installed.

Files Allowed:
- `app/shows/[showId].tsx`
- `app/(tabs)/home.tsx`
- `app/_layout.tsx`
- `plan.md`

Out of Scope:
- Create Show screen
- Edit Show screen
- Episode types
- Episode data model
- Real Episode list
- Supabase setup
- Database schema
- Services
- Repositories
- Shared mock data layer
- Authentication
- Feed algorithm
- Installing packages
- Moving existing files
- Creating `src/`
- Redesigning unrelated tabs

Verification:
- Run available checks.
- Navigate from Show list to Show detail.
- Update `plan.md`.

Findings:
- Created `app/shows/[showId].tsx` as a UI-only Show detail route.
- Updated `app/(tabs)/home.tsx` so each temporary Show card is tappable through a `Pressable`.
- Home passes temporary UI-only display values to the detail route through Expo Router params: title, description, category, visibility, and show id.
- Updated `app/_layout.tsx` with a minimal stack screen option for `shows/[showId]`.
- The detail screen displays title, description, category, visibility, a placeholder cover area, and a placeholder Episodes section.
- The detail screen uses existing `ThemedText` and `ThemedView` components and shared theme tokens.
- Temporary Show data remains local to `app/(tabs)/home.tsx`; no shared mock data layer was created.
- No backend, database, Supabase, service, repository, persistence, Create Show screen, Edit Show screen, Episode type, real Episode model, or package installation was added.
- Verification performed: inspected `app/(tabs)/home.tsx` and `app/shows/[showId].tsx`, ran `npm run lint`, and ran `npx tsc --noEmit`; both checks passed.

### Step 1.5 — Add Create Show Screen

Status: Complete

Goal:
Create a UI-only Create Show screen/form that allows a user to enter Show information locally without saving data yet.

Acceptance Criteria:
- Create Show UI exists.
- Create tab displays or leads to the Create Show screen.
- User can enter a Show title and description locally.
- User can select or view a category option.
- User can select or view visibility.
- UI uses existing `ThemedText` and `ThemedView` components.
- UI uses shared theme tokens where appropriate.
- Basic local validation exists or a clear placeholder validation message is shown.
- Submit/create action is UI-only and does not persist data.
- No backend, database, Supabase, service, repository, or persistence logic is added.
- Home Show list is not updated by the Create Show form.
- No Edit Show behavior is added.
- No Episode types or Episode UI is added.
- No packages are installed.

Files Allowed:
- `app/(tabs)/create.tsx`
- `plan.md`

Out of Scope:
- Persisting Shows
- Updating Home list after create
- Create Show backend logic
- Supabase setup
- Database schema
- Services
- Repositories
- Edit Show screen
- Episode types
- Episode UI
- Feed algorithm
- Authentication
- Installing packages
- Moving existing files
- Creating `src/`
- Redesigning unrelated tabs

Verification:
- Run available checks.
- Inspect the Create tab form.
- Update `plan.md`.

Findings:
- Updated `app/(tabs)/create.tsx` so the existing Create tab renders a UI-only Create Show form.
- Added local form state for title, description, category, and visibility.
- Used `showCategories`, `showVisibilityOptions`, `defaultShowCategory`, `defaultShowVisibility`, `normalizeShowTitle`, `isValidShowTitle`, and `isShowPublic` from `models/show.ts`.
- Used existing `ThemedText` and `ThemedView` components and shared theme tokens.
- Added simple local title validation and a local preview.
- Included a UI-only `Create Show Later` button; it does not persist data or update any list.
- Home Show list is not updated by the form.
- No backend, database, Supabase, service, repository, persistence, Edit Show behavior, Episode type, Episode UI, or package installation was added.
- Verification performed: inspected `app/(tabs)/create.tsx`, ran `npm run lint`, and ran `npx tsc --noEmit`; both checks passed.

### Step 1.6 — Add Edit Show Support

Status: Complete

Goal:
Add UI-only Edit Show support so a user can navigate from a Show detail screen to an edit form prefilled with temporary display values.

Acceptance Criteria:
- A UI-only Edit Show screen exists.
- Show detail includes a clear Edit action.
- Tapping Edit from Show detail opens the Edit Show screen.
- Edit Show screen is prefilled with the selected Show's temporary display values.
- User can edit title and description locally.
- User can select or view category.
- User can select or view visibility.
- UI uses existing `ThemedText` and `ThemedView` components.
- UI uses shared theme tokens where appropriate.
- Basic local validation exists or a clear placeholder validation message is shown.
- Save/update action is UI-only and does not persist data.
- Home Show list is not updated by the Edit Show form.
- Show detail screen is not updated by the Edit Show form.
- No backend, database, Supabase, service, repository, auth, ownership, or persistence logic is added.
- No Episode types or Episode UI is added.
- No packages are installed.

Files Allowed:
- `app/shows/[showId]/edit.tsx`
- `app/shows/[showId].tsx`
- `app/_layout.tsx`
- `plan.md`

Out of Scope:
- Persisting Show edits
- Updating Home list after edit
- Updating Show detail after edit
- Create Show persistence
- Supabase setup
- Database schema
- Services
- Repositories
- Authentication
- Ownership/permission enforcement
- Episode types
- Episode UI
- Feed algorithm
- Installing packages
- Moving existing files
- Creating `src/`
- Redesigning unrelated tabs

Verification:
- Run available checks.
- Inspect Show detail Edit action and Edit Show route behavior.
- Update `plan.md`.

Findings:
- Created `app/shows/[showId]/edit.tsx` as a UI-only Edit Show route.
- Added an `Edit Show` action to `app/shows/[showId].tsx`.
- Updated `app/_layout.tsx` with a minimal stack title for `shows/[showId]/edit`.
- The detail screen passes temporary UI-only route params to the edit screen: show id, title, description, category, and visibility.
- The edit form is prefilled from those temporary route params.
- The edit form supports local title, description, category, and visibility edits.
- Used existing `ThemedText` and `ThemedView` components and shared theme tokens.
- Used existing Show model helpers and option lists for validation, defaults, category options, and visibility options.
- Added simple local title validation and a UI-only `Save Changes Later` button.
- The edit form does not persist data, update the Home Show list, or update the Show detail screen.
- No backend, database, Supabase, service, repository, auth, ownership, persistence, Episode type, Episode UI, or package installation was added.
- Verification performed: inspected `app/shows/[showId].tsx` and `app/shows/[showId]/edit.tsx`, ran `npm run lint`, and ran `npx tsc --noEmit`; both checks passed.

### Step 1.7 — Add Public/Private Show Visibility Rules

Status: Complete

Goal:
Add UI-only public/private visibility behavior so Shows consistently communicate which Shows are public and which are private.

Acceptance Criteria:
- Public/private visibility is displayed consistently on Home Show list.
- Public/private visibility is displayed consistently on Show detail.
- Create Show form includes clear visibility selection or display.
- Edit Show form includes clear visibility selection or display.
- Private visibility has a simple UI-only explanation somewhere appropriate.
- Existing Show model helpers are used where appropriate.
- No real auth, ownership, backend filtering, Supabase, database, service, repository, or persistence logic is added.
- No Show values are persisted.
- No Episode types or Episode UI is added.
- No packages are installed.

Files Allowed:
- `app/(tabs)/home.tsx`
- `app/(tabs)/create.tsx`
- `app/shows/[showId].tsx`
- `app/shows/[showId]/edit.tsx`
- `components/ShowVisibilityBadge.tsx`
- `plan.md`

Out of Scope:
- Real authentication
- Ownership/permission enforcement
- Backend visibility filtering
- Supabase setup
- Database schema
- Services
- Repositories
- Persistence
- Updating Home list after create/edit
- Episode types
- Episode UI
- Feed algorithm
- Installing packages
- Moving existing files
- Creating `src/`
- Redesigning unrelated tabs

Verification:
- Run available checks.
- Confirm visibility labels on Home, Show detail, Create Show, and Edit Show.
- Update `plan.md`.

Findings:
- Created `components/ShowVisibilityBadge.tsx` for consistent UI-only public/private labels.
- Updated `app/(tabs)/home.tsx` to use `ShowVisibilityBadge` on each temporary Show card.
- Updated `app/shows/[showId].tsx` to use `ShowVisibilityBadge` for detail visibility display.
- Updated `app/(tabs)/create.tsx` with private visibility helper text in the visibility section.
- Updated `app/shows/[showId]/edit.tsx` with private visibility helper text in the visibility section.
- Used existing `isShowPublic` and `showVisibilityOptions` helpers where appropriate.
- Private visibility copy explains that private Shows are only visible to the user once account support is connected.
- No real auth, ownership, backend filtering, Supabase, database, service, repository, persistence, Episode type, Episode UI, or package installation was added.
- Verification performed: inspected Home, Show detail, Create Show, and Edit Show visibility UI; ran `npm run lint`; ran `npx tsc --noEmit`; both checks passed.

## Phase 2 — Episodes

### Step 2.1 — Define Episode Types

Status: Complete

Goal:
Define TypeScript types for ordered Episodes inside Shows.

Acceptance Criteria:
- Episode type includes identity, show reference, title, description, season number, episode number, timestamps, simple hook type support, and optional video placeholder fields.
- CreateEpisodeInput and UpdateEpisodeInput are exported.
- Types support ordering inside a Show.
- Types are app-facing and backend-agnostic.
- No UI is built.
- No mock data is added.
- No Supabase, backend, database, service, or repository logic is added.

Files Allowed:
- `types/episode.ts`
- `plan.md`

Out of Scope:
- Episode screens
- Video playback
- Polls
- Recaps
- Mock data
- Supabase setup
- Database schema
- Services
- Repositories
- Installing packages

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Confirm exports resolve.
- Update `plan.md`.

Findings:
- Created `types/episode.ts` for shared app-facing Episode TypeScript types.
- Added `EpisodeId` as a string ID alias.
- Added `EpisodeHookType` with simple hook values: `none`, `question`, `poll`, `cliffhanger`, `challenge`, and `reveal`.
- Added `Episode` with `id`, `showId`, `seasonNumber`, `episodeNumber`, `title`, `description`, nullable `videoUrl`, nullable `thumbnailUrl`, `hookType`, `createdAt`, and `updatedAt`.
- Reused `ShowId` and `ISODateString` from `types/show.ts`.
- Added `CreateEpisodeInput` for future create forms with required Show reference, ordering numbers, and title, plus optional description, video placeholder fields, and hook type.
- Added `UpdateEpisodeInput` for future edit flows using a partial subset of editable Episode fields.
- No UI, navigation, Show screen changes, backend, database, Supabase, service, repository, persistence, mock data, or package installation was added.
- Verification performed: inspected `types/episode.ts`, ran `npm run lint`, and ran `npx tsc --noEmit`; both checks passed.

### Step 2.2 — Add Episode Data Model Placeholder

Status: Complete

Goal:
Create a lightweight app-facing Episode model placeholder that centralizes default Episode values, hook options, numbering helpers, and simple validation helpers.

Acceptance Criteria:
- Episode model helpers import and use Episode-related types from `types/episode.ts`.
- Useful Episode defaults, hook options, labels, and validation helpers are exported for future UI.
- Simple season and episode numbering helpers are included.
- No backend, database, Supabase, service, repository, persistence, or mock Episode records are added.
- No UI or navigation changes are made.
- No packages are installed.

Files Allowed:
- `models/episode.ts`
- `plan.md`

Out of Scope:
- Episode UI
- Episode list on Show detail
- Episode detail screen
- Create Episode screen
- Edit Episode screen
- Video player implementation
- Poll types
- Recap/Previously On types
- Supabase setup
- Database schema
- Services
- Repositories
- Mock data
- Authentication
- Feed logic
- Navigation changes
- Styling changes
- Installing packages
- Moving existing files
- Creating `src/`

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect `models/episode.ts`.
- Update `plan.md`.

Findings:
- Created `models/episode.ts` for lightweight app-facing Episode model utilities.
- Imported and used Episode-related types from `types/episode.ts`.
- Added default Episode creation values for hook type, season number, episode number, empty title, empty description, and nullable video placeholder fields.
- Added hook type constants, labels, options, and `getEpisodeHookLabel`.
- Added `normalizeEpisodeTitle` and `isValidEpisodeTitle` for future form validation.
- Added `isValidEpisodeNumber` for positive integer season and episode numbering checks.
- Added `getEpisodeDisplayNumber` for compact display strings such as `S1:E1`.
- Added `getNextEpisodeNumber` for deriving the next episode number from caller-provided Episode summaries within a Show and season.
- No UI, navigation, Show screen changes, tab screen changes, backend, database, Supabase, service, repository, persistence, mock Episode records, or package installation was added.
- Verification performed: inspected `models/episode.ts`, ran `npm run lint`, and ran `npx tsc --noEmit`; both checks passed.

### Step 2.3 — Add Episode List to Show Detail

Status: Complete

Goal:
Replace the placeholder Episodes section on the Show detail screen with a simple UI-only Episode list that shows how Episodes belong to a Show.

Acceptance Criteria:
- Show detail screen includes an Episode list section.
- Episode list displays at least one temporary UI-only Episode item.
- Episode item displays season/episode number, title, description, hook label, and video placeholder/status.
- Episode display numbering uses or aligns with helpers from `models/episode.ts`.
- Episode hook labels use or align with helpers/options from `models/episode.ts`.
- UI uses existing `ThemedText` and `ThemedView` components.
- UI uses shared theme tokens where appropriate.
- Temporary Episode items, if used, are local to the Show detail UI file.
- No shared mock data layer is created.
- No Episode detail screen or navigation is added.
- No Create Episode screen is added.
- No real video player behavior is added.
- No backend, database, Supabase, service, repository, auth, ownership, or persistence logic is added.
- No packages are installed.

Files Allowed:
- `app/shows/[showId].tsx`
- `plan.md`

Out of Scope:
- Episode detail screen
- Episode detail navigation
- Create Episode screen
- Edit Episode screen
- Video player implementation
- Poll types
- Poll UI
- Recap/Previously On types
- Recap UI
- Supabase setup
- Database schema
- Services
- Repositories
- Shared mock data layer
- Authentication
- Feed logic
- Navigation changes
- Installing packages
- Moving existing files
- Creating `src/`
- Modifying unrelated tabs

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect Show detail Episode list section.
- Update `plan.md`.

Findings:
- Replaced the placeholder Episodes copy on Show detail with a simple UI-only Episode list section.
- Added local temporary Episode display items inside `app/shows/[showId].tsx`.
- Typed the local temporary display items with a focused `Pick` from the shared `Episode` type.
- Used `getEpisodeDisplayNumber` from `models/episode.ts` for compact season and episode numbering.
- Used `getEpisodeHookLabel` from `models/episode.ts` for hook labels.
- Each temporary Episode item displays a season/episode number, title, short description, hook label, and video placeholder status.
- Kept Episode items local to the Show detail UI file and did not create a shared mock data layer.
- Used existing `ThemedText`, `ThemedView`, and shared theme tokens for the Episode list UI.
- No Episode detail route, Episode navigation, Create Episode screen, real video playback, backend, database, Supabase, service, repository, auth, ownership, persistence, or package installation was added.
- Verification performed: inspected `app/shows/[showId].tsx`, ran `npm run lint`, and ran `npx tsc --noEmit`; both checks passed.

### Step 2.4 — Create Episode Detail Screen

Status: Complete

Goal:
Create a UI-only Episode detail screen and allow users to navigate from the Show detail Episode list to a selected Episode detail view.

Acceptance Criteria:
- Episode detail route exists.
- Tapping an Episode from the Show detail Episode list opens the Episode detail screen.
- Episode detail displays season/episode number, title, description, hook label, and video placeholder/status.
- Episode display numbering uses or aligns with helpers from `models/episode.ts`.
- Episode hook labels use or align with helpers/options from `models/episode.ts`.
- UI uses existing `ThemedText` and `ThemedView` components.
- UI uses shared theme tokens where appropriate.
- Temporary Episode values are passed through route params or kept UI-only.
- No shared mock data layer is created.
- No Create Episode screen is added.
- No Edit Episode screen is added.
- No real video player behavior is added.
- No backend, database, Supabase, service, repository, auth, ownership, or persistence logic is added.
- No packages are installed.

Files Allowed:
- `app/episodes/[episodeId].tsx`
- `app/shows/[showId].tsx`
- `app/_layout.tsx`
- `plan.md`

Out of Scope:
- Create Episode screen
- Edit Episode screen
- Episode persistence
- Video player implementation
- Poll types
- Poll UI
- Recap/Previously On types
- Recap UI
- Supabase setup
- Database schema
- Services
- Repositories
- Shared mock data layer
- Authentication
- Feed logic
- Installing packages
- Moving existing files
- Creating `src/`
- Modifying unrelated tabs

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect Show detail Episode navigation.
- Inspect Episode detail route behavior.
- Update `plan.md`.

Findings:
- Created `app/episodes/[episodeId].tsx` as a UI-only Episode detail route.
- Added a minimal `episodes/[episodeId]` stack screen title in `app/_layout.tsx`.
- Updated the Show detail Episode list so each temporary Episode item is tappable.
- Passed temporary UI-only Episode values through route params: title, description, season number, episode number, hook type, video placeholder value, and Episode id.
- Passed temporary Show context through route params so Episode detail can link back to its parent Show.
- Episode detail displays a video placeholder area, season/episode display number, title, description, hook label, video status, and parent Show card.
- Used `getEpisodeDisplayNumber` and `getEpisodeHookLabel` from `models/episode.ts`.
- Used existing `ThemedText`, `ThemedView`, and shared theme tokens.
- No shared mock data layer, Create Episode screen, Edit Episode screen, real video player behavior, backend, database, Supabase, service, repository, auth, ownership, persistence, or package installation was added.
- Verification performed: inspected `app/shows/[showId].tsx`, `app/episodes/[episodeId].tsx`, and `app/_layout.tsx`; ran `npm run lint` and `npx tsc --noEmit`; both checks passed.

### Step 2.5 — Add Create Episode Screen

Status: Complete

Goal:
Create a UI-only Create Episode screen/form so a user can enter Episode information for a Show locally without saving data yet.

Acceptance Criteria:
- A UI-only Create Episode screen exists.
- Show detail includes a clear Create Episode action.
- Tapping Create Episode from Show detail opens the Create Episode screen.
- Create Episode screen receives or knows the parent `showId`.
- User can enter Episode title and description locally.
- User can view or edit season number and episode number locally.
- User can select or view hook type.
- User can enter or view video placeholder information locally.
- UI uses existing `ThemedText` and `ThemedView` components.
- UI uses shared theme tokens where appropriate.
- Basic local validation exists or a clear placeholder validation message is shown.
- Submit/create action is UI-only and does not persist data.
- Show detail Episode list is not updated by the Create Episode form.
- No backend, database, Supabase, service, repository, auth, ownership, or persistence logic is added.
- No Edit Episode screen is added.
- No real video upload or video player behavior is added.
- No packages are installed.

Files Allowed:
- `app/shows/[showId]/episodes/create.tsx`
- `app/shows/[showId].tsx`
- `app/_layout.tsx`
- `plan.md`

Out of Scope:
- Persisting Episodes
- Updating Show detail Episode list after create
- Edit Episode screen
- Episode persistence
- Real video upload
- Real video player implementation
- Poll types
- Poll UI
- Recap/Previously On types
- Recap UI
- Supabase setup
- Database schema
- Services
- Repositories
- Shared mock data layer
- Authentication
- Ownership/permission enforcement
- Feed logic
- Installing packages
- Moving existing files
- Creating `src/`
- Modifying unrelated tabs

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect Show detail Create Episode action.
- Inspect Create Episode route behavior.
- Update `plan.md`.

Findings:
- Created `app/shows/[showId]/episodes/create.tsx` as a UI-only Create Episode route.
- Added a minimal `shows/[showId]/episodes/create` stack screen title in `app/_layout.tsx`.
- Added a clear Create Episode action to the Show detail Episodes section.
- Passed temporary parent Show context through route params so the Create Episode screen knows the `showId` and display title.
- Used `getDefaultCreateEpisodeInput`, `episodeHookOptions`, `normalizeEpisodeTitle`, `isValidEpisodeTitle`, `isValidEpisodeNumber`, and `getEpisodeDisplayNumber` from `models/episode.ts`.
- Added local form state for title, description, season number, episode number, hook type, video URL, and thumbnail URL.
- Added basic local validation for required title and positive whole season and episode numbers.
- Added a local preview and a UI-only `Create Episode Later` button that does not persist data.
- The Show detail Episode list is not updated by the Create Episode form.
- No backend, database, Supabase, service, repository, auth, ownership, persistence, Edit Episode screen, real video upload, real video player behavior, shared mock data layer, or package installation was added.
- Verification performed: inspected `app/shows/[showId].tsx`, `app/shows/[showId]/episodes/create.tsx`, and `app/_layout.tsx`; ran `npm run lint` and `npx tsc --noEmit`; both checks passed.

### Step 2.6 — Add Season and Episode Numbering

Status: Complete

Goal:
Standardize UI-only season and episode numbering across Episode-related screens so Episodes consistently display as ordered parts of a Show.

Acceptance Criteria:
- Show detail Episode list displays season/episode numbers consistently.
- Episode detail displays season/episode number consistently.
- Create Episode screen uses sensible local defaults for season and episode number.
- Create Episode screen includes local validation or helper text for invalid numbering.
- Number display uses or aligns with helpers from `models/episode.ts`.
- No backend, database, Supabase, service, repository, auth, ownership, or persistence logic is added.
- No Episode values are persisted.
- No shared mock data layer is created.
- No Edit Episode screen is added.
- No real video upload or video player behavior is added.
- No packages are installed.

Files Allowed:
- `models/episode.ts`
- `app/shows/[showId].tsx`
- `app/episodes/[episodeId].tsx`
- `app/shows/[showId]/episodes/create.tsx`
- `plan.md`

Out of Scope:
- Persisting Episodes
- Updating Show detail Episode list after create
- Edit Episode screen
- Episode persistence
- Real video upload
- Real video player implementation
- Poll types
- Poll UI
- Recap/Previously On types
- Recap UI
- Supabase setup
- Database schema
- Services
- Repositories
- Shared mock data layer
- Authentication
- Ownership/permission enforcement
- Feed logic
- Installing packages
- Moving existing files
- Creating `src/`
- Modifying unrelated tabs

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect Show detail Episode numbering.
- Inspect Episode detail numbering.
- Inspect Create Episode numbering defaults and validation.
- Update `plan.md`.

Findings:
- Reviewed season and episode numbering across the Show detail Episode list, Episode detail screen, Create Episode screen, and `models/episode.ts`.
- Confirmed Show detail Episode list displays numbering through `getEpisodeDisplayNumber`, producing `S#:E#` labels such as `S1:E1`.
- Confirmed Episode detail displays numbering through `getEpisodeDisplayNumber`.
- Confirmed Create Episode preview displays numbering through `getEpisodeDisplayNumber`.
- Confirmed Create Episode defaults come from `getDefaultCreateEpisodeInput`, using season `1` and episode `1`.
- Confirmed Create Episode validates season and episode numbers with `isValidEpisodeNumber` and shows a local warning for invalid values.
- Updated Episode detail route-param parsing to use `isValidEpisodeNumber`, so invalid route param numbers fall back to safe local defaults.
- No Episode values are persisted, no real data is reordered, and numbering remains UI-only.
- No backend, database, Supabase, service, repository, auth, ownership, persistence, shared mock data layer, Edit Episode screen, real video upload, real video player behavior, or package installation was added.
- Verification performed: inspected `models/episode.ts`, `app/shows/[showId].tsx`, `app/episodes/[episodeId].tsx`, and `app/shows/[showId]/episodes/create.tsx`; ran `npm run lint` and `npx tsc --noEmit`; both checks passed.

### Step 2.7 — Add Video Placeholder Support

Status: Complete

Goal:
Standardize UI-only video and thumbnail placeholder support across Episode-related screens.

Acceptance Criteria:
- Episode detail includes a clear UI-only video placeholder area.
- Show detail Episode list displays consistent video placeholder/status text.
- Create Episode screen clearly shows video URL/thumbnail URL as local placeholder fields or clearly communicates video support is coming later.
- Video placeholder messaging is consistent and does not imply real upload/playback exists.
- UI uses existing `ThemedText` and `ThemedView` components.
- UI uses shared theme tokens where appropriate.
- No real video upload is added.
- No real video player behavior is added.
- No Mux, Supabase storage, or external video service is added.
- No backend, database, Supabase, service, repository, auth, ownership, or persistence logic is added.
- No Episode values are persisted.
- No shared mock data layer is created.
- No Edit Episode screen is added.
- No packages are installed.

Files Allowed:
- `models/episode.ts`
- `app/shows/[showId].tsx`
- `app/episodes/[episodeId].tsx`
- `app/shows/[showId]/episodes/create.tsx`
- `plan.md`

Out of Scope:
- Real video upload
- Real video player implementation
- Mux integration
- Supabase storage
- Episode persistence
- Edit Episode screen
- Poll types
- Poll UI
- Recap/Previously On types
- Recap UI
- Supabase setup
- Database schema
- Services
- Repositories
- Shared mock data layer
- Authentication
- Ownership/permission enforcement
- Feed logic
- Installing packages
- Moving existing files
- Creating `src/`
- Modifying unrelated tabs

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect Show detail video status.
- Inspect Episode detail video placeholder.
- Inspect Create Episode video/thumbnail placeholder fields or messaging.
- Update `plan.md`.

Findings:
- Reviewed video and thumbnail placeholder handling across Show detail Episode items, Episode detail, Create Episode, and `models/episode.ts`.
- Added small app-facing Episode video helpers in `models/episode.ts`: `hasEpisodeVideoPlaceholder` and `getEpisodeVideoStatusLabel`.
- Standardized UI-only video status labels to `Video URL added` when a local URL is present and `No video yet` when absent.
- Updated Show detail Episode items to display video status through `getEpisodeVideoStatusLabel`.
- Updated Episode detail to use the same video status label in both the video placeholder area and video status row.
- Episode detail continues to show a clear video placeholder area and now explicitly states that real upload and playback will be connected later.
- Updated Create Episode video URL helper text to use the same video status label and clarify that real upload and playback will be connected later.
- Updated Create Episode thumbnail URL helper text to clarify that thumbnail values stay local until media storage is added later.
- No real video upload, real video player behavior, Mux, Supabase storage, external video service, backend, database, Supabase, service, repository, auth, ownership, persistence, shared mock data layer, Edit Episode screen, or package installation was added.
- Verification performed: inspected `models/episode.ts`, `app/shows/[showId].tsx`, `app/episodes/[episodeId].tsx`, and `app/shows/[showId]/episodes/create.tsx`; ran `npm run lint` and `npx tsc --noEmit`; both checks passed.

## Phase 3 — Feed

### Step 3.1 — Create Home Feed Layout

Status: Complete

Goal:
Create the initial Home feed layout shell that surfaces Episodes while preserving Show context.

Acceptance Criteria:
- Home tab displays a feed-style layout.
- Feed items represent Episodes.
- Each feed item preserves Show context.
- Feed items display season/episode number, Episode title, Show title, and a short description.
- Feed items display hook label and video status labels.
- UI uses existing `ThemedText` and `ThemedView` components.
- UI uses shared theme tokens where appropriate.
- Temporary feed items are local to `app/(tabs)/home.tsx`.
- No shared mock data layer is created.
- No backend, database, Supabase, service, repository, auth, ownership, or persistence logic is added.
- No feed algorithm is added.
- No packages are installed.

Files Allowed:
- `app/(tabs)/home.tsx`
- `plan.md`

Out of Scope:
- Real feed data
- Feed algorithm
- Infinite scroll
- Pull to refresh
- Search
- Filters
- Likes
- Comments
- Sharing
- Notifications
- Backend, database, Supabase, service, repository, auth, ownership, persistence

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect `app/(tabs)/home.tsx` feed layout.
- Update `plan.md`.

Findings:
- Reworked Home from a Show list into a UI-only Episode feed layout while preserving Show context on every card.
- Added a Home feed header and short product framing line: `Follow what happens next.`
- Replaced local placeholder Show list items with local placeholder Episode feed items stored only in `app/(tabs)/home.tsx`.
- Each feed card now displays Show title, Show visibility, season/episode display number, Episode title, Episode description, hook label, video status label, and Show category.
- Reused Episode model helpers for consistent display labels: `getEpisodeDisplayNumber`, `getEpisodeHookLabel`, and `getEpisodeVideoStatusLabel`.
- Preserved sensible navigation by keeping card press behavior routed to existing Show detail.
- No shared mock data layer, backend, database, Supabase, service, repository, auth, ownership, persistence, feed algorithm, or package installation was added.
- Verification performed: ran `npm run lint` and `npx tsc --noEmit`; both checks passed.

### Step 3.2 — Display Recent Public Episodes

Status: Complete

Goal:
Show recent public Episodes in the Home feed.

Acceptance Criteria:
- Feed includes only Episodes from public Shows.
- Episodes are sorted by publish or creation recency.
- Empty state handles no public Episodes.
- Visibility rules are reused.

Files Allowed:
- `app/(tabs)/home.tsx`
- `plan.md`

Out of Scope:
- Personalized ranking
- Follow filtering
- Ads
- Recommendations

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Confirm private Show Episodes do not appear.
- Update `plan.md`.

Findings:
- Updated temporary Home feed items in `app/(tabs)/home.tsx` to include local `publishedAt` values for recency ordering.
- Confirmed and enforced public-only feed behavior by filtering temporary items with `isShowPublic` from `models/show.ts`.
- Kept a temporary private Episode item in local feed source data, but excluded it from the rendered public feed through filtering.
- Sorted displayed temporary feed items newest-first by `publishedAt`.
- Preserved existing Step 3.1 feed card layout and existing navigation behavior while keeping Show context visible.
- Continued to use Episode helpers for numbering, hook labels, and video status labels.
- No shared mock data layer, backend, database, Supabase, service, repository, auth, ownership, persistence, package installation, or real feed algorithm was added.
- Verification performed: ran `npm run lint` and `npx tsc --noEmit`; both checks passed.

### Step 3.3 — Preserve Show Context on Feed Cards

Status: Complete

Goal:
Ensure every feed Episode card clearly identifies its Show.

Acceptance Criteria:
- Feed cards display Show title and Episode numbering.
- Users can understand the serialized context without opening detail screens.
- Show context remains visually clear and parent-first on each card.
- Existing public-only filtering remains intact.
- Existing newest-first ordering remains intact.
- Existing navigation behavior is preserved.

Files Allowed:
- `app/(tabs)/home.tsx`
- `plan.md`

Out of Scope:
- Follow buttons
- Polls
- Recommendations
- Creator profiles
- New navigation behavior

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect feed cards for Show context.
- Confirm public-only filtering remains intact.
- Confirm newest-first ordering remains intact.
- Update `plan.md`.

Findings:
- Refined Home feed card hierarchy to reinforce Show-as-parent context while keeping Episode as the current installment.
- Added a small series-oriented label (`Episode from`) to each feed card.
- Elevated Show title prominence and kept Show visibility badge next to Show identity.
- Grouped Episode numbering with context (`Latest episode · S#:E#`) directly above Episode title for clearer series continuity.
- Preserved existing public-only filtering via `isShowPublic` and newest-first ordering by `publishedAt`.
- Preserved existing card press navigation behavior without adding new navigation paths.
- Temporary feed items remain local to `app/(tabs)/home.tsx`.
- No shared mock data layer, backend, database, Supabase, service, repository, auth, ownership, persistence, package installation, or real feed algorithm was added.
- Verification performed: ran `npm run lint` and `npx tsc --noEmit`; both checks passed.

### Step 3.4 — Navigate from Feed to Episode

Status: Complete

Goal:
Allow feed users to open an Episode detail screen.

Acceptance Criteria:
- Tapping an Episode card opens Episode detail.
- Navigation passes the correct Episode identity.
- Episode detail receives temporary Episode and Show context route params.
- Existing public-only filtering remains intact.
- Existing newest-first ordering remains intact.
- Existing Show context on feed cards remains visible.

Files Allowed:
- `app/(tabs)/home.tsx`
- `app/episodes/[episodeId].tsx` (only if minimal compatibility fix is required)
- `plan.md`

Out of Scope:
- Autoplay
- Watch tracking
- Comments
- Poll voting

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Navigate from feed to Episode detail.
- Confirm Episode detail renders from feed params.
- Confirm public-only filtering remains intact.
- Confirm newest-first ordering remains intact.
- Update `plan.md`.

Findings:
- Updated Home feed card press behavior to navigate to the existing Episode detail route (`/episodes/[episodeId]`).
- Passed temporary Episode params from feed items: `episodeId`, `title`, `description`, `seasonNumber`, `episodeNumber`, `hookType`, and `videoUrl`.
- Passed temporary parent Show params from feed items: `showId`, `showTitle`, `showDescription`, `showCategory`, and `showVisibility`, aligned with existing Episode detail behavior.
- Kept temporary feed items local to `app/(tabs)/home.tsx`, including Show context values used for Episode detail.
- Preserved existing public-only filtering (`isShowPublic`) and newest-first ordering (`publishedAt` sort).
- Preserved existing feed card Show-context UI and avoided adding feed-to-Show navigation behavior in this step.
- No Episode detail compatibility fix was required in `app/episodes/[episodeId].tsx`.
- No shared mock data layer, backend, database, Supabase, service, repository, auth, ownership, persistence, package installation, or feed algorithm was added.
- Verification performed: ran `npm run lint` and `npx tsc --noEmit`; both checks passed.

### Step 3.5 — Navigate from Feed to Show

Status: Complete

Goal:
Allow feed users to open the parent Show from a feed item.

Acceptance Criteria:
- Feed card provides a clear route to Show detail.
- Navigation passes the correct Show identity.
- Episode navigation and Show navigation do not conflict.

Files Allowed:
- `app/(tabs)/home.tsx`
- `app/shows/[showId].tsx` (only if minimal compatibility fix is required)
- `plan.md`

Out of Scope:
- Follow behavior
- Creator profiles
- Recommendations
- Continue watching

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Navigate from feed to Show detail.
- Confirm feed-to-Episode navigation remains intact.
- Confirm Show detail renders from feed params.
- Confirm public-only filtering remains intact.
- Confirm newest-first ordering remains intact.
- Update `plan.md`.

Findings:
- Added a clear secondary `View Show` action to each Home feed card that navigates to the existing Show detail route (`/shows/[showId]`).
- Kept feed-to-Episode behavior intact by preserving Episode-detail navigation as the primary tap area on each card.
- Passed temporary Show params to Show detail from feed items: `showId`, `title`, `description`, `category`, and `visibility`.
- Preserved Show context UI on cards, including Show title, visibility badge, category, Episode numbering/title, hook label, and video status.
- Preserved existing public-only filtering (`isShowPublic`) and newest-first ordering (`publishedAt` sort).
- Kept temporary feed items local to `app/(tabs)/home.tsx`.
- No Show detail compatibility fix was required in `app/shows/[showId].tsx`.
- No shared mock data layer, backend, database, Supabase, service, repository, auth, ownership, persistence, package installation, or feed algorithm was added.
- Verification performed: ran `npm run lint` and `npx tsc --noEmit`; both checks passed.

## Phase 4 — Follow Shows

### Step 4.1 — Define Show Follow Data Model

Status: Complete

Goal:
Define how a user follows a Show.

Acceptance Criteria:
- Show follow types exist.
- A reusable `ShowFollow` type/interface is exported.
- Create/remove follow input types are exported where helpful.
- `ShowFollow` references a Show through `showId`.
- `ShowFollow` references a user through `userId`.
- App-facing follow helper(s) exist only if useful and remain backend-agnostic.
- No UI is added.
- No mock follow records are added.
- No Supabase/backend/database logic is added.
- No services or repositories are added.
- No authentication or ownership logic is added.
- No packages are installed.

Files Allowed:
- `types/showFollow.ts`
- `models/showFollow.ts`
- `plan.md`

Out of Scope:
- Follow button UI
- Unfollow button UI
- Follower count UI
- Followed Shows list
- Followed Shows feed filter
- Supabase setup
- Database schema
- Services
- Repositories
- Mock follow records
- Authentication
- Ownership/permission enforcement
- Feed algorithm
- Notifications
- Installing packages

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect `types/showFollow.ts` and `models/showFollow.ts`.
- Update `plan.md`.

Findings:
- Added shared app-facing Show follow types in `types/showFollow.ts`: `ShowFollowId`, `ShowFollow`, `CreateShowFollowInput`, `RemoveShowFollowInput`, and `ShowFollowState`.
- Reused `ShowId`, `UserId`, and `ISODateString` from `types/show.ts` to keep follow modeling aligned with existing Show typing.
- Added lightweight backend-agnostic follow helpers in `models/showFollow.ts`: `isShowFollowed`, `getShowFollowerCountLabel`, and `getInitialShowFollowState`.
- Kept follow helpers app-facing and synchronous with no persistence, service, repository, authentication, ownership, database, or Supabase coupling.
- No UI updates, route changes, mock follow records, or package installation were added.

### Step 4.2 — Add Follow/Unfollow Button

Status: Complete

Goal:
Let users follow or unfollow Shows.

Acceptance Criteria:
- Show detail includes follow/unfollow control.
- Button state reflects current follow state.
- Toggle behavior uses the follow data boundary.
- Initial follow state is a safe local placeholder.
- Follow state is local UI-only and not persisted.
- Existing Show detail content, edit action, and Episode section remain intact.
- Home feed is not updated by follow actions.
- No global follow state is added.
- Follow UI clearly communicates behavior is temporary until account support is connected.
- No backend, database, Supabase, service, repository, auth, ownership, or permission logic is added.
- No packages are installed.

Files Allowed:
- `app/shows/[showId].tsx`
- `plan.md`

Out of Scope:
- Follower count UI
- Followed Shows list
- Followed Shows feed filter
- Persisting follow state
- Supabase setup
- Database schema
- Services
- Repositories
- Authentication
- Ownership/permission enforcement
- Global state/context
- Feed updates
- Notifications
- Installing packages

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect Show detail Follow/Unfollow behavior.
- Update `plan.md`.

Findings:
- Added a UI-only Follow/Unfollow control to `app/shows/[showId].tsx` using local component state.
- Initialized follow state with `getInitialShowFollowState` from `models/showFollow.ts` using safe local placeholders (`currentUserId: null`, no follow records), resulting in a default not-followed state.
- Added local toggle behavior that switches button label between `Follow Show` and `Following (Tap to Unfollow)` without persistence.
- Added clear helper text indicating follow state is local to the screen until account support is connected.
- Preserved existing Show detail content, Edit Show action, Episode list rendering, and Create Episode action.
- Did not add follower count UI, global state, Home feed updates, persistence, backend/database/Supabase/service/repository logic, auth, ownership, or package installation.

### Step 4.3 — Display Follower Count

Status: Complete

Goal:
Show follower count for a Show.

Acceptance Criteria:
- Show detail displays follower count.
- Follower count uses a local UI-only placeholder value.
- Follower count label uses or aligns with `getShowFollowerCountLabel`.
- Count remains local and non-persistent.
- Follow/Unfollow button remains functional.
- Existing Show detail content remains intact.
- Existing edit Show action remains intact.
- Existing Episode list and Create Episode action remain intact.
- Home feed is not updated by follower count or follow state.
- No global state is added.
- No backend, database, Supabase, service, repository, auth, ownership, or permission logic is added.
- No packages are installed.

Files Allowed:
- `app/shows/[showId].tsx`
- `plan.md`

Out of Scope:
- Followed Shows list
- Followed Shows feed filter
- Persisting follower count
- Persisting follow state
- Supabase setup
- Database schema
- Services
- Repositories
- Authentication
- Ownership/permission enforcement
- Global state/context
- Feed updates
- Notifications
- Installing packages

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect Show detail follower count display.
- Inspect Follow/Unfollow toggle behavior.
- Update `plan.md`.

Findings:
- Added a local UI-only follower count display to `app/shows/[showId].tsx` near the follow controls.
- Added a safe local placeholder follower count and rendered its label with `getShowFollowerCountLabel` from `models/showFollow.ts`.
- Kept follower count behavior screen-local and non-persistent, with optional local count updates when Follow/Unfollow is toggled.
- Preserved existing Show detail content, Edit Show action, Episode list rendering, and Create Episode action.
- Did not add Home feed updates, global state, persistence, backend/database/Supabase/service/repository logic, authentication, ownership, or package installation.

### Step 4.4 — Add Followed Shows List

Status: Complete

Goal:
Give users a place to view Shows they follow.

Acceptance Criteria:
- Followed Shows list renders followed Shows.
- Empty state is present.
- List routes to Show detail.
- Temporary followed Show items are local to the screen file.
- Followed Show items display Show title, description, and category.
- Visibility context is displayed where appropriate.
- Follower count label is displayed when local and simple.
- UI clearly communicates this is temporary/local until account support is connected.
- Show detail Follow/Unfollow state is not connected to this list.
- Home feed is not updated.
- Followed Shows feed filter is not added.
- No global state is added.
- No backend, database, Supabase, service, repository, auth, ownership, or permission logic is added.
- No packages are installed.

Files Allowed:
- `app/(tabs)/profile.tsx`
- `plan.md`

Out of Scope:
- Connecting Follow/Unfollow to the list
- Persisting followed Shows
- Followed Shows feed filter
- Supabase setup
- Database schema
- Services
- Repositories
- Authentication
- Ownership/permission enforcement
- Global state/context
- Feed updates
- Notifications
- Installing packages

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect Followed Shows list display on Profile.
- Confirm Profile tab remains accessible.
- Update `plan.md`.

Findings:
- Replaced the Profile placeholder with a UI-only Followed Shows list in `app/(tabs)/profile.tsx`.
- Added temporary followed Show display items local to `app/(tabs)/profile.tsx`.
- Each item displays Show title, description, category, visibility badge, and local follower count label via `getShowFollowerCountLabel`.
- Added a clear `Following` label and helper text that followed list behavior is local until account support is connected.
- Added safe item press navigation to existing Show detail route using temporary Show route params, without changing route architecture.
- Did not connect Show detail Follow/Unfollow local state to this list.
- Did not add Home feed updates, followed feed filtering, global state, persistence, backend/database/Supabase/service/repository/auth/ownership logic, or package installation.

### Step 4.5 — Add Followed Shows Feed Filter

Status: Complete

Goal:
Allow feed users to filter Episodes to followed Shows.

Acceptance Criteria:
- Feed can show all public Episodes or followed Show Episodes.
- Filter state is clear.
- Empty state handles no followed Shows or no Episodes.
- Existing visibility rules still apply.
- Home feed has a visible UI-only filter control.
- User can switch between all-public and followed-Shows views locally.
- Followed feed uses local temporary followed markers only.
- Newest-first ordering remains intact.
- Feed-to-Episode navigation remains intact.
- Feed-to-Show navigation remains intact.
- UI clearly communicates followed feed behavior is temporary/local until account support is connected.
- Profile followed Shows and Show detail follow state are not connected to this filter.
- No backend, database, Supabase, service, repository, auth, ownership, persistence, or global state logic is added.
- No packages are installed.

Files Allowed:
- `app/(tabs)/home.tsx`
- `plan.md`

Out of Scope:
- Connecting Profile followed Shows to Home feed
- Connecting Show detail Follow/Unfollow state to Home feed
- Persisting followed Shows
- Persisting feed preference
- Supabase setup
- Database schema
- Services
- Repositories
- Authentication
- Ownership/permission enforcement
- Global state/context
- Notifications
- Real feed algorithm
- Infinite scroll
- Pull to refresh
- Search
- Likes
- Comments
- Sharing
- Installing packages

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect Home feed filter control.
- Inspect all-public feed behavior.
- Inspect followed-Shows feed behavior.
- Confirm feed-to-Episode and feed-to-Show navigation.
- Update `plan.md`.

Findings:
- Added a UI-only Home feed filter control in `app/(tabs)/home.tsx` with local state for `All Public` and `Followed Shows`.
- Added local `isFollowedShow` flags on temporary feed items and filtered followed view from those local markers only.
- Kept temporary feed items local to `app/(tabs)/home.tsx`.
- Preserved public-only filtering and newest-first ordering in both filter views by deriving followed items from the existing public and sorted feed source.
- Preserved existing feed-to-Episode and feed-to-Show navigation behaviors.
- Added clear helper copy that followed feed behavior is local until account support is connected.
- Did not connect Profile followed Shows or Show detail Follow/Unfollow state to the Home filter.
- Did not add global state, persistence, backend/database/Supabase/service/repository/auth/ownership logic, feed algorithm logic, or package installation.

## Phase 5 — Audience Interaction

### Step 5.1 — Define Episode Poll Types

Status: Complete

Goal:
Define types for Episode polls and viewer choices.

Acceptance Criteria:
- Poll type supports prompt, choices, status, Episode reference, and result counts.
- Vote type supports user reference, poll reference, and selected choice.
- Types do not assume a final backend.

Files Allowed:
- `types/episodePoll.ts`
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

Findings:
- Added shared poll types in `types/episodePoll.ts`: `EpisodePollId`, `EpisodePollOptionId`, `EpisodePollVoteId`, `EpisodePollOption`, `EpisodePoll`, and `EpisodePollVote`.
- Reused existing shared IDs from prior phases: `EpisodeId` from `types/episode.ts`, and `UserId`/`ISODateString` from `types/show.ts`.
- Kept the poll model app-facing and backend-agnostic with string IDs and no service, repository, Supabase, database, or auth assumptions.
- Added create/update input types for future form work: `CreateEpisodePollInput`, `UpdateEpisodePollInput`, and `CreateEpisodePollVoteInput`.
- `EpisodePoll` references Episodes through `episodeId`, and vote types reference both poll (`pollId`) and user (`userId`).
- Added no UI, voting behavior, mock poll records, persistence, navigation, or Episode screen changes.

### Step 5.2 — Add Poll Creation Support

Status: Complete

Goal:
Allow creators to add a poll to an Episode.

Acceptance Criteria:
- Poll creation UI exists in the Episode creation or edit flow.
- At least two choices are required.
- Poll is associated with an Episode.
- Validation prevents invalid poll states.

Files Allowed:
- `app/shows/[showId]/episodes/create.tsx`
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

Findings:
- Updated `app/shows/[showId]/episodes/create.tsx` to add a UI-only poll draft section during Episode creation.
- Added local poll state for question, option labels, and active/inactive status with no persistence.
- Added local validation and helper text so poll question is required when options are entered and at least two non-empty options are required for a valid poll draft.
- Added a simple optional extra option flow using a local add-option action.
- Used `CreateEpisodePollInput` and `EpisodePollOption` types from `types/episodePoll.ts` for app-facing poll draft typing.
- Added clear UI copy that poll saving and viewer voting will be connected later.
- Did not add poll display on Episode detail, voting behavior, poll result behavior, backend/database/Supabase/service/repository/auth/ownership logic, persistence, or mock poll data.

### Step 5.3 — Display Poll on Episode Detail

Status: Complete

Goal:
Show an Episode poll to viewers.

Acceptance Criteria:
- Episode detail displays active poll prompt and choices.
- Closed or missing poll states are handled.
- Poll display does not allow duplicate voting yet unless Step 5.4 is complete.

Files Allowed:
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

Findings:
- Updated `app/episodes/[episodeId].tsx` to add a UI-only Episode poll section with local temporary poll data.
- Kept temporary poll data local to `app/episodes/[episodeId].tsx` and did not create a shared mock data layer.
- Used shared `EpisodePoll` and `EpisodePollOption` types from `types/episodePoll.ts` for the local poll display shape.
- Displayed poll question, poll status (active/inactive), and at least two poll options in a simple card section on Episode detail.
- Added helper text clearly stating voting and results will be connected later.
- Did not add voting behavior, poll results behavior, Create Episode poll-state connection, persistence, backend/database/Supabase/service/repository/auth/ownership logic, or package installation.

### Step 5.4 — Allow One Vote Per User

Status: Complete

Goal:
Allow each user to vote once per Episode poll.

Acceptance Criteria:
- Vote action records one choice per user per poll.
- Existing vote state prevents duplicate votes.
- User can see their selected choice.
- Anonymous or placeholder user behavior is documented.

Files Allowed:
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

Findings:
- Updated `app/episodes/[episodeId].tsx` to add UI-only local poll option selection and local vote submission behavior.
- Added local state for selected option and submitted vote lock to emulate one-vote-per-user behavior in the current screen session only.
- Added a local submit action that locks vote state after one submission and prevents additional submissions in the same local screen state.
- Kept voting behavior explicitly temporary/local with helper text that account-connected voting will be added later.
- Kept temporary poll content local to `app/episodes/[episodeId].tsx` and did not connect Create Episode poll draft state.
- Did not add poll results, counts, percentages, real user identity, persistence, backend/database/Supabase/service/repository/auth/ownership logic, or package installation.

### Step 5.5 — Show Poll Results

Status: Complete

Goal:
Show poll results after voting or when a poll is closed.

Acceptance Criteria:
- Results display vote counts or percentages.
- Results state appears only when allowed.
- Zero-vote state is handled.
- Selected choice remains clear.

Files Allowed:
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

Findings:
- Updated `app/episodes/[episodeId].tsx` to show UI-only poll results after a local vote is submitted.
- Kept results hidden before submission, then displayed simple local-only counts and percentages for each option after submission.
- Clearly indicated the selected option in the results state and retained local one-vote lock behavior.
- Kept all temporary vote/result values local to `app/episodes/[episodeId].tsx` with no shared mock data layer.
- Added clear helper text that results are local demo output until backend/account-connected behavior is implemented.
- Did not add persistence, real user identity, Create Episode poll-state coupling, backend/database/Supabase/service/repository/auth/ownership logic, or package installation.

## Phase 6 — Continue Watching

Status: In Progress

### Step 6.1 — Track Watched Episodes

Status: Complete

Goal:
Prepare app-facing watched Episode tracking shapes and helpers for future Continue Watching work.

Acceptance Criteria:
- Watched Episode types exist.
- A reusable `WatchedEpisode` type is exported.
- Create/update/progress input types are exported where helpful.
- Watched Episode references `episodeId`, `showId`, and `userId`.
- App-facing progress helper(s) remain backend-agnostic.
- No UI is added.
- No mock watched records are added.
- No backend, database, Supabase, service, repository, auth, or real user identity logic is added.
- No packages are installed.

Files Allowed:
- `types/watchedEpisode.ts`
- `models/watchedEpisode.ts`
- `plan.md`

Out of Scope:
- Continue Watching UI
- Tracking real video progress
- Notifications
- Recommendations
- Analytics

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect `git status --short`.
- Inspect `plan.md`, `types/watchedEpisode.ts`, and `models/watchedEpisode.ts`.
- Update `plan.md`.

Findings:
- Added `types/watchedEpisode.ts` with backend-agnostic watched Episode shapes: `WatchedEpisodeId`, `WatchedEpisodeProgress`, `WatchedEpisode`, `CreateWatchedEpisodeInput`, `UpdateWatchedEpisodeProgressInput`, and `WatchedEpisodeState`.
- Reused existing shared aliases for relationships and timestamps via `EpisodeId`, `ShowId`, `UserId`, and `ISODateString`.
- Added `models/watchedEpisode.ts` with small app-facing helpers: `getWatchProgressPercent`, `isEpisodeCompleted`, `getInitialWatchedEpisodeState`, and `getWatchedEpisodeProgressLabel`.
- Helpers are pure and backend-agnostic and do not include persistence, fetch/create/update/delete methods, services, repositories, auth, or user identity logic.
- No UI routes/screens were modified.
- No mock watched Episode records were added.
- No packages were installed.

### Step 6.2 — Determine Next Unwatched Episode

Status: Complete

Goal:
Add backend-agnostic helpers that determine the next unwatched Episode for a Show.

Acceptance Criteria:
- A helper exists to determine the next unwatched Episode.
- Helper uses `Episode` and `WatchedEpisode` types where appropriate.
- Ordering respects season and episode number.
- Returns the first ordered Episode when no watched records exist.
- Returns the next unwatched Episode when some Episodes are completed.
- Returns `null` when all Episodes are watched/completed.
- Logic is backend-agnostic and uses only function inputs.
- No UI is added.
- No mock watched records are added.
- No backend, database, Supabase, service, repository, auth, or user identity logic is added.
- No packages are installed.

Files Allowed:
- `models/watchedEpisode.ts`
- `plan.md`

Out of Scope:
- Continue Watching UI
- Tracking real video progress
- Recommendations
- Notifications
- Autoplay

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect `git status --short`.
- Inspect `plan.md` and `models/watchedEpisode.ts`.
- Update `plan.md`.

Findings:
- Updated `models/watchedEpisode.ts` with backend-agnostic next-unwatched helpers that operate only on passed-in arrays and ids.
- Added `sortEpisodesBySeasonAndEpisode` to enforce season/episode ordering.
- Added `getCompletedEpisodeIds` to derive completed watched episodes for a show using existing completion rules.
- Added `isEpisodeWatched` for set-based completion lookup by `episodeId`.
- Added `getNextUnwatchedEpisode` to return the first ordered episode not marked completed, or `null` if all episodes for the show are completed.
- Helpers use existing `Episode`, `EpisodeId`, `ShowId`, and `WatchedEpisode` types.
- No UI routes/screens were modified.
- No mock watched records were added.
- No packages were installed.

### Step 6.3 — Add Continue Watching Section

Status: Complete

Goal:
Add a UI-only Continue Watching section to Home using local temporary data and watched Episode helpers.

Acceptance Criteria:
- Home displays a UI-only Continue Watching section.
- Continue Watching uses temporary local data only.
- Temporary Continue Watching data remains local to `app/(tabs)/home.tsx`.
- Continue Watching uses watched Episode helper logic where appropriate.
- Each item displays Show title, next Episode title, season/episode number, and progress/status text.
- Existing Home feed remains intact.
- Existing public/all and followed feed filters remain intact.
- Existing feed-to-Episode navigation remains intact.
- Existing feed-to-Show navigation remains intact.
- No deduplication-by-Show logic is added yet.
- No persistence, backend, Supabase, service, repository, auth, user identity, global state, or real video progress tracking is added.
- No packages are installed.

Files Allowed:
- `app/(tabs)/home.tsx`
- `plan.md`

Out of Scope:
- Deduplicating Continue Watching by Show
- Persisting watched progress
- Real video progress tracking
- Supabase setup
- Database schema
- Services
- Repositories
- Authentication
- Real user identity
- Global state/context
- Feed algorithm changes
- Notifications

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect `git status --short`.
- Inspect `plan.md` status updates and `app/(tabs)/home.tsx`.
- Confirm existing Home feed/filter/navigation behavior remains intact.
- Update `plan.md`.

Findings:
- Updated `app/(tabs)/home.tsx` with a UI-only Continue Watching section placed above the existing Home feed list.
- Kept temporary Continue Watching data local to `app/(tabs)/home.tsx` via local seed arrays for Episodes and watched records.
- Used backend-agnostic watched helpers (`getNextUnwatchedEpisode`, `isEpisodeCompleted`, and `getWatchedEpisodeProgressLabel`) to compute next-up items and progress labels.
- Rendered Continue Watching rows with Show title, next Episode title, season/episode label, and progress/status text.
- Included local helper copy clarifying Continue Watching progress is temporary and account-connected behavior is added later.
- Continue Watching rows safely navigate to the existing Episode detail route with temporary params.
- Preserved existing Home feed behavior, including public/all and followed filters, feed-to-Episode navigation, and feed-to-Show navigation.
- Did not add deduplication-by-Show logic yet.
- Did not add persistence, backend, database, Supabase, service, repository, auth, user identity, global state, real video progress tracking, or package installation.

### Step 6.4 — Deduplicate Continue Watching by Show

Status: Complete

Goal:
Update Home Continue Watching so it renders one next-up item per Show using local temporary data.

Acceptance Criteria:
- Continue Watching displays one item per Show.
- Deduplication is based on `showId`.
- The remaining item for each Show represents the next relevant unwatched Episode.
- Continue Watching stays local/data-temporary in `app/(tabs)/home.tsx`.
- Existing Continue Watching navigation remains intact.
- Existing Home feed, filters, and feed navigation remain intact.
- No persistence, backend, Supabase, service, repository, auth, user identity, global state, or real video progress tracking is added.
- No packages are installed.

Files Allowed:
- `app/(tabs)/home.tsx`
- `plan.md`

Out of Scope:
- Persisting watched progress
- Real video progress tracking
- Supabase setup
- Database schema
- Services
- Repositories
- Authentication
- Real user identity
- Global state/context
- Feed algorithm changes
- Notifications
- Installing packages

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect `git status --short`.
- Inspect `plan.md` status updates and `app/(tabs)/home.tsx`.
- Confirm Continue Watching renders one item per Show.
- Confirm existing Home feed/filter/navigation behavior remains intact.
- Update `plan.md`.

Findings:
- Updated `app/(tabs)/home.tsx` with a small local helper that deduplicates Continue Watching seeds by `showId`.
- Deduplication keeps data local to Home and merges watched records per show before selecting the next unwatched Episode.
- Continue Watching now computes at most one next-up item per Show via existing backend-agnostic watched helpers.
- Continue Watching display and Episode-detail navigation behavior were preserved.
- Existing Home feed list, all-public/followed filters, feed-to-Episode navigation, and feed-to-Show navigation were preserved.
- No persistence, backend, database, Supabase, service, repository, auth, user identity, global state, or real video progress tracking was added.
- No packages were installed.

### Step 6.5 — Route to Correct Episode

Status: Complete

Goal:
Verify and refine Continue Watching navigation so each deduplicated item routes to the correct next unwatched Episode.

Acceptance Criteria:
- Continue Watching item press opens the existing Episode detail screen.
- Episode detail displays the correct next unwatched Episode for the selected Continue Watching item.
- Continue Watching route params match the selected next unwatched Episode.
- Continue Watching remains deduplicated by Show.
- Continue Watching data remains local to `app/(tabs)/home.tsx`.
- Existing Home feed/filter/navigation behavior remains intact.
- No persistence, backend, Supabase, service, repository, auth, user identity, global state, or real video progress tracking is added.
- No packages are installed.

Files Allowed:
- `app/(tabs)/home.tsx`
- `app/episodes/[episodeId].tsx` only if a minimal compatibility fix is required
- `plan.md`

Out of Scope:
- Persisting watched progress
- Real video progress tracking
- Supabase setup
- Database schema
- Services
- Repositories
- Authentication
- Real user identity
- Global state/context
- Feed algorithm changes
- Notifications
- Installing packages

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect `git status --short`.
- Inspect `plan.md` status updates and `app/(tabs)/home.tsx`.
- Verify Continue Watching routing params map to the selected next unwatched Episode values.
- Verify Episode detail renders correctly from Continue Watching params.
- Confirm existing Home feed/filter/navigation behavior remains intact.
- Update `plan.md`.

Findings:
- Verified Continue Watching selection still uses the deduplicated Show item and the next unwatched Episode chosen by backend-agnostic watched helpers.
- Added a small local route-param builder in `app/(tabs)/home.tsx` so Continue Watching and feed Episode navigation both send consistent temporary Episode-detail params.
- Confirmed Continue Watching params include Episode identity/title/description/ordering/hook/video and Show context values used by Episode detail.
- Confirmed Episode detail compatibility already existed; no `app/episodes/[episodeId].tsx` changes were required.
- Continue Watching remains deduplicated by Show and local to Home.
- Existing Home feed list, All Public/Followed filters, feed-to-Episode navigation, and feed-to-Show navigation were preserved.
- No persistence, backend, database, Supabase, service, repository, auth, user identity, global state, or real video progress tracking was added.
- No packages were installed.

## Phase 7 — Previously On

### Step 7.1 — Add Recap Field to Episode

Status: Complete

Goal:
Add Episode recap support for serialized viewing.

Acceptance Criteria:
- Episode type supports an optional recap field.
- CreateEpisodeInput and UpdateEpisodeInput support optional/nullable recap text.
- Existing Episodes without recaps remain valid.
- Any recap helpers remain app-facing and backend-agnostic.

Files Allowed:
- `types/episode.ts`
- `models/episode.ts`
- `plan.md`

Out of Scope:
- AI-generated recaps
- Transcript or caption logic
- Backend/database/service/repository/auth logic
- UI display of Previously On

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect `git status --short`.
- Inspect `plan.md`, `types/episode.ts`, and `models/episode.ts`.
- Update `plan.md`.

Findings:
- Added optional/nullable `recapText` support to the shared app-facing `Episode` type.
- Added `recapText` support to `CreateEpisodeInput` and `UpdateEpisodeInput`.
- Added small backend-agnostic recap helpers in `models/episode.ts`: `normalizeEpisodeRecap`, `hasEpisodeRecap`, and `getEpisodeRecapPreview`.
- Updated default create input helper to include `recapText: null` for consistency with optional recap support.
- No UI was added and no Previously On section was displayed.
- No backend, database, Supabase, service, repository, auth, user identity, persistence, or global state logic was added.
- No packages were installed.

### Step 7.2 — Display Previously On Section

Status: Complete

Goal:
Show recap context before or near an Episode.

Acceptance Criteria:
- Episode detail displays a Previously On section when recap exists.
- Section is hidden when recap is missing.
- Display supports serialized Show context.

Files Allowed:
- `app/episodes/[episodeId].tsx`
- `app/(tabs)/home.tsx` only if needed for temporary recap route params
- `app/shows/[showId].tsx` only if needed for temporary recap route params
- `plan.md`

Out of Scope:
- AI recap generation
- Collapsible behavior
- Playback gating
- Persistence
- Backend/database/service/repository/auth logic

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect `git status --short`.
- Inspect Episode detail with and without recap.
- Update `plan.md`.

Findings:
- Added a UI-only `Previously On` section in `app/episodes/[episodeId].tsx`.
- The section renders only when recap text exists and is hidden when recap text is missing.
- Episode detail recap handling uses existing episode recap helpers from `models/episode.ts` (`normalizeEpisodeRecap` and `hasEpisodeRecap`).
- Added temporary recap route params from Home and Show detail Episode navigation for local UI demonstration.
- Added local temporary episodes with and without recap text so both display states can be verified.
- No collapse/skip behavior was added.
- No pre-playback recap gating was added.
- No persistence, backend, database, Supabase, service, repository, auth, user identity, or global state logic was added.
- No packages were installed.

### Step 7.3 — Allow Recap Collapse/Skip

Status: Complete

Goal:
Let viewers collapse or skip recap content.

Acceptance Criteria:
- Recap section can be collapsed or skipped.
- Default state is sensible for serialized viewing.
- Interaction does not affect Episode watch state.

Files Allowed:
- `app/episodes/[episodeId].tsx`
- `plan.md`

Out of Scope:
- Persistent user preference
- AI summaries
- Video recap clips
- Playback gating
- Persistence
- Backend/database/service/repository/auth logic

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect `git status --short`.
- Toggle recap visibility.
- Confirm poll and video placeholder behavior remain intact.
- Update `plan.md`.

Findings:
- Added UI-only local recap collapse/expand behavior to Episode detail using `isRecapCollapsed` component state.
- When recap text exists, Previously On still renders and now includes a local action to toggle between `Hide recap` and `Show recap`.
- Recap text is hidden when collapsed and can be revealed again without leaving the screen.
- Collapse state is local and non-persistent; no storage or backend logic was added.
- No pre-playback recap gating or forced recap-before-playback behavior was added.
- Existing poll display, voting, local results behavior, and video placeholder behavior were preserved.
- No backend, database, Supabase, service, repository, auth, user identity, persistence, or global state logic was added.
- No packages were installed.

### Step 7.4 — Show Recap Before Episode Playback

Status: Ready for Review

Goal:
Place recap context before Episode playback or placeholder playback.

Acceptance Criteria:
- Previously On content appears before playback area when present.
- Skip or collapse behavior remains available.
- Missing recap state does not leave blank UI.

Files Allowed:
- `app/episodes/[episodeId].tsx`
- `plan.md`

Out of Scope:
- Full video player
- AI-generated recaps
- Playback gating
- Persistence
- Backend/database/service/repository/auth logic

Verification:
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Inspect `git status --short`.
- Inspect Episode detail recap-before-video layout.
- Confirm poll and video placeholder behavior remain intact.
- Update `plan.md`.

Findings:
- Reordered Episode detail so the Previously On recap section renders before the video placeholder when recap text exists.
- Preserved recap conditional rendering: no recap text still means no Previously On section.
- Preserved local recap collapse/expand behavior (`Hide recap` / `Show recap`).
- Added simple UI-only flow messaging and a local `Continue to episode` action to communicate the future pre-playback recap flow.
- Video placeholder remains visible and unchanged as a placeholder surface.
- No real playback gating or blocking behavior was added.
- Existing poll display, voting, and local results behavior remains intact.
- No persistence, backend, database, Supabase, service, repository, auth, user identity, or global state logic was added.
- No packages were installed.

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
| 2026-05-26 | Phase 0 — Project Foundation | Step 0.1 — Create Build Plan | Complete | Product owner reviewed and passed the build plan. Step 0.2 was started for foundation inspection. | `plan.md` | Confirmed `plan.md` exists and no app code changes were required. |
| 2026-05-26 | Phase 0 — Project Foundation | Step 0.2 — Confirm Project Foundation | Ready for Review | Inspected the existing Expo React Native project foundation, Expo Router setup, folder structure, UI/theming patterns, dependencies, scripts, and future gaps. | `plan.md` | Reviewed `git status --short`, `package.json`, `package-lock.json`, `tsconfig.json`, `app.json`, root folder structure, `app/_layout.tsx`, and `app/index.tsx`. |
| 2026-05-26 | Phase 0 — Project Foundation | Step 0.2 — Confirm Project Foundation | Complete | Product owner reviewed and passed the foundation inspection. Step 0.3 was started to verify the existing Expo Router setup. | `plan.md` | Confirmed Step 0.2 findings were recorded and no app code changes were required. |
| 2026-05-26 | Phase 0 — Project Foundation | Step 0.3 — Verify Expo Router Setup | Ready for Review | Verified the existing Expo Router entry point, plugin configuration, typed routes support, root stack layout, and index route. No duplicate routing setup was added. | `plan.md` | Reviewed `git status --short`, `package.json`, `app.json`, `tsconfig.json`, `app/_layout.tsx`, and `app/index.tsx`; ran `npm run lint`, which passed. |
| 2026-05-26 | Phase 0 — Project Foundation | Step 0.3 — Verify Expo Router Setup | Complete | Product owner reviewed and passed the Expo Router verification. Step 0.4 was started to add the initial bottom tab navigation shell. | `plan.md` | Confirmed Step 0.3 findings were recorded and no duplicate routing setup was added. |
| 2026-05-26 | Phase 0 — Project Foundation | Step 0.4 — Add Bottom Tab Navigation | Ready for Review | Added the initial Expo Router bottom tab shell with Home, Explore, Create, Notifications, and Profile placeholder tabs. | `plan.md`, `app/_layout.tsx`, `app/index.tsx`, `app/(tabs)/_layout.tsx`, `app/(tabs)/home.tsx`, `app/(tabs)/explore.tsx`, `app/(tabs)/create.tsx`, `app/(tabs)/notifications.tsx`, `app/(tabs)/profile.tsx` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 0 — Project Foundation | Step 0.4 — Add Bottom Tab Navigation | Complete | Product owner reviewed and passed the bottom tab navigation shell. Step 0.5 was started to add the shared theme foundation. | `plan.md` | Confirmed Step 0.4 findings were recorded and no packages were installed. |
| 2026-05-26 | Phase 0 — Project Foundation | Step 0.5 — Add Shared Theme | Ready for Review | Added a shared TypeScript theme foundation with colors, spacing, typography, radius, and shadow tokens. | `plan.md`, `constants/theme.ts` | Inspected `constants/theme.ts`; ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 0 — Project Foundation | Step 0.5 — Add Shared Theme | Complete | Product owner reviewed and passed the shared theme foundation. Step 0.6 was started to add themed wrapper components. | `plan.md` | Confirmed Step 0.5 findings were recorded and no themed components were added before approval. |
| 2026-05-26 | Phase 0 — Project Foundation | Step 0.6 — Add ThemedText and ThemedView | Ready for Review | Added generic themed text and view wrappers that use shared theme tokens, support variants, pass through React Native props, and allow style overrides. | `plan.md`, `components/ThemedText.tsx`, `components/ThemedView.tsx` | Inspected component files; ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 0 — Project Foundation | Step 0.6 — Add ThemedText and ThemedView | Complete | Product owner reviewed and passed the themed wrapper components. Step 0.7 was started to document folder conventions. | `plan.md` | Confirmed Step 0.6 findings were recorded and no product logic was added. |
| 2026-05-26 | Phase 0 — Project Foundation | Step 0.7 — Establish Folder Conventions | Ready for Review | Documented folder conventions for existing root folders and future folders, with guidance to avoid `src/`, empty future folders, and duplicate patterns. | `plan.md` | Inspected current folder structure; ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 0 — Project Foundation | Step 0.7 — Establish Folder Conventions | Complete | Product owner reviewed and passed the folder convention documentation. Step 0.8 was started for final Phase 0 verification. | `plan.md` | Confirmed Step 0.7 findings were recorded and no folders or files were moved. |
| 2026-05-26 | Phase 0 — Project Foundation | Step 0.8 — Verify TypeScript and App Launch | Ready for Review | Completed final Phase 0 verification: lint passed, TypeScript passed, Expo start was attempted, and the current route structure was inspected. | `plan.md` | Ran `npm run lint`, `npx tsc --noEmit`, and `npm start`; Expo started the project and was stopped with `Ctrl-C` after no immediate app-code error appeared. |
| 2026-05-26 | Phase 0 — Project Foundation | Step 0.8 — Verify TypeScript and App Launch | Complete | Product owner reviewed and passed final Phase 0 verification. Phase 1 was started with shared Show type definitions. | `plan.md` | Confirmed Step 0.8 findings were recorded and Phase 0 can be treated as passed. |
| 2026-05-26 | Phase 1 — Shows | Step 1.1 — Define Show Types | Ready for Review | Added shared app-facing Show TypeScript types, including Show identity, ownership, metadata, visibility, timestamps, and create/update inputs. | `plan.md`, `types/show.ts` | Inspected `types/show.ts`; ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 1 — Shows | Step 1.1 — Define Show Types | Complete | Product owner reviewed and passed the shared Show type definitions. Step 1.2 was started to add app-facing Show model helpers. | `plan.md` | Confirmed Step 1.1 findings were recorded and no UI or backend logic was added. |
| 2026-05-26 | Phase 1 — Shows | Step 1.2 — Add Show Data Model Placeholder | Ready for Review | Added app-facing Show defaults, options, and small model helpers without persistence, services, repositories, mock data, or UI behavior. | `plan.md`, `models/show.ts` | Inspected `models/show.ts`; ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 1 — Shows | Step 1.2 — Add Show Data Model Placeholder | Complete | Product owner reviewed and passed the Show model placeholder. Step 1.3 was started to add the first Show list UI surface. | `plan.md` | Confirmed Step 1.2 findings were recorded and no backend, service, repository, mock data, or UI behavior was added. |
| 2026-05-26 | Phase 1 — Shows | Step 1.3 — Create Show List UI | Ready for Review | Added the first Show list UI to the Home tab with temporary UI-only placeholder Shows rendered through shared theme components. | `plan.md`, `app/(tabs)/home.tsx` | Inspected `app/(tabs)/home.tsx`; ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 1 — Shows | Step 1.3 — Create Show List UI | Complete | Product owner reviewed and passed the Show list UI. Step 1.4 was started to add UI-only Show detail navigation. | `plan.md` | Confirmed Step 1.3 findings were recorded and temporary Shows remain UI-only. |
| 2026-05-26 | Phase 1 — Shows | Step 1.4 — Create Show Detail Screen | Ready for Review | Added a UI-only Show detail route and Home list navigation using temporary route params, with placeholder cover and episode sections. | `plan.md`, `app/_layout.tsx`, `app/(tabs)/home.tsx`, `app/shows/[showId].tsx` | Inspected Home and detail route files; ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 1 — Shows | Step 1.4 — Create Show Detail Screen | Complete | Product owner reviewed and passed the UI-only Show detail screen. Step 1.5 was started to add the UI-only Create Show form. | `plan.md` | Confirmed Step 1.4 findings were recorded and no backend, persistence, Create Show, Edit Show, or Episode logic was added. |
| 2026-05-26 | Phase 1 — Shows | Step 1.5 — Add Create Show Screen | Ready for Review | Added a UI-only Create Show form in the Create tab with local title, description, category, visibility state, validation, and preview. | `plan.md`, `app/(tabs)/create.tsx` | Inspected `app/(tabs)/create.tsx`; ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 1 — Shows | Step 1.5 — Add Create Show Screen | Complete | Product owner reviewed and passed the UI-only Create Show form. Step 1.6 was started to add UI-only Edit Show support. | `plan.md` | Confirmed Step 1.5 findings were recorded and no persistence or Home-list update behavior was added. |
| 2026-05-26 | Phase 1 — Shows | Step 1.6 — Add Edit Show Support | Ready for Review | Added UI-only Edit Show navigation and a prefilled local edit form using temporary route params from Show detail. | `plan.md`, `app/_layout.tsx`, `app/shows/[showId].tsx`, `app/shows/[showId]/edit.tsx` | Inspected detail and edit route files; ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 1 — Shows | Step 1.6 — Add Edit Show Support | Complete | Product owner reviewed and passed UI-only Edit Show support. Step 1.7 was started to standardize public/private visibility display. | `plan.md` | Confirmed Step 1.6 findings were recorded and no persistence, auth, ownership, or backend logic was added. |
| 2026-05-26 | Phase 1 — Shows | Step 1.7 — Add Public/Private Show Visibility Rules | Ready for Review | Standardized UI-only public/private visibility labels across Home and Show detail, and added private visibility helper copy to Create and Edit forms. | `plan.md`, `components/ShowVisibilityBadge.tsx`, `app/(tabs)/home.tsx`, `app/(tabs)/create.tsx`, `app/shows/[showId].tsx`, `app/shows/[showId]/edit.tsx` | Inspected visibility UI surfaces; ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 1 — Shows | Step 1.7 — Add Public/Private Show Visibility Rules | Complete | Product owner reviewed and passed UI-only public/private Show visibility rules. Phase 1 was marked complete and Phase 2 was started with Episode type definitions. | `plan.md` | Confirmed Step 1.7 findings were recorded and no auth, ownership, backend filtering, persistence, Episode type, or Episode UI was added before approval. |
| 2026-05-26 | Phase 2 — Episodes | Step 2.1 — Define Episode Types | Ready for Review | Added shared app-facing Episode types with Show references, season and episode numbering, nullable video placeholder fields, simple hook type support, timestamps, and create/update inputs. | `plan.md`, `types/episode.ts` | Inspected `types/episode.ts`; ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 2 — Episodes | Step 2.1 — Define Episode Types | Complete | Product owner reviewed and passed the shared Episode type definitions. Step 2.2 was started to add app-facing Episode model helpers. | `plan.md` | Confirmed Step 2.1 findings were recorded and no UI, mock data, backend, database, Supabase, service, repository, or persistence logic was added. |
| 2026-05-26 | Phase 2 — Episodes | Step 2.2 — Add Episode Data Model Placeholder | Ready for Review | Added lightweight app-facing Episode model defaults, hook labels/options, title and numbering validation helpers, display numbering, and next episode numbering from caller-provided summaries. | `plan.md`, `models/episode.ts` | Inspected `models/episode.ts`; ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 2 — Episodes | Step 2.2 — Add Episode Data Model Placeholder | Complete | Product owner reviewed and passed the app-facing Episode model helpers. Step 2.3 was started to add a UI-only Episode list to Show detail. | `plan.md` | Confirmed Step 2.2 findings were recorded and no UI, mock Episode records, backend, database, Supabase, service, repository, or persistence logic was added. |
| 2026-05-26 | Phase 2 — Episodes | Step 2.3 — Add Episode List to Show Detail | Ready for Review | Replaced the Show detail Episodes placeholder with a UI-only local Episode list showing display numbers, titles, descriptions, hook labels, and video placeholder status. | `plan.md`, `app/shows/[showId].tsx` | Inspected `app/shows/[showId].tsx`; ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 2 — Episodes | Step 2.3 — Add Episode List to Show Detail | Complete | Product owner reviewed and passed the UI-only Episode list on Show detail. Step 2.4 was started to add UI-only Episode detail navigation. | `plan.md` | Confirmed Step 2.3 findings were recorded and no Episode detail route, Create Episode screen, shared mock data, backend, database, Supabase, service, repository, auth, ownership, persistence, or real video playback was added. |
| 2026-05-26 | Phase 2 — Episodes | Step 2.4 — Create Episode Detail Screen | Ready for Review | Added a UI-only Episode detail route, wired Show detail Episode items to it with temporary route params, and displayed Episode metadata, hook label, video placeholder status, and parent Show return action. | `plan.md`, `app/_layout.tsx`, `app/shows/[showId].tsx`, `app/episodes/[episodeId].tsx` | Inspected Show detail navigation and Episode detail route files; ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 2 — Episodes | Step 2.4 — Create Episode Detail Screen | Complete | Product owner reviewed and passed the UI-only Episode detail screen and navigation. Step 2.5 was started to add a UI-only Create Episode form. | `plan.md` | Confirmed Step 2.4 findings were recorded and no Create Episode, Edit Episode, shared mock data, real video playback, backend, database, Supabase, service, repository, auth, ownership, or persistence logic was added. |
| 2026-05-26 | Phase 2 — Episodes | Step 2.5 — Add Create Episode Screen | Ready for Review | Added a UI-only Create Episode route, a Show detail Create Episode action, local form fields and validation, hook selection, placeholder video/thumbnail fields, and a non-persistent preview/submit state. | `plan.md`, `app/_layout.tsx`, `app/shows/[showId].tsx`, `app/shows/[showId]/episodes/create.tsx` | Inspected Show detail action and Create Episode route files; ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 2 — Episodes | Step 2.5 — Add Create Episode Screen | Complete | Product owner reviewed and passed the UI-only Create Episode screen. Step 2.6 was started to standardize season and episode numbering. | `plan.md` | Confirmed Step 2.5 findings were recorded and no persistence, Show detail list updates, Edit Episode, real video upload/playback, backend, database, Supabase, service, repository, auth, or ownership logic was added. |
| 2026-05-26 | Phase 2 — Episodes | Step 2.6 — Add Season and Episode Numbering | Ready for Review | Standardized UI-only Episode numbering review across Show detail, Episode detail, and Create Episode by using shared display and validation helpers with safe local defaults. | `plan.md`, `app/episodes/[episodeId].tsx` | Inspected Episode numbering surfaces; ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 2 — Episodes | Step 2.6 — Add Season and Episode Numbering | Complete | Product owner reviewed and passed UI-only season and episode numbering. Step 2.7 was started to standardize video placeholder support. | `plan.md` | Confirmed Step 2.6 findings were recorded and no Episode persistence, real data reordering, shared mock data, backend, database, Supabase, service, repository, auth, ownership, Edit Episode, upload, or playback logic was added. |
| 2026-05-26 | Phase 2 — Episodes | Step 2.7 — Add Video Placeholder Support | Ready for Review | Standardized UI-only video placeholder status labels across Show detail, Episode detail, and Create Episode, with local video/thumbnail messaging that avoids implying upload or playback exists. | `plan.md`, `models/episode.ts`, `app/shows/[showId].tsx`, `app/episodes/[episodeId].tsx`, `app/shows/[showId]/episodes/create.tsx` | Inspected video placeholder surfaces; ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 2 — Episodes | Step 2.7 — Add Video Placeholder Support | Complete | Product owner reviewed and passed UI-only video placeholder support. Phase 2 was marked complete and Phase 3 was started with Home feed layout work. | `plan.md` | Confirmed Step 2.7 findings were recorded and no real upload/playback, backend, database, Supabase, service, repository, auth, ownership, or persistence logic was added. |
| 2026-05-26 | Phase 3 — Feed | Step 3.1 — Create Home Feed Layout | In Progress | Started Home feed layout implementation to shift Home from a Show list to Episode feed cards while preserving Show context. | `plan.md`, `app/(tabs)/home.tsx` | Confirmed temporary feed items are local to `app/(tabs)/home.tsx`; pending verification checks for review readiness. |
| 2026-05-26 | Phase 3 — Feed | Step 3.1 — Create Home Feed Layout | Ready for Review | Reworked Home into a UI-only Episode feed shell with per-card Show context, season/episode numbering, hook labels, video status labels, and existing Show-detail navigation. | `plan.md`, `app/(tabs)/home.tsx` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 3 — Feed | Step 3.1 — Create Home Feed Layout | Complete | Product owner reviewed and passed the Home feed layout shell. Step 3.2 was started to display recent public Episodes. | `plan.md` | Confirmed Step 3.1 findings were recorded and no backend, database, Supabase, service, repository, auth, ownership, persistence, or feed algorithm logic was added. |
| 2026-05-26 | Phase 3 — Feed | Step 3.2 — Display Recent Public Episodes | In Progress | Started refining Home feed data shape for recency and public-only Episode display using temporary local feed items. | `plan.md`, `app/(tabs)/home.tsx` | Confirmed temporary feed items remain local to `app/(tabs)/home.tsx`; pending final verification checks. |
| 2026-05-26 | Phase 3 — Feed | Step 3.2 — Display Recent Public Episodes | Ready for Review | Added local `publishedAt` timestamps, filtered temporary feed items to public Shows only, and sorted displayed Episodes newest-first while preserving existing card layout and navigation behavior. | `plan.md`, `app/(tabs)/home.tsx` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 3 — Feed | Step 3.2 — Display Recent Public Episodes | Complete | Product owner reviewed and passed recent public Episode feed display. Step 3.3 was started to strengthen Show context on feed cards. | `plan.md` | Confirmed Step 3.2 findings were recorded and no backend, database, Supabase, service, repository, auth, ownership, persistence, or feed algorithm logic was added. |
| 2026-05-26 | Phase 3 — Feed | Step 3.3 — Preserve Show Context on Feed Cards | In Progress | Started refining feed card hierarchy and copy to make Show context parent-first for each Episode card while preserving current filtering, ordering, and navigation behavior. | `plan.md`, `app/(tabs)/home.tsx` | Confirmed temporary feed items remain local and public-only/newest-first behavior is preserved; pending final verification checks. |
| 2026-05-26 | Phase 3 — Feed | Step 3.3 — Preserve Show Context on Feed Cards | Ready for Review | Added series-oriented card labeling and stronger Show-first visual hierarchy while keeping Episode numbering/title, category, visibility, hook, and video status context intact. | `plan.md`, `app/(tabs)/home.tsx` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 3 — Feed | Step 3.3 — Preserve Show Context on Feed Cards | Complete | Product owner reviewed and passed feed-card Show-context refinements. Step 3.4 was started to support feed-to-Episode navigation. | `plan.md` | Confirmed Step 3.3 findings were recorded and no backend, database, Supabase, service, repository, auth, ownership, persistence, or feed algorithm logic was added. |
| 2026-05-26 | Phase 3 — Feed | Step 3.4 — Navigate from Feed to Episode | In Progress | Started Home feed navigation update to open Episode detail with temporary Episode and Show params while preserving existing feed filtering and ordering. | `plan.md`, `app/(tabs)/home.tsx` | Confirmed temporary feed items remain local and existing feed behavior stays intact; pending final verification checks. |
| 2026-05-26 | Phase 3 — Feed | Step 3.4 — Navigate from Feed to Episode | Ready for Review | Wired feed cards to Episode detail and passed temporary Episode/Show route params aligned with existing Episode detail rendering. | `plan.md`, `app/(tabs)/home.tsx` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 3 — Feed | Step 3.4 — Navigate from Feed to Episode | Complete | Product owner reviewed and passed feed-to-Episode navigation. Step 3.5 was started to add feed-to-Show navigation. | `plan.md` | Confirmed Step 3.4 findings were recorded and no backend, database, Supabase, service, repository, auth, ownership, persistence, or feed algorithm logic was added. |
| 2026-05-26 | Phase 3 — Feed | Step 3.5 — Navigate from Feed to Show | In Progress | Started adding a secondary Show-detail action on Home feed cards while preserving existing Episode-detail primary navigation and feed behavior. | `plan.md`, `app/(tabs)/home.tsx` | Confirmed temporary feed items remain local and public-only/newest-first behavior remains intact; pending final verification checks. |
| 2026-05-26 | Phase 3 — Feed | Step 3.5 — Navigate from Feed to Show | Ready for Review | Added `View Show` action per feed card and passed temporary Show route params to existing Show detail while keeping feed-to-Episode navigation intact. | `plan.md`, `app/(tabs)/home.tsx` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 3 — Feed | Step 3.5 — Navigate from Feed to Show | Complete | Product owner reviewed and passed feed-to-Show navigation. Phase 3 was marked complete and Phase 4 was started with Show follow data model work. | `plan.md` | Confirmed Step 3.5 findings were recorded and no backend, database, Supabase, service, repository, auth, ownership, persistence, or feed algorithm logic was added. |
| 2026-05-26 | Phase 4 — Follow Shows | Step 4.1 — Define Show Follow Data Model | In Progress | Started defining backend-agnostic app-facing Show follow types and lightweight model helpers for future follow/unfollow UI work. | `plan.md`, `types/showFollow.ts`, `models/showFollow.ts` | Confirmed follow scope remains type/model-only with no UI, no mock records, and no backend, database, Supabase, service, repository, auth, or ownership logic. |
| 2026-05-26 | Phase 4 — Follow Shows | Step 4.1 — Define Show Follow Data Model | Ready for Review | Added shared Show follow types and lightweight follow state helpers aligned with existing `ShowId` and `UserId` typing. | `plan.md`, `types/showFollow.ts`, `models/showFollow.ts` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 4 — Follow Shows | Step 4.1 — Define Show Follow Data Model | Complete | Product owner reviewed and passed shared Show follow data model types and helpers. Step 4.2 was started to add UI-only follow/unfollow behavior on Show detail. | `plan.md` | Confirmed Step 4.1 findings were recorded and no UI, persistence, backend, database, Supabase, service, repository, auth, or ownership logic was added. |
| 2026-05-26 | Phase 4 — Follow Shows | Step 4.2 — Add Follow/Unfollow Button | In Progress | Started adding a UI-only follow toggle on Show detail with local component state and temporary messaging for future account-connected behavior. | `plan.md`, `app/shows/[showId].tsx` | Confirmed follow behavior remains screen-local with no global state, persistence, backend, database, Supabase, service, repository, auth, or ownership logic. |
| 2026-05-26 | Phase 4 — Follow Shows | Step 4.2 — Add Follow/Unfollow Button | Ready for Review | Added a Show detail Follow/Unfollow button that toggles local UI state and clearly communicates temporary local behavior until account support is connected. | `plan.md`, `app/shows/[showId].tsx` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 4 — Follow Shows | Step 4.2 — Add Follow/Unfollow Button | Complete | Product owner reviewed and passed UI-only Follow/Unfollow behavior on Show detail. Step 4.3 was started to display follower count. | `plan.md` | Confirmed Step 4.2 findings were recorded and no persistence, global state, backend, database, Supabase, service, repository, auth, or ownership logic was added. |
| 2026-05-26 | Phase 4 — Follow Shows | Step 4.3 — Display Follower Count | In Progress | Started adding a UI-only local follower count display on Show detail using existing follow helpers and local screen state only. | `plan.md`, `app/shows/[showId].tsx` | Confirmed count scope remains screen-local and non-persistent with no Home feed update, global state, backend, database, Supabase, service, repository, auth, or ownership logic. |
| 2026-05-26 | Phase 4 — Follow Shows | Step 4.3 — Display Follower Count | Ready for Review | Added a Show detail follower count label driven by local placeholder state and kept it aligned with follow toggle behavior. | `plan.md`, `app/shows/[showId].tsx` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 4 — Follow Shows | Step 4.3 — Display Follower Count | Complete | Product owner reviewed and passed UI-only follower count display on Show detail. Step 4.4 was started to add a Followed Shows list surface. | `plan.md` | Confirmed Step 4.3 findings were recorded and no persistence, global state, backend, database, Supabase, service, repository, auth, or ownership logic was added. |
| 2026-05-26 | Phase 4 — Follow Shows | Step 4.4 — Add Followed Shows List | In Progress | Started adding a UI-only Followed Shows list on Profile with local temporary followed Show items and existing Show detail route compatibility. | `plan.md`, `app/(tabs)/profile.tsx` | Confirmed list scope remains local to Profile with no persistence, global state, Home feed update, followed feed filter, backend, database, Supabase, service, repository, auth, or ownership logic. |
| 2026-05-26 | Phase 4 — Follow Shows | Step 4.4 — Add Followed Shows List | Ready for Review | Added Profile-based Followed Shows list cards with local temporary Show data, visibility context, local follower labels, and safe navigation to existing Show detail params. | `plan.md`, `app/(tabs)/profile.tsx` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 4 — Follow Shows | Step 4.4 — Add Followed Shows List | Complete | Product owner reviewed and passed the UI-only Followed Shows list surface on Profile. Step 4.5 was started to add the Home followed-feed filter. | `plan.md` | Confirmed Step 4.4 findings were recorded and no persistence, global state, backend, database, Supabase, service, repository, auth, or ownership logic was added. |
| 2026-05-26 | Phase 4 — Follow Shows | Step 4.5 — Add Followed Shows Feed Filter | In Progress | Started adding a UI-only Home feed filter to switch between all-public episodes and local followed-show episodes using temporary in-file feed markers. | `plan.md`, `app/(tabs)/home.tsx` | Confirmed filter scope remains local to Home with no Profile or Show detail state coupling, no persistence, and no backend, database, Supabase, service, repository, auth, or ownership logic. |
| 2026-05-26 | Phase 4 — Follow Shows | Step 4.5 — Add Followed Shows Feed Filter | Ready for Review | Added local Home filter pills, local followed-show feed filtering, and a temporary helper note while preserving public-only/newest-first behavior and existing feed navigation actions. | `plan.md`, `app/(tabs)/home.tsx` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 4 — Follow Shows | Step 4.5 — Add Followed Shows Feed Filter | Complete | Product owner reviewed and passed the Home followed-show feed filter. Phase 4 was marked complete and Phase 5 was started with Episode poll type definitions. | `plan.md` | Confirmed Step 4.5 findings were recorded and no persistence, global state, backend, database, Supabase, service, repository, auth, or ownership logic was added. |
| 2026-05-26 | Phase 5 — Audience Interaction | Step 5.1 — Define Episode Poll Types | In Progress | Started defining shared app-facing Episode poll types and poll input shapes for future UI-only poll creation and voting flows. | `plan.md`, `types/episodePoll.ts` | Confirmed Step 5.1 scope is type-only with no UI, behavior, backend, database, Supabase, service, repository, auth, ownership, or mock poll data changes. |
| 2026-05-26 | Phase 5 — Audience Interaction | Step 5.1 — Define Episode Poll Types | Ready for Review | Added shared Episode poll, option, vote, and create/update input types using existing `EpisodeId`, `UserId`, and `ISODateString` aliases while remaining backend-agnostic. | `plan.md`, `types/episodePoll.ts` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 5 — Audience Interaction | Step 5.1 — Define Episode Poll Types | Complete | Product owner reviewed and passed shared Episode poll type definitions. Step 5.2 was started to add UI-only poll creation support in the Create Episode flow. | `plan.md` | Confirmed Step 5.1 findings were recorded and no UI, behavior, backend, database, Supabase, service, repository, auth, ownership, persistence, or mock poll data logic was added. |
| 2026-05-26 | Phase 5 — Audience Interaction | Step 5.2 — Add Poll Creation Support | In Progress | Started adding UI-only poll draft inputs to Create Episode with local state and validation messaging only. | `plan.md`, `app/shows/[showId]/episodes/create.tsx` | Confirmed Step 5.2 scope remains local UI-only with no persistence, backend, database, Supabase, service, repository, auth, ownership, voting, or poll results behavior. |
| 2026-05-26 | Phase 5 — Audience Interaction | Step 5.2 — Add Poll Creation Support | Ready for Review | Added local poll question/options/active-draft inputs and validation helper text to Create Episode, with clear messaging that poll saving and voting are connected later. | `plan.md`, `app/shows/[showId]/episodes/create.tsx` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 5 — Audience Interaction | Step 5.2 — Add Poll Creation Support | Complete | Product owner reviewed and passed UI-only poll drafting support in Create Episode. Step 5.3 was started to display polls on Episode detail without voting or results behavior. | `plan.md` | Confirmed Step 5.2 findings were recorded and no persistence, backend, database, Supabase, service, repository, auth, ownership, voting, or poll results logic was added. |
| 2026-05-26 | Phase 5 — Audience Interaction | Step 5.3 — Display Poll on Episode Detail | In Progress | Started adding a UI-only poll display section to Episode detail with local temporary poll content and no voting interactions. | `plan.md`, `app/episodes/[episodeId].tsx` | Confirmed Step 5.3 scope remains local UI-only with no voting, results, Create Episode state coupling, persistence, backend, database, Supabase, service, repository, auth, or ownership logic. |
| 2026-05-26 | Phase 5 — Audience Interaction | Step 5.3 — Display Poll on Episode Detail | Ready for Review | Added a local Episode detail poll card with question, active/inactive status, and options, plus helper text that voting and results are connected later. | `plan.md`, `app/episodes/[episodeId].tsx` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 5 — Audience Interaction | Step 5.3 — Display Poll on Episode Detail | Complete | Product owner reviewed and passed UI-only poll display on Episode detail. Step 5.4 was started to add local one-vote selection and vote-lock behavior. | `plan.md` | Confirmed Step 5.3 findings were recorded and no voting behavior, results, persistence, backend, database, Supabase, service, repository, auth, ownership, or Create Episode poll-state coupling was added. |
| 2026-05-26 | Phase 5 — Audience Interaction | Step 5.4 — Allow One Vote Per User | In Progress | Started adding local-only poll option selection and vote submission lock behavior on Episode detail with no persistence or real user identity. | `plan.md`, `app/episodes/[episodeId].tsx` | Confirmed Step 5.4 scope remains local UI-only with no results, counts, percentages, persistence, backend, database, Supabase, service, repository, auth, or ownership logic. |
| 2026-05-26 | Phase 5 — Audience Interaction | Step 5.4 — Allow One Vote Per User | Ready for Review | Added one-option selection, local submit action, and local one-vote lock state on Episode detail with helper copy that voting remains temporary until account support is connected. | `plan.md`, `app/episodes/[episodeId].tsx` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 5 — Audience Interaction | Step 5.4 — Allow One Vote Per User | Complete | Product owner reviewed and passed local one-vote selection and submission lock behavior on Episode detail. Step 5.5 was started to show local poll results after voting. | `plan.md` | Confirmed Step 5.4 findings were recorded and no results, persistence, backend, database, Supabase, service, repository, auth, ownership, or Create Episode poll-state coupling was added. |
| 2026-05-26 | Phase 5 — Audience Interaction | Step 5.5 — Show Poll Results | In Progress | Started adding UI-only local poll results display that appears after local vote submission on Episode detail. | `plan.md`, `app/episodes/[episodeId].tsx` | Confirmed Step 5.5 scope remains local UI-only with no persistence, real user identity, backend, database, Supabase, service, repository, auth, or ownership logic. |
| 2026-05-26 | Phase 5 — Audience Interaction | Step 5.5 — Show Poll Results | Ready for Review | Added local post-vote results with simple counts/percentages and selected-option indication while keeping pre-vote results hidden and all data local/non-persistent. | `plan.md`, `app/episodes/[episodeId].tsx` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 5 — Audience Interaction | Step 5.5 — Show Poll Results | Complete | Product owner reviewed and passed local poll results behavior on Episode detail. Phase 5 was marked complete and Phase 6 was started with watched Episode tracking types/helpers. | `plan.md` | Confirmed Step 5.5 findings were recorded and no persistence, backend, database, Supabase, service, repository, auth, ownership, or user identity logic was added. |
| 2026-05-26 | Phase 6 — Continue Watching | Step 6.1 — Track Watched Episodes | In Progress | Started defining shared backend-agnostic watched Episode types and lightweight app-facing progress helpers for future Continue Watching UI. | `plan.md`, `types/watchedEpisode.ts`, `models/watchedEpisode.ts` | Confirmed Step 6.1 scope is type/model-only with no UI, mock watched records, persistence, backend, database, Supabase, service, repository, auth, or user identity logic. |
| 2026-05-26 | Phase 6 — Continue Watching | Step 6.1 — Track Watched Episodes | Ready for Review | Added shared watched Episode identity/progress/input/state types and reusable progress/completion/label helpers, keeping all logic app-facing and backend-agnostic. | `plan.md`, `types/watchedEpisode.ts`, `models/watchedEpisode.ts` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-26 | Phase 6 — Continue Watching | Step 6.1 — Track Watched Episodes | Complete | Product owner reviewed and passed watched Episode tracking types and helper groundwork. Step 6.2 was started to determine the next unwatched Episode by Show. | `plan.md` | Confirmed Step 6.1 findings were recorded and no UI, backend, database, Supabase, service, repository, auth, user identity, persistence, or mock watched records were added. |
| 2026-05-26 | Phase 6 — Continue Watching | Step 6.2 — Determine Next Unwatched Episode | In Progress | Started adding backend-agnostic helper logic to derive the next unwatched Episode from local Episode and WatchedEpisode arrays. | `plan.md`, `models/watchedEpisode.ts` | Confirmed Step 6.2 scope remains helper-only with no UI, mock watched records, backend, database, Supabase, service, repository, auth, user identity, or persistence logic. |
| 2026-05-26 | Phase 6 — Continue Watching | Step 6.2 — Determine Next Unwatched Episode | Ready for Review | Added show-scoped ordering/completion helpers and next-unwatched selection logic that returns the first unwatched ordered episode or `null` when all are completed. | `plan.md`, `models/watchedEpisode.ts` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-27 | Phase 6 — Continue Watching | Step 6.2 — Determine Next Unwatched Episode | Complete | Product owner reviewed and passed next-unwatched helper logic. Step 6.3 was started to add a Home Continue Watching section with local temporary data. | `plan.md` | Confirmed Step 6.2 findings were recorded and no UI, persistence, backend, database, Supabase, service, repository, auth, user identity, or mock watched records were added. |
| 2026-05-27 | Phase 6 — Continue Watching | Step 6.3 — Add Continue Watching Section | In Progress | Started adding a UI-only Continue Watching section on Home using local temporary data and existing watched helpers. | `plan.md`, `app/(tabs)/home.tsx` | Confirmed Step 6.3 scope remains local UI-only with no persistence, backend, database, Supabase, service, repository, auth, user identity, global state, or real video progress tracking. |
| 2026-05-27 | Phase 6 — Continue Watching | Step 6.3 — Add Continue Watching Section | Ready for Review | Added a Home Continue Watching section above the feed, rendering local next-up items with show context, episode numbering, progress/status labels, and safe Episode-detail navigation while preserving existing feed/filter behavior. | `plan.md`, `app/(tabs)/home.tsx` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-27 | Phase 6 — Continue Watching | Step 6.3 — Add Continue Watching Section | Complete | Product owner reviewed and passed the UI-only Home Continue Watching section. Step 6.4 was started to deduplicate Continue Watching to one item per Show. | `plan.md` | Confirmed Step 6.3 findings were recorded and no persistence, backend, database, Supabase, service, repository, auth, user identity, global state, or real video progress tracking was added. |
| 2026-05-27 | Phase 6 — Continue Watching | Step 6.4 — Deduplicate Continue Watching by Show | In Progress | Started deduplicating Continue Watching by Show using local temporary Home data and existing watched helpers. | `plan.md`, `app/(tabs)/home.tsx` | Confirmed Step 6.4 scope remains local UI-only with no persistence, backend, database, Supabase, service, repository, auth, user identity, global state, or real video progress tracking. |
| 2026-05-27 | Phase 6 — Continue Watching | Step 6.4 — Deduplicate Continue Watching by Show | Ready for Review | Added local show-based Continue Watching deduplication so Home now resolves one next-up Episode per Show while preserving existing Home feed/filter/navigation behavior. | `plan.md`, `app/(tabs)/home.tsx` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-27 | Phase 6 — Continue Watching | Step 6.4 — Deduplicate Continue Watching by Show | Complete | Product owner reviewed and passed show-based Continue Watching deduplication. Step 6.5 was started to verify/refine routing to the correct next unwatched Episode. | `plan.md` | Confirmed Step 6.4 findings were recorded and no persistence, backend, database, Supabase, service, repository, auth, user identity, global state, or real video progress tracking was added. |
| 2026-05-27 | Phase 6 — Continue Watching | Step 6.5 — Route to Correct Episode | In Progress | Started verifying and refining Continue Watching route params so each deduplicated Show item opens the correct next unwatched Episode detail state. | `plan.md`, `app/(tabs)/home.tsx` | Confirmed Step 6.5 scope remains local UI-only with no persistence, backend, database, Supabase, service, repository, auth, user identity, global state, or real video progress tracking. |
| 2026-05-27 | Phase 6 — Continue Watching | Step 6.5 — Route to Correct Episode | Ready for Review | Added a shared local route-param builder for Home Episode navigation and confirmed Continue Watching opens the selected next unwatched Episode with complete temporary Episode/Show params. | `plan.md`, `app/(tabs)/home.tsx` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-27 | Phase 6 — Continue Watching | Step 6.5 — Route to Correct Episode | Complete | Product owner reviewed and passed Continue Watching routing to the correct next unwatched Episode. Phase 6 was marked complete and Phase 7 was started. | `plan.md` | Confirmed Step 6.5 findings were recorded and no persistence, backend, database, Supabase, service, repository, auth, user identity, or global state logic was added. |
| 2026-05-27 | Phase 7 — Previously On | Step 7.1 — Add Recap Field to Episode | In Progress | Started adding app-facing optional recap support to Episode types and helpers for future Previously On UI. | `plan.md`, `types/episode.ts`, `models/episode.ts` | Confirmed Step 7.1 scope remains type/model-only with no UI, Previously On rendering, persistence, backend, database, Supabase, service, repository, auth, user identity, or global state logic. |
| 2026-05-27 | Phase 7 — Previously On | Step 7.1 — Add Recap Field to Episode | Ready for Review | Added optional/nullable `recapText` to Episode and create/update inputs, plus backend-agnostic recap normalization/presence/preview helpers. | `plan.md`, `types/episode.ts`, `models/episode.ts` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-27 | Phase 7 — Previously On | Step 7.1 — Add Recap Field to Episode | Complete | Product owner reviewed and passed app-facing Episode recap type/input/helper support. Step 7.2 was started to display Previously On on Episode detail. | `plan.md` | Confirmed Step 7.1 findings were recorded and no UI, persistence, backend, database, Supabase, service, repository, auth, user identity, or global state logic was added. |
| 2026-05-27 | Phase 7 — Previously On | Step 7.2 — Display Previously On Section | In Progress | Started adding a UI-only Episode detail Previously On section with temporary recap route params. | `plan.md`, `app/episodes/[episodeId].tsx`, `app/(tabs)/home.tsx`, `app/shows/[showId].tsx` | Confirmed Step 7.2 scope remains UI-only with no collapse/skip behavior, playback gating, persistence, backend, database, Supabase, service, repository, auth, user identity, or global state logic. |
| 2026-05-27 | Phase 7 — Previously On | Step 7.2 — Display Previously On Section | Ready for Review | Added conditional Episode detail Previously On rendering driven by temporary recap text and existing recap helpers, with local route-param recap support from Home and Show detail Episode navigation. | `plan.md`, `app/episodes/[episodeId].tsx`, `app/(tabs)/home.tsx`, `app/shows/[showId].tsx` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-27 | Phase 7 — Previously On | Step 7.2 — Display Previously On Section | Complete | Product owner reviewed and passed UI-only Previously On display behavior on Episode detail. Step 7.3 was started to add local recap collapse/skip controls. | `plan.md` | Confirmed Step 7.2 findings were recorded and no backend, database, Supabase, service, repository, auth, user identity, persistence, or global state logic was added. |
| 2026-05-27 | Phase 7 — Previously On | Step 7.3 — Allow Recap Collapse/Skip | In Progress | Started adding UI-only local collapse/expand controls for Previously On on Episode detail. | `plan.md`, `app/episodes/[episodeId].tsx` | Confirmed Step 7.3 scope remains local UI-only with no gating, persistence, backend, database, Supabase, service, repository, auth, user identity, or global state logic. |
| 2026-05-27 | Phase 7 — Previously On | Step 7.3 — Allow Recap Collapse/Skip | Ready for Review | Added local recap toggle controls on Episode detail so recap can be hidden and shown again when recap text exists, while preserving existing poll and video placeholder behavior. | `plan.md`, `app/episodes/[episodeId].tsx` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |
| 2026-05-27 | Phase 7 — Previously On | Step 7.3 — Allow Recap Collapse/Skip | Complete | Product owner reviewed and passed local recap collapse/expand behavior on Episode detail. Step 7.4 was started to place recap before playback placeholder content. | `plan.md` | Confirmed Step 7.3 findings were recorded and no backend, database, Supabase, service, repository, auth, user identity, persistence, or global state logic was added. |
| 2026-05-27 | Phase 7 — Previously On | Step 7.4 — Show Recap Before Episode Playback | In Progress | Started reordering Episode detail so Previously On appears before the video placeholder while preserving local recap toggle behavior. | `plan.md`, `app/episodes/[episodeId].tsx` | Confirmed Step 7.4 scope remains UI-only with no real playback, gating, persistence, backend, database, Supabase, service, repository, auth, user identity, or global state logic. |
| 2026-05-27 | Phase 7 — Previously On | Step 7.4 — Show Recap Before Episode Playback | Ready for Review | Moved Previously On ahead of video placeholder and added local placeholder flow copy/action while preserving recap conditional rendering, local collapse/expand, and existing poll/video behavior. | `plan.md`, `app/episodes/[episodeId].tsx` | Ran `npm run lint` and `npx tsc --noEmit`; both passed. |

## 7. Decisions Log

| Date | Decision | Reason | Revisit Later? |
| --- | --- | --- | --- |

## 8. Known Issues

- No blocking issues logged for Step 0.2.
- No dedicated TypeScript check script is currently defined; `npx tsc --noEmit` is the current direct TypeScript verification command.
- No test script is currently defined; future testing expectations should be added deliberately when tests are introduced.
- Shared theme and themed primitives are now present. Future work should reuse `constants/theme.ts`, `components/ThemedText.tsx`, and `components/ThemedView.tsx` instead of creating duplicate patterns.
- `types` now exists for shared TypeScript types. `models` now exists for app-facing model utilities. `hooks`, `services`, `lib`, `scripts`, and `src` folders are not present. Do not create them until an approved step needs them.
- No routing blocker was found in Step 0.3.
- Step 0.4 added bottom tabs without icons. Icons remain out of scope until an existing icon pattern is available or a future step explicitly allows one.
- Step 0.5 added theme tokens only. Existing screens still use local styles until a future step explicitly allows adopting the shared theme.
- Step 0.6 added themed wrapper components only. Existing screens still use local styles until a future step explicitly allows adopting shared components.
- Step 0.7 documented root-level folder conventions. Do not introduce `src/` unless a future approved migration decision changes the project layout.
- Step 1.3 added temporary UI-only placeholder Shows inside the Home tab. Do not treat them as shared mock data or persistence.
- Step 1.4 passes temporary Show display values through route params for UI-only detail rendering. Do not treat this as a data access pattern for backend work.
- Step 1.5 added a UI-only Create Show form. It does not persist Shows or update the Home list.
- Step 1.6 added a UI-only Edit Show form. It does not persist edits, update the Home list, or update the Show detail screen.
- Step 1.7 added UI-only visibility labels and helper text. It does not implement auth, ownership, backend filtering, or persistence.
- Step 2.1 added shared Episode types only. It does not add UI, mock data, persistence, backend, database, Supabase, service, or repository logic.
- Step 2.2 added shared Episode model helpers only. It does not add UI, mock Episode records, persistence, backend, database, Supabase, service, or repository logic.
- Step 2.3 added a UI-only local Episode list on Show detail. It does not add Episode navigation, shared mock data, real video playback, persistence, backend, database, Supabase, service, repository, auth, or ownership logic.
- Step 2.4 added UI-only Episode detail navigation through temporary route params. It does not add Create Episode, Edit Episode, shared mock data, real video playback, persistence, backend, database, Supabase, service, repository, auth, or ownership logic.
- Step 2.5 added a UI-only Create Episode form. It does not persist Episodes, update the Show detail Episode list, add Edit Episode, perform real video upload/playback, or add backend, database, Supabase, service, repository, auth, or ownership logic.
- Step 2.6 standardized UI-only season and episode numbering display and validation. It does not persist Episode values, reorder real data, add shared mock data, or add backend, database, Supabase, service, repository, auth, ownership, Edit Episode, upload, or playback logic.
- Step 2.7 standardized UI-only video and thumbnail placeholder messaging. It does not add real upload, playback, Mux, Supabase storage, external video services, persistence, backend, database, Supabase, service, repository, auth, ownership, shared mock data, or Edit Episode logic.
- Step 3.1 reworked Home into a UI-only Episode feed shell with local temporary feed items and preserved Show context. It does not add real feed data, ranking, backend, database, Supabase, service, repository, auth, ownership, persistence, or shared mock data.
- Step 3.2 refines Home feed display with local recency timestamps, public-only filtering, and newest-first ordering for temporary Episodes. It does not add real feed data sources, ranking algorithms, backend, database, Supabase, service, repository, auth, ownership, persistence, or shared mock data.
- Step 3.3 strengthens Show context on Home feed cards through UI hierarchy and series-oriented labeling while preserving existing temporary public-only filtering, newest-first ordering, and navigation behavior.
- Step 3.4 adds feed-to-Episode navigation using temporary route params aligned with existing Episode detail behavior, while preserving public-only filtering, newest-first ordering, and local temporary feed data.
- Step 3.5 adds feed-to-Show navigation with a secondary card action while preserving existing feed-to-Episode behavior, public-only filtering, newest-first ordering, and local temporary feed data.
- Step 4.1 adds app-facing Show follow types and lightweight follow state helpers only. It does not add UI, mock follow records, persistence, backend, database, Supabase, service, repository, auth, or ownership logic.
- Step 4.2 adds a Show detail follow/unfollow toggle using local UI state only. It does not add follower count UI, global state, persistence, backend, database, Supabase, service, repository, auth, or ownership logic.
- Step 4.3 adds a Show detail follower count display using local UI-only state and follow helper labels. It does not add persistence, global state, backend, database, Supabase, service, repository, auth, or ownership logic.
- Step 4.4 adds a Profile-based Followed Shows list using local temporary items only. It does not connect to Show detail follow state, add persistence, global state, feed updates, backend, database, Supabase, service, repository, auth, or ownership logic.
- Step 4.5 adds a Home feed filter for all-public versus local followed-show episodes using temporary in-file markers only. It does not connect Profile or Show detail follow state, add persistence, global state, backend, database, Supabase, service, repository, auth, ownership, or real feed algorithm logic.
- Step 5.1 adds shared app-facing Episode poll types only. It does not add poll UI, voting behavior, persistence, mock poll records, backend, database, Supabase, service, repository, auth, or ownership logic.
- Step 5.2 adds UI-only poll draft inputs to Create Episode with local validation and local state only. It does not add poll display on Episode detail, voting behavior, poll results, backend, database, Supabase, service, repository, auth, ownership, persistence, or mock poll data.
- Step 5.3 adds a UI-only poll display section on Episode detail with local temporary poll content only. It does not add voting behavior, poll results, Create Episode poll-state coupling, persistence, backend, database, Supabase, service, repository, auth, ownership, or a shared mock poll data layer.
- Step 5.4 adds UI-only local one-vote selection and submission lock behavior on Episode detail. It does not add poll results, vote counts, percentages, real user identity, persistence, Create Episode poll-state coupling, backend, database, Supabase, service, repository, auth, or ownership logic.
- Step 5.5 adds UI-only local poll results shown after local vote submission on Episode detail. It does not add persistent votes/results, real user identity, Create Episode poll-state coupling, backend, database, Supabase, service, repository, auth, or ownership logic.
- Step 6.1 adds backend-agnostic watched Episode types and local model helpers only. It does not add Continue Watching UI, real playback tracking, persistence, backend, database, Supabase, service, repository, auth, user identity, or mock watched records.
- Step 6.2 adds backend-agnostic watched/episode ordering helpers and next-unwatched selection logic only. It does not add Continue Watching UI, real playback timing, persistence, backend, database, Supabase, service, repository, auth, user identity, or mock watched records.
- Step 6.3 adds a UI-only Home Continue Watching section using local temporary data and watched helpers. It does not add deduplication-by-Show, persistence, real video progress tracking, backend, database, Supabase, service, repository, auth, user identity, or global state.
- Step 6.4 deduplicates Home Continue Watching to one next-up item per Show using local temporary data and watched helpers. It does not add persistence, real video progress tracking, backend, database, Supabase, service, repository, auth, user identity, or global state.
- Step 6.5 verifies/refines Home Continue Watching Episode-detail routing so deduplicated items open the correct next unwatched Episode with consistent temporary params. It does not add persistence, real video progress tracking, backend, database, Supabase, service, repository, auth, user identity, or global state.
- Step 7.1 adds optional app-facing Episode recap typing and tiny recap helpers only. It does not add recap UI, Previously On rendering, persistence, backend, database, Supabase, services, repositories, auth, user identity, or global state.
- Step 7.2 adds a UI-only Episode detail Previously On section that displays when temporary recap text exists and hides when missing. It does not add collapse/skip behavior, playback gating, persistence, backend, database, Supabase, services, repositories, auth, user identity, or global state.
- Step 7.3 adds UI-only local recap collapse/expand controls on Episode detail. It does not add playback gating, forced recap-before-playback behavior, persistence, backend, database, Supabase, services, repositories, auth, user identity, or global state.
- Step 7.4 reorders Episode detail to present recap before the video placeholder when recap exists, with UI-only placeholder flow copy. It does not add real playback, gating, persistence, backend, database, Supabase, services, repositories, auth, user identity, or global state.

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
Step 7.4 — Show Recap Before Episode Playback is Ready for Review. After product owner approval, Step 7.4 can be marked Complete and Phase 7 can be reviewed for completion.
