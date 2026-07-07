<!--
  Template: Full Handoff
  Renders: an entire Context Pack, top to bottom, in canonical order.
  This is the assembled document a renderer emits. Each section follows the
  same rules as its per-section template. Omit empty sections (the four marked
  "none ... yet" keep an explicit marker so the reader knows they exist).
  Placeholders use {{double_braces}}; comment lines are removed in real output.
-->

# Project Context Pack — {{project_name}}

_Focus: {{category}}_
_Task: {{task}}_
> Phase: {{work_phase}}

Use this as background when continuing this project in another AI tool. Treat the
items below as facts about my project. Do not invent details — ask before
changing a major decision.

## Project Summary

{{project_summary}}

## Current Direction

{{current_direction}}

## Key Decisions

<!-- none recorded yet -> _(none recorded yet)_ -->
- **{{decision.title}}** — {{decision.body}}
  - Why: {{decision.rationale}}
  - Tradeoff: {{decision.tradeoffs}}
  - Outcome: {{decision.outcome}}
  - Backed by: {{evidence.claim}} _({{evidence.source}})_

## Trusted Sources

<!-- none captured yet -> _(none captured yet)_ -->
- [{{source.label}}]({{source.url}}) — _{{source.trust_grade}}_
  - Backs: {{source.bound_claim}}

## Best Prompts

<!-- none saved yet -> _(none saved yet)_ -->
- _({{prompt.tool}})_ {{prompt.text}}

## Constraints

<!-- none recorded -> _(none recorded)_ -->
- {{constraint}}

## Boundaries

- {{boundary}}

## Version History

- **{{version.label}}** _({{version.status}})_ — {{version.summary}}

## Open Questions

- {{open_question}}

## Next Steps

- {{next_step}}

## What To Avoid

- {{what_to_avoid_item}}

## Definition of done

{{definition_of_done}}

## Recommended Next Assistant

**{{recommended_assistant.type_label}}** — {{recommended_assistant.reason}}

## How to use this

Use this Pack to continue the project without restarting from zero. Preserve the
accepted direction. Respect the constraints. Ask before changing major
decisions. If you need information that isn't here, say so explicitly instead of
guessing.
