<!--
  Template: Project Summary
  Renders: project_summary, current_direction, category, task, work_phase
  Lines in HTML comments are guidance and are removed in real output.
  Placeholders use {{double_braces}}. Drop any line whose value is empty.
-->

# Project Context Pack — {{project_name}}

<!-- Only render the focus line when category is not "general". -->
_Focus: {{category}}_

<!-- Only render when a task is set. This tells the next tool what to do. -->
_Task: {{task}}_

<!-- Only render when a work_phase is set. Framing only. -->
> Phase: {{work_phase}}

Use this as background when continuing this project in another AI tool. Treat the
items below as facts about my project. Do not invent details — ask before
changing a major decision.

## Project Summary

{{project_summary}}

## Current Direction

<!-- Omit this whole section when current_direction is empty. -->
{{current_direction}}
