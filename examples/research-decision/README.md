# Example — Supabase vs Firebase (research decision)

A **research** Context Pack — proof the format is not just for coding. A small
team compares two backends and records a **cited** recommendation: the approved
decision, the trade-off it accepts, primary sources bound to their claims, and
the assumptions still unresolved (`open_questions`).

The point: a decision carries its *evidence and uncertainty* with it, so the next
tool doesn't re-argue a settled choice or treat vendor marketing as fact.

- Input: [`context-pack.json`](./context-pack.json)
- Generated outputs:
  - Neutral: [`outputs/neutral.md`](./outputs/neutral.md)
  - ChatGPT: [`outputs/chatgpt.md`](./outputs/chatgpt.md)
  - Claude: [`outputs/claude.md`](./outputs/claude.md)
  - Cursor: [`outputs/cursor.mdc`](./outputs/cursor.mdc)
  - Codex: [`outputs/AGENTS.md`](./outputs/AGENTS.md)

```bash
shelvia-context-pack export examples/research-decision/context-pack.json --target chatgpt
```
