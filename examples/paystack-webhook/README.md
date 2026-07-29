# Example — Paystack webhook replay protection

A realistic **coding** Context Pack: hardening an already-signature-verified
Paystack webhook handler against **replayed / duplicated deliveries**.

It shows the format carrying real engineering judgement, not just a task line:
approved decisions with rationale + trade-offs, a primary source bound to the
claim it backs (Paystack's webhook docs), hard constraints (the signature check
stays first; never log secrets), what to avoid, open questions, and a concrete
definition of done.

- Input: [`context-pack.json`](./context-pack.json)
- Generated outputs (one per tool, produced by the toolkit — never hand-edited):
  - Neutral: [`outputs/neutral.md`](./outputs/neutral.md)
  - ChatGPT: [`outputs/chatgpt.md`](./outputs/chatgpt.md)
  - Claude: [`outputs/claude.md`](./outputs/claude.md)
  - Cursor: [`outputs/cursor.mdc`](./outputs/cursor.mdc)
  - Codex: [`outputs/AGENTS.md`](./outputs/AGENTS.md)

Regenerate the outputs with `npm run golden:update` (they double as golden
snapshots, so a formatting regression can't land silently).

```bash
shelvia-context-pack export examples/paystack-webhook/context-pack.json --target claude
```
