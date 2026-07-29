# Project context for ChatGPT

Use this as the background for everything that follows. These are approved facts about my project; do not invent details, and ask before changing a major decision.

## What we are doing
Add per-tenant rate limiting to the public API without breaking existing clients.

## Summary
Relay is a small HTTP API gateway that forwards requests to internal services. It is used by a handful of paying customers and needs fair-use limits before onboarding more.

## Current direction
Introduce rate limiting that is safe to roll out gradually and observable before it is enforced.

## Decisions so far
- **Use a token-bucket limiter keyed by tenant** — Each tenant gets a refillable bucket; requests over the limit get a 429 with a Retry-After header.
  - Why: Token buckets absorb short bursts while still capping sustained load, which fits real client traffic.
  - Tradeoff: Needs shared state across gateway instances, so it depends on the Redis decision below.
  - Backed by: 429 with Retry-After is the standard signal for rate limiting (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429)
- **Store counters in Redis, not in process memory** — Counters live in Redis so all gateway instances share one view of a tenant's usage.
  - Why: In-process counters would let a client exceed the limit by spreading requests across instances.
- **Ship in shadow mode first** — Log what would have been limited for two weeks before returning any 429s.
  - Why: Rolling out enforcement blind risks cutting off a paying customer on a wrong threshold.

## Sources
- [MDN — 429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429) — _primary_
  - Backs: 429 with Retry-After is the standard signal for rate limiting
- [Redis — INCR-based rate limiting pattern](https://redis.io/docs/latest/develop/use/patterns/) — _reputable_

## Constraints
- Existing clients must not see behavior change until enforcement is turned on
- Every limited request must be observable in metrics before it is enforced

## What to avoid
- In-process counters — they undercount across instances
- A fixed-window counter — it allows double-rate bursts at the window edge

## Open questions
- What is a fair default limit per tenant before customers ask for more?
- Should internal service-to-service calls be exempt from limits?

## Next steps
- Add a shadow-mode limiter that logs would-be 429s with the tenant and threshold
- Add a per-tenant metrics dashboard for request and limit counts

## Definition of done
Shadow mode is live and reporting would-be limits per tenant in metrics, with zero change to client-visible responses.
