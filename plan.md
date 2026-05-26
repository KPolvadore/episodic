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

Current Phase: Phase 1 — Shows  
Current Step: Step 1.7 — Add Public/Private Show Visibility Rules  
Status: Ready for Review

## 4. Phase Roadmap

### Phase 0 — Project Foundation

Status: Complete

Goal: Establish the app shell, routing, theme, folder structure, and development guardrails.

### Phase 1 — Shows

Status: In Progress

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

Status: Ready for Review

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
Step 1.7 — Add Public/Private Show Visibility Rules is Ready for Review. After product owner approval, Phase 1 can be reviewed for completion and Phase 2 — Episodes can begin.
