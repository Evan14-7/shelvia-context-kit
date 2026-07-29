# Example — AI research-grant application (writing, no invented facts)

A **writing** Context Pack for a non-coding, accountability-critical task:
drafting a grant application where the governing rule is **never invent applicant
facts** — any unknown field stays an explicit `[NEEDS APPLICANT INPUT]` blank.

It shows the format enforcing discipline the model must respect: hard constraints
(use only verified facts; honour per-section word limits), what to avoid
(fabricated metrics or affiliations), and the exact fields the applicants must
still supply (`open_questions`).

- Input: [`context-pack.json`](./context-pack.json)
- Generated outputs:
  - Neutral: [`outputs/neutral.md`](./outputs/neutral.md)
  - ChatGPT: [`outputs/chatgpt.md`](./outputs/chatgpt.md)
  - Claude: [`outputs/claude.md`](./outputs/claude.md)
  - Cursor: [`outputs/cursor.mdc`](./outputs/cursor.mdc)
  - Codex: [`outputs/AGENTS.md`](./outputs/AGENTS.md)

```bash
shelvia-context-pack render examples/grant-application/context-pack.json
```
