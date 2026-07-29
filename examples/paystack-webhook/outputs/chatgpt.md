# Project context for ChatGPT

Use this as the background for everything that follows. These are approved facts about my project; do not invent details, and ask before changing a major decision.

## What we are doing
Add replay protection to the Paystack webhook handler so a captured event can't be re-submitted.

## Summary
A payments service that receives Paystack webhooks (charge.success, transfer events) and updates order state. The handler already verifies the HMAC signature, but it does not defend against replayed or duplicated deliveries.

## Current direction
Harden the existing verified handler against replay and duplicate delivery before enabling automatic order fulfilment.

## Decisions so far
- **Reject events whose timestamp is outside a 5-minute window** — Parse the delivery timestamp and reject anything older than 5 minutes (or in the future), after the signature check passes.
  - Why: A leaked-but-valid payload should not be replayable indefinitely; a bounded window limits the blast radius.
  - Tradeoff: Requires reasonably synced clocks; we allow 5 minutes of skew rather than a tighter window to avoid false rejections.
  - Backed by: Paystack signs each event with HMAC SHA512 using your secret key; verify before trusting the body (https://paystack.com/docs/payments/webhooks/)
- **Deduplicate on the event id with a persisted seen-set** — Record each processed event id and treat a repeat id as already-handled (return 200 without re-processing).
  - Why: Signature + timestamp still allow the SAME event to be delivered twice within the window; idempotency must key on the event id.
  - Tradeoff: Adds a small store and a TTL to prune old ids; acceptable for correctness.

## Sources
- [Paystack — Verifying webhooks](https://paystack.com/docs/payments/webhooks/) — _primary_
  - Backs: Paystack signs each event with HMAC SHA512 using your secret key; verify before trusting the body
- [OWASP — Replay attack](https://owasp.org/www-community/attacks/Replay_attack) — _reputable_

## Constraints
- The HMAC signature check must run first and stay unchanged — do not weaken it.
- Always respond within Paystack's timeout; return 200 for already-seen events so they stop retrying.
- Never log the raw signature, secret key, or full request body.

## What to avoid
- Trusting the event body before the signature is verified.
- Keying idempotency on the reference alone — use the delivered event id.

## Open questions
- Which persistent store holds the seen-set — the existing Postgres, or Redis with a TTL?
- What clock-skew window is acceptable to operations?

## Next steps
- Add timestamp-window rejection after the existing signature check.
- Add event-id dedupe backed by a persisted seen-set with a TTL.
- Add tests: valid new event, replayed event, expired timestamp, tampered signature.

## Definition of done
A replayed or duplicated delivery is safely ignored (200, no double-processing), an out-of-window event is rejected, the signature check is unchanged, and tests cover the four cases.
