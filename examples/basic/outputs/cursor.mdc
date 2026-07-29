---
description: Reviewed project context
alwaysApply: false
---

# Project context

## Current task
Add offline support so the pantry list works without a network connection.

## Phase
Implement

## Rules
- No third-party runtime dependencies in the front end
- Must work on the last two versions of mobile Safari and Chrome

## Boundaries
- Do not change the sync API contract without flagging it
- Do not add a build step that requires Node in the browser

## Decisions
- **Store the pantry list in IndexedDB** — Persist the list locally so the app opens instantly and works offline.
  - Why: Users mostly open the app in a store with poor signal, so local-first avoids a blank screen.
  - Tradeoff: Adds sync-conflict handling later, but the offline win is worth it for v1.
  - Outcome: Cold open dropped from about 2s to under 200ms in testing.
  - Backed by: IndexedDB is supported across the target browsers (https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- **No account required for v1** — The app works with a device-local list; sign-in comes later.
  - Why: Removing the sign-up wall is the fastest path to first value.

## Avoid
- localStorage for the list — its size limits and synchronous API caused jank
- A full framework rewrite — ruled out for v1

## Definition of done
The pantry list loads and is editable with the network fully disabled, and pending edits sync automatically when the connection returns.
