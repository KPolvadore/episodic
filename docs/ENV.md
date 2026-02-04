# Environment Variables (Episodic)

This is the canonical list of environment variables for v1.

## Rules

- **No secrets in git.** Use EAS secrets for preview/production.
- Dev uses local `.env.local` (not committed).
- Variables prefixed with `EXPO_PUBLIC_` are safe to expose to the client.

## Variables

| Name | Purpose | Required | Default | Where Set | Profiles |
| --- | --- | --- | --- | --- | --- |
| `EXPO_PUBLIC_APP_ENV` | App environment label | Yes | `development` | `.env.local` (dev), `eas.json`/EAS secrets | dev/preview/prod |
| `EXPO_PUBLIC_API_BASE_URL` | API base URL for real backend | Yes (for real API) | empty | `.env.local` or EAS secrets | dev/preview/prod |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes (auth/DB) | empty | `.env.local` or EAS secrets | dev/preview/prod |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Yes (auth/DB) | empty | `.env.local` or EAS secrets | dev/preview/prod |
| `EXPO_PUBLIC_MUX_TOKEN_ID` | Mux token id | Optional (until Mux wired) | empty | `.env.local` or EAS secrets | dev/preview/prod |
| `EXPO_PUBLIC_MUX_TOKEN_SECRET` | Mux token secret | Optional (until Mux wired) | empty | `.env.local` or EAS secrets | dev/preview/prod |
| `EXPO_PUBLIC_SENTRY_DSN` | Sentry DSN | Optional (until Sentry wired) | empty | `.env.local` or EAS secrets | dev/preview/prod |
| `EXPO_PUBLIC_FEATURE_USE_MOCKS` | Feature flag: mock vs real API | Yes | `true` | `.env.local` or EAS secrets | dev/preview/prod |

## Local Dev Setup

1. Create `.env.local` with the variables above.
2. Run the app as usual; `app.config.ts` reads env values.

## EAS Setup

- Update `eas.json` with profile-specific env values (or set as EAS secrets).
