/**
 * Codex exporter — an AGENTS.md-style file that OpenAI Codex and other
 * AGENTS.md readers pick up. Transforms the approved pack only; invents nothing.
 */

import type { ContextPack } from "../types.js";
import { section, decisionLines, bulletLines, capitalize } from "../render.js";

export function exportCodex(pack: ContextPack): string {
  const lines: string[] = ["# AGENTS.md"];
  lines.push(...section("Project context", [pack.project_summary]));
  lines.push(...section("Current task", [pack.task ?? "(none set)"]));
  if (pack.work_phase) lines.push(...section("Phase", [capitalize(pack.work_phase)]));
  lines.push(
    ...section("How to work in this repo", [
      ...bulletLines(pack.constraints),
      ...bulletLines(pack.boundaries),
    ])
  );
  lines.push(...section("Source-backed decisions", decisionLines(pack.decisions)));
  lines.push(...section("Tests and validation", [pack.definition_of_done ?? ""]));
  lines.push(...section("Things not to change", bulletLines(pack.what_to_avoid)));
  lines.push(
    "",
    "## When uncertain",
    "Ask for clarification rather than changing unrelated areas."
  );
  return lines.join("\n").trim() + "\n";
}
