# Example — Product launch (founder / positioning)

A **founder** Context Pack for a non-coding task: preparing launch positioning
under a hard truthfulness constraint. It shows the format carrying a positioning
decision (lead with one promise, not a feature list) with its rationale and
evidence, plus constraints (every claim true today; don't overstate hosted vs.
open-source) and the open questions still blocking launch.

The point: the *rules of the launch* — what's true, what's off-limits, what's
undecided — travel with the task, so any tool drafting copy stays honest.

- Input: [`context-pack.json`](./context-pack.json)
- Generated outputs: [`outputs/neutral.md`](./outputs/neutral.md) ·
  [`chatgpt.md`](./outputs/chatgpt.md) · [`claude.md`](./outputs/claude.md) ·
  [`cursor.mdc`](./outputs/cursor.mdc) · [`AGENTS.md`](./outputs/AGENTS.md)

```bash
shelvia-context-pack export examples/product-launch/context-pack.json --target chatgpt
```
