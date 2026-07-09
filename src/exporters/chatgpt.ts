/**
 * ChatGPT exporter — a paste-ready project brief for a ChatGPT thread or a
 * Project's custom instructions. Transforms the approved pack only; invents
 * nothing.
 */

import type { ContextPack } from "../types.js";
import { section, decisionLines, sourceLines, bulletLines } from "../render.js";

export function exportChatGPT(pack: ContextPack): string {
  const lines: string[] = ["# Project context for ChatGPT"];
  lines.push(
    "",
    "Use this as the background for everything that follows. These are approved facts about my project; do not invent details, and ask before changing a major decision."
  );
  lines.push(...section("What we are doing", [pack.task ?? pack.project_summary]));
  lines.push(...section("Summary", [pack.project_summary]));
  lines.push(...section("Current direction", [pack.current_direction ?? ""]));
  lines.push(...section("Decisions so far", decisionLines(pack.decisions)));
  lines.push(...section("Sources", sourceLines(pack.sources)));
  lines.push(...section("Constraints", bulletLines(pack.constraints)));
  lines.push(...section("What to avoid", bulletLines(pack.what_to_avoid)));
  lines.push(...section("Open questions", bulletLines(pack.open_questions)));
  lines.push(...section("Next steps", bulletLines(pack.next_steps)));
  lines.push(...section("Definition of done", [pack.definition_of_done ?? ""]));
  return lines.join("\n").trim() + "\n";
}
