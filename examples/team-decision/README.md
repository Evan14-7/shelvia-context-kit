# Example — Team decision (with a superseded decision)

A **team-memory** Context Pack showing the *lifecycle* of a decision, not just a
task: an approved choice (trunk-based development) with rationale, trade-offs,
evidence, and an explicit approval — plus the prior approach it **retired**
(GitFlow, in `version_history` with status `superseded`) and a `what_to_avoid`
entry so no tool re-introduces it.

The point: a team's *why* and *what-we-already-ruled-out* travel with the
decision, so a new teammate or AI tool doesn't reopen a settled call.

- Input: [`context-pack.json`](./context-pack.json)
- Generated outputs: [`outputs/neutral.md`](./outputs/neutral.md) ·
  [`chatgpt.md`](./outputs/chatgpt.md) · [`claude.md`](./outputs/claude.md) ·
  [`cursor.mdc`](./outputs/cursor.mdc) · [`AGENTS.md`](./outputs/AGENTS.md)

```bash
shelvia-context-pack export examples/team-decision/context-pack.json --target claude
```
