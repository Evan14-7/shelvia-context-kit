# Project context for ChatGPT

Use this as the background for everything that follows. These are approved facts about my project; do not invent details, and ask before changing a major decision.

## What we are doing
Brief the team on the approved branching-strategy decision, why it was chosen, and what it replaced.

## Summary
A six-person engineering team is standardising how it ships. After two weeks of friction with long-lived branches, it has agreed on a new workflow and needs everyone (and any AI tool helping) to follow the same rules.

## Current direction
Move to trunk-based development with short-lived branches and feature flags; the previous GitFlow approach is retired.

## Decisions so far
- **Adopt trunk-based development with short-lived branches** — Everyone integrates to main daily behind feature flags; branches live at most 2 days.
  - Why: Long-lived develop/release branches caused painful merges and slow, batched releases.
  - Tradeoff: Requires disciplined feature flagging and a green main at all times; accepted for faster, safer releases.
  - Outcome: Approved by the team lead after a two-week trial across two squads.
  - Backed by: Small, frequent merges reduce integration risk and speed up delivery (https://trunkbaseddevelopment.com/)
- **Gate unfinished work behind feature flags, not branches** — Incomplete features ship dark behind a flag rather than living on a branch.
  - Why: Keeps main releasable while work is in progress.
  - Outcome: Approved alongside the trunk-based decision.

## Sources
- [Trunk Based Development](https://trunkbaseddevelopment.com/) — _reputable_
  - Backs: Small, frequent merges reduce integration risk and speed up delivery

## Constraints
- main must always be releasable (green CI).
- No branch may live longer than two days.

## What to avoid
- Re-introducing long-lived develop/release branches — that is the GitFlow approach the team retired.
- Merging red builds to main.

## Open questions
- What is the feature-flag cleanup policy so flags don't accumulate?

## Next steps
- Document the branching rules in the repo's CONTRIBUTING guide.
- Add a flag-cleanup checklist to the definition of done for flagged work.

## Definition of done
Every engineer (and any AI tool briefed with this pack) integrates to a releasable main daily behind feature flags, with no branch older than two days.
