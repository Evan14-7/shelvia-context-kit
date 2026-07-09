/**
 * Claude exporter — a CLAUDE.md-style project context file that Claude and
 * Claude Code read. Transforms the approved pack only; invents nothing.
 */

import type { ContextPack } from "../types.js";
import { section, decisionLines, sourceLines, bulletLines, capitalize } from "../render.js";

export function exportClaude(pack: ContextPack): string {
  const lines: string[] = ["# Project context", "", "Generated from a reviewed Context Pack."];
  lines.push(...section("Current objective", [pack.task ?? "(none set)"]));
  if (pack.work_phase) lines.push(...section("Phase", [capitalize(pack.work_phase)]));
  lines.push(...section("Project summary", [pack.project_summary]));
  lines.push(...section("Project rules", bulletLines(pack.constraints)));
  lines.push(...section("Boundaries", bulletLines(pack.boundaries)));
  lines.push(...section("Approved decisions", decisionLines(pack.decisions)));
  lines.push(...section("Relevant sources", sourceLines(pack.sources)));
  lines.push(...section("Files or areas to avoid", bulletLines(pack.what_to_avoid)));
  lines.push(...section("Open questions", bulletLines(pack.open_questions)));
  lines.push(...section("Definition of done", [pack.definition_of_done ?? ""]));
  lines.push(
    "",
    "## When uncertain",
    "Ask for clarification rather than changing unrelated areas. Preserve the accepted direction."
  );
  return lines.join("\n").trim() + "\n";
}
