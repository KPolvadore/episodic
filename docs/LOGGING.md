# Logging Conventions

## Goals
- Keep logs useful in development without leaking PII.
- Avoid noisy logs in production builds.

## Use
- Prefer `logger` from `/Users/kerrypolvadore/KerryP/episodic-mobile/src/lib/logger.ts`.
- Levels:
  - `debug`: dev-only verbose output
  - `info`: dev-only normal flow info
  - `warn`: recoverable issues
  - `error`: failures that affect the user or data

## No PII
Never log:
- Emails, phone numbers, user IDs tied to real users
- Tokens, auth headers, session strings
- Secrets, API keys

The logger redacts common sensitive keys automatically, but do not rely on it.

## Examples
```ts
import { logger } from "@/src/lib/logger";

logger.warn("Feed API unavailable, falling back to mocks", {
  endpoint: "/v1/feeds",
  reason: error?.message,
});
```

## Production Behavior
- `debug` and `info` are suppressed in production.
- `warn` and `error` are allowed.
