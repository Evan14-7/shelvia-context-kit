# The Context Pack format

A Context Pack is one JSON document that follows
[`../schema/context-pack.schema.json`](../schema/context-pack.schema.json). This
page explains each field and the rules a renderer follows.

## Design principles

- **One schema, many renderers.** The JSON is the source of truth. Markdown,
  `CLAUDE.md`, `AGENTS.md`, and Cursor rules are all *renderings* of the same
  data. If a tool needs a new field, that is a schema proposal, not a template
  hack.
- **Reviewed content only.** A pack carries human-approved facts, not raw chat
  logs. Reasoning ("why") travels with each decision.
- **Say what "done" means up front.** `definition_of_done` is set before the
  work so the result is checkable afterward.
- **Grade sources, do not score them.** Sources carry a plain trust grade, never
  a percentage.
- **Recommend a kind of assistant, never a vendor.**

## Top-level fields

| Field | Type | Required | Meaning |
|---|---|---|---|
| `spec_version` | string | yes | Format version, e.g. `"0.1"`. |
| `generated_at` | string (date-time) | no | When the pack was made (ISO 8601). |
| `category` | enum | no | `general` / `coding` / `research` / `writing` / `design`. |
| `task` | string | no | What the next tool should do. Strongly recommended. |
| `work_phase` | enum | no | `research` / `plan` / `implement`. Framing only. |
| `project_summary` | string | yes | Short plain-language description. |
| `current_direction` | string \| null | no | Where the project is heading now. |
| `decisions` | Decision[] | no | Approved decisions with reasoning. |
| `sources` | Source[] | no | Trusted sources. |
| `prompts` | Prompt[] | no | Reusable prompts that worked. |
| `constraints` | string[] | no | Hard rules to respect. |
| `boundaries` | string[] | no | Stated guardrails for this handoff. |
| `what_to_avoid` | string[] | no | Approaches already ruled out. |
| `open_questions` | string[] | no | Unresolved questions. |
| `next_steps` | string[] | no | Recommended next actions. |
| `version_history` | VersionEntry[] | no | Notable prior milestones. |
| `definition_of_done` | string \| null | no | How success is judged. |
| `recommended_assistant` | object | no | `{ type, reason }` — a kind, not a brand. |

## Nested shapes

**Decision** — `title` (required), optional `body`, `rationale`, `tradeoffs`,
`outcome`, and `evidence` (a list of `{ claim, source? }`).

**Source** — `label` and `url` (required), optional `trust_grade`
(`primary` / `reputable` / `community` / `unverified`) and `bound_claim` (the
claim this source was evidence for).

**Prompt** — `text` (required), optional `tool`.

**VersionEntry** — `label` and `status` (required), optional `summary`.

All nested objects set `additionalProperties: false`. Unknown fields are
rejected in `0.1`; a new field requires a spec bump.

## Rendering rules

1. Sections with no content are omitted (the full handoff keeps a small number
   of explicit "none yet" markers so the reader knows the section exists).
2. Decisions render their `rationale`, then `tradeoffs` and `outcome` when
   present, then any `evidence`.
3. Sources render as a link with their `trust_grade` and, if present, the claim
   they back.
4. The document ends with a short "how to use this" instruction telling the
   receiving AI to preserve the direction, respect constraints, and ask before
   changing a major decision instead of inventing details.

## Validating a pack

```bash
npx ajv-cli validate \
  -s schema/context-pack.schema.json \
  -d examples/basic/context-pack.json
```

## Versioning

The format follows its own `spec_version`. `0.x` may change shape between
releases; a pack always declares the version it targets so a validator can pick
the right rules.
