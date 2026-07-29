# Project Context Pack

_Focus: Research_

_Task: Recommend Supabase or Firebase as the backend for a small team's MVP, with the reasoning and sources carried along._

> Phase: Research

Use this as background when continuing this project in another AI tool. Treat the items below as facts about the project. Do not invent details; ask before changing a major decision.

## Project summary
A two-person team is choosing a backend-as-a-service for an MVP: auth, a relational-ish data model, file storage, and realtime updates. They want to move fast now without a painful migration later.

## Current direction
Leaning toward a Postgres-based option for SQL and portability, but the realtime and vendor-lock-in trade-offs are not yet settled.

## Key decisions
- **Adopt Supabase for the MVP** — Use Supabase (managed Postgres + auth + storage + realtime) as the backend.
  - Why: The team wants relational modelling and an exit path; Supabase is Postgres, so the data and much of the logic stay portable.
  - Tradeoff: Firebase's realtime + offline story is more mature; we accept that for the portability and SQL benefits.
  - Outcome: Recorded as the approved direction pending the load assumptions in open questions.
  - Backed by: Supabase is built on Postgres, so schemas and SQL are portable to any Postgres host (https://supabase.com/docs/guides/database/overview)
  - Backed by: Firebase's Firestore is a document database with strong client SDKs and offline persistence (https://firebase.google.com/docs/firestore)

## Trusted sources
- [Supabase — Database overview](https://supabase.com/docs/guides/database/overview) — _primary_
  - Backs: Supabase is built on Postgres, so schemas and SQL are portable to any Postgres host
- [Firebase — Cloud Firestore](https://firebase.google.com/docs/firestore) — _primary_
  - Backs: Firestore is a document database with strong client SDKs and offline persistence
- [Supabase — Pricing](https://supabase.com/pricing) — _primary_

## Constraints
- The recommendation must be backed by a cited source, not preference alone.
- Relational modelling and a migration exit path are hard requirements.

## Boundaries
- Compare only Supabase and Firebase; do not introduce a third option unless a requirement can't be met.
- Do not state pricing figures without linking the current pricing page.

## What to avoid
- Presenting vendor marketing claims as verified facts.
- Recommending a NoSQL document model when the team asked for relational.

## Open questions
- What is the expected concurrent-realtime-connection count at launch?
- Is mobile offline persistence a launch requirement or a later nice-to-have?

## Next steps
- Confirm the realtime + offline requirements against the two open questions.
- Prototype auth + one realtime table on Supabase to de-risk the choice.
- Record the final decision with its bound sources once the load assumptions are confirmed.

## Definition of done
A cited recommendation that names the winner, states the key trade-off accepted, links every factual claim to a source, and lists what remains uncertain.

## Recommended next assistant
**Research assistant** — This is a source-backed comparison and decision, not an implementation task.

## How to use this
Continue the project without restarting from zero. Preserve the accepted direction, respect the constraints, and ask before changing a major decision. If you need information that isn't here, say so instead of guessing.
