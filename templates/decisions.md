<!--
  Template: Key Decisions
  Renders: decisions[] (title, body, rationale, tradeoffs, outcome, evidence)
  Repeat the block below once per decision. Omit any sub-line whose value is
  empty. If there are no decisions, render the "none recorded yet" marker.
-->

## Key Decisions

<!-- when decisions is empty: -->
_(none recorded yet)_

<!-- for each decision: -->
- **{{title}}** — {{body}}
  - Why: {{rationale}}
  - Tradeoff: {{tradeoffs}}
  - Outcome: {{outcome}}
  <!-- for each evidence entry (optional): -->
  - Backed by: {{claim}} _({{source}})_
