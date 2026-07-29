# Project Context Pack

_Task: Continue implementing the rate-limiter: ChatGPT planned it, this pack hands the reviewed plan to Claude Code to build, and Codex will review the result._

> Phase: Implement

Use this as background when continuing this project in another AI tool. Treat the items below as facts about the project. Do not invent details; ask before changing a major decision.

## Project summary
An API needs a per-API-key rate limiter (100 requests/minute, sliding window). One tool planned the approach, a human reviewed it, and the reviewed plan is now being handed to the next tool to implement — then to a third for review.

## Current direction
The plan is approved. Claude Code implements against these constraints; Codex then reviews the diff against the same definition of done.

## Key decisions
- **Sliding-window counter in Redis, keyed by API key** — Use a Redis sorted set per key with request timestamps; count entries in the trailing 60s window.
  - Why: Chosen during planning as the balance of accuracy and cost; a human approved it before this handoff.
  - Tradeoff: Slightly more memory than a fixed-window counter, but avoids the burst-at-the-boundary problem.
  - Outcome: Approved in review — this is the plan Claude Code should implement, not reopen.

## Trusted sources
- [MDN — HTTP 429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429) — _primary_
  - Backs: A rate-limited response should use 429 and a Retry-After header

## Best prompts
- _(implementation assistant)_ Implement the approved sliding-window rate limiter exactly as specified in the decisions and constraints. Do not redesign the approach. Return the diff plus the tests you added.

## Constraints
- Implement the approved sliding-window design — do not switch to a different algorithm.
- Return HTTP 429 with a Retry-After header when the limit is exceeded.
- The limiter must fail open (allow the request) if Redis is unreachable, and log that it did.

## Boundaries
- Handoff record — what each tool did, reviewed, and passes on:
- Planning tool produced: the sliding-window design + the 100/min figure.
- Human reviewed and approved: the algorithm and the fail-open rule.
- This pack carries forward: the approved decision, constraints, and definition of done.
- The next tool (implementation) receives: this pack only — not the raw planning chat.
- The next tool must return: the diff + tests, for the review tool to check.

## What to avoid
- Re-litigating the algorithm choice that was already reviewed and approved.
- Silently failing closed (blocking all traffic) when Redis is down.

## Open questions
- Should the limit be configurable per key tier, or a single global 100/min for v1?

## Next steps
- Implementation tool: build the limiter + middleware and add tests for under-limit, at-limit, over-limit, and Redis-down.
- Review tool: check the diff against the decision, constraints, and definition of done; flag any deviation.
- Human: approve the reviewed result before it merges.

## Definition of done
The middleware enforces 100 req/min per key with a sliding window, returns 429 + Retry-After over the limit, fails open with a log when Redis is down, and has tests for all four cases — matching the approved plan without redesigning it.

## Recommended next assistant
**Coding assistant** — The plan is approved and reviewed; the next step is a bounded implementation for a coding tool, then a review pass.

## How to use this
Continue the project without restarting from zero. Preserve the accepted direction, respect the constraints, and ask before changing a major decision. If you need information that isn't here, say so instead of guessing.
