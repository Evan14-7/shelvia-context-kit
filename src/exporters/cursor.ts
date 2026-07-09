/**
 * Cursor exporter — a Cursor rule (.mdc) with the documented minimal
 * frontmatter (description + alwaysApply) and a Markdown body. Transforms the
 * approved pack only; invents nothing.
 */

import type { ContextPack } from "../types.js";
import { section, decisionLines, bulletLines, capitalize } from "../render.js";

export function exportCursor(pack: ContextPack): string {
  const body: string[] = ["# Project context"];
  body.push(...section("Current task", [pack.task ?? "(none set)"]));
  if (pack.work_phase) body.push(...section("Phase", [capitalize(pack.work_phase)]));
  body.push(...section("Rules", bulletLines(pack.constraints)));
  body.push(...section("Boundaries", bulletLines(pack.boundaries)));
  body.push(...section("Decisions", decisionLines(pack.decisions)));
  body.push(...section("Avoid", bulletLines(pack.what_to_avoid)));
  body.push(...section("Definition of done", [pack.definition_of_done ?? ""]));

  const frontmatter = ["---", "description: Reviewed project context", "alwaysApply: false", "---"];
  return [...frontmatter, "", ...body].join("\n").trim() + "\n";
}
