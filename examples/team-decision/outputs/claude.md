# Project context

Generated from a reviewed Context Pack.

## Current objective
Brief the team on the approved branching-strategy decision, why it was chosen, and what it replaced.

## Phase
Plan

## Project summary
A six-person engineering team is standardising how it ships. After two weeks of friction with long-lived branches, it has agreed on a new workflow and needs everyone (and any AI tool helping) to follow the same rules.

## Project rules
- main must always be releasable (green CI).
- No branch may live longer than two days.

## Boundaries
- This pack states the decision + rationale; it does not migrate any repository.

## Approved decisions
- **Adopt trunk-based development with short-lived branches** — Everyone integrates to main daily behind feature flags; branches live at most 2 days.
  - Why: Long-lived develop/release branches caused painful merges and slow, batched releases.
  - Tradeoff: Requires disciplined feature flagging and a green main at all times; accepted for faster, safer releases.
  - Outcome: Approved by the team lead after a two-week trial across two squads.
  - Backed by: Small, frequent merges reduce integration risk and speed up delivery (https://trunkbaseddevelopment.com/)
- **Gate unfinished work behind feature flags, not branches** — Incomplete features ship dark behind a flag rather than living on a branch.
  - Why: Keeps main releasable while work is in progress.
  - Outcome: Approved alongside the trunk-based decision.

## Relevant sources
- [Trunk Based Development](https://trunkbaseddevelopment.com/) — _reputable_
  - Backs: Small, frequent merges reduce integration risk and speed up delivery

## Files or areas to avoid
- Re-introducing long-lived develop/release branches — that is the GitFlow approach the team retired.
- Merging red builds to main.

## Open questions
- What is the feature-flag cleanup policy so flags don't accumulate?

## Definition of done
Every engineer (and any AI tool briefed with this pack) integrates to a releasable main daily behind feature flags, with no branch older than two days.

## When uncertain
Ask for clarification rather than changing unrelated areas. Preserve the accepted direction.
