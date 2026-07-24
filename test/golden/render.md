# Project Context Pack

_Focus: Coding_

_Task: Add offline support so the pantry list works without a network connection._

> Phase: Implement

Use this as background when continuing this project in another AI tool. Treat the items below as facts about the project. Do not invent details; ask before changing a major decision.

## Project summary
Pantry is a small web app for tracking what food you have at home and what needs restocking. It has a static front end and a lightweight sync API.

## Current direction
Ship a v1 that works reliably on a phone in a grocery store, including on a weak connection.

## Key decisions
- **Store the pantry list in IndexedDB** — Persist the list locally so the app opens instantly and works offline.
  - Why: Users mostly open the app in a store with poor signal, so local-first avoids a blank screen.
  - Tradeoff: Adds sync-conflict handling later, but the offline win is worth it for v1.
  - Outcome: Cold open dropped from about 2s to under 200ms in testing.
  - Backed by: IndexedDB is supported across the target browsers (https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- **No account required for v1** — The app works with a device-local list; sign-in comes later.
  - Why: Removing the sign-up wall is the fastest path to first value.

## Trusted sources
- [MDN — IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) — _primary_
  - Backs: IndexedDB is supported across the target browsers
- [web.dev — Offline cookbook](https://web.dev/articles/offline-cookbook) — _reputable_

## Best prompts
- _(Claude)_ Given this IndexedDB wrapper, add a queue that retries failed writes when the connection returns. Keep it dependency-free.

## Constraints
- No third-party runtime dependencies in the front end
- Must work on the last two versions of mobile Safari and Chrome

## Boundaries
- Do not change the sync API contract without flagging it
- Do not add a build step that requires Node in the browser

## What to avoid
- localStorage for the list — its size limits and synchronous API caused jank
- A full framework rewrite — ruled out for v1

## Open questions
- How should we resolve conflicts when the same item is edited on two devices?

## Next steps
- Add a write queue that retries when the network returns
- Show a subtle 'offline, changes saved locally' indicator

## Version history
- **v0.1** _(shipped)_ — Read-only pantry list, online only.
- **v0.2** _(active)_ — Local-first storage and offline reads.

## Definition of done
The pantry list loads and is editable with the network fully disabled, and pending edits sync automatically when the connection returns.

## Recommended next assistant
**Coding assistant** — The next steps are implementation-heavy (write queue, sync), so a coding assistant fits.

## How to use this
Continue the project without restarting from zero. Preserve the accepted direction, respect the constraints, and ask before changing a major decision. If you need information that isn't here, say so instead of guessing.
