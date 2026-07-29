# Project context

Generated from a reviewed Context Pack.

## Current objective
Recommend Supabase or Firebase as the backend for a small team's MVP, with the reasoning and sources carried along.

## Phase
Research

## Project summary
A two-person team is choosing a backend-as-a-service for an MVP: auth, a relational-ish data model, file storage, and realtime updates. They want to move fast now without a painful migration later.

## Project rules
- The recommendation must be backed by a cited source, not preference alone.
- Relational modelling and a migration exit path are hard requirements.

## Boundaries
- Compare only Supabase and Firebase; do not introduce a third option unless a requirement can't be met.
- Do not state pricing figures without linking the current pricing page.

## Approved decisions
- **Adopt Supabase for the MVP** — Use Supabase (managed Postgres + auth + storage + realtime) as the backend.
  - Why: The team wants relational modelling and an exit path; Supabase is Postgres, so the data and much of the logic stay portable.
  - Tradeoff: Firebase's realtime + offline story is more mature; we accept that for the portability and SQL benefits.
  - Outcome: Recorded as the approved direction pending the load assumptions in open questions.
  - Backed by: Supabase is built on Postgres, so schemas and SQL are portable to any Postgres host (https://supabase.com/docs/guides/database/overview)
  - Backed by: Firebase's Firestore is a document database with strong client SDKs and offline persistence (https://firebase.google.com/docs/firestore)

## Relevant sources
- [Supabase — Database overview](https://supabase.com/docs/guides/database/overview) — _primary_
  - Backs: Supabase is built on Postgres, so schemas and SQL are portable to any Postgres host
- [Firebase — Cloud Firestore](https://firebase.google.com/docs/firestore) — _primary_
  - Backs: Firestore is a document database with strong client SDKs and offline persistence
- [Supabase — Pricing](https://supabase.com/pricing) — _primary_

## Files or areas to avoid
- Presenting vendor marketing claims as verified facts.
- Recommending a NoSQL document model when the team asked for relational.

## Open questions
- What is the expected concurrent-realtime-connection count at launch?
- Is mobile offline persistence a launch requirement or a later nice-to-have?

## Definition of done
A cited recommendation that names the winner, states the key trade-off accepted, links every factual claim to a source, and lists what remains uncertain.

## When uncertain
Ask for clarification rather than changing unrelated areas. Preserve the accepted direction.
