# Example — Cross-AI handoff (ChatGPT → Claude Code → Codex)

The flagship for the core problem Shelvia exists to solve: **one reviewed task
moving cleanly between tools.** A rate limiter is planned by one tool, the plan
is reviewed and approved by a human, and this pack hands the *reviewed* plan to
the next tool to implement — then to a third to review.

The `boundaries` section spells out the handoff explicitly:

- what the planning tool produced,
- what the human reviewed and approved,
- what this pack carries forward,
- what the next tool receives (this pack — **not** the raw planning chat),
- what it must return (the diff + tests, for the review tool).

> Scope note: this v1 pack demonstrates the handoff as **portable, reviewed
> context**. It does not simulate automatic capture-back, Continuity Runs, or
> agent orchestration — those live in the broader Shelvia platform, not in this
> open format.

- Input: [`context-pack.json`](./context-pack.json)
- Generated outputs:
  - Neutral: [`outputs/neutral.md`](./outputs/neutral.md)
  - ChatGPT: [`outputs/chatgpt.md`](./outputs/chatgpt.md)
  - Claude: [`outputs/claude.md`](./outputs/claude.md)
  - Cursor: [`outputs/cursor.mdc`](./outputs/cursor.mdc)
  - Codex: [`outputs/AGENTS.md`](./outputs/AGENTS.md)

```bash
shelvia-context-pack export examples/cross-ai-handoff/context-pack.json --target codex
```
