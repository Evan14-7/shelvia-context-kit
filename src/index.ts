/**
 * shelvia-context-pack — the public API for the Context Pack format toolkit.
 *
 * Validate, render, and export a Context Pack. No network, no secrets, no
 * hosted-product logic — a pure toolkit over the open format.
 */

export type {
  ContextPack,
  ContextPackCategory,
  WorkPhase,
  TrustGrade,
  AssistantType,
  Decision,
  Source,
  Prompt,
  Evidence,
  VersionEntry,
  RecommendedAssistant,
  ExportTarget,
} from "./types.js";

export {
  validateContextPack,
  assertContextPack,
  type ValidationResult,
  type ValidationError,
} from "./validate.js";

export { renderMarkdown } from "./render.js";

export { exportChatGPT } from "./exporters/chatgpt.js";
export { exportClaude } from "./exporters/claude.js";
export { exportCursor } from "./exporters/cursor.js";
export { exportCodex } from "./exporters/codex.js";

import type { ContextPack, ExportTarget } from "./types.js";
import { exportChatGPT } from "./exporters/chatgpt.js";
import { exportClaude } from "./exporters/claude.js";
import { exportCursor } from "./exporters/cursor.js";
import { exportCodex } from "./exporters/codex.js";

/** All supported export targets. */
export const EXPORT_TARGETS: ExportTarget[] = ["chatgpt", "claude", "cursor", "codex"];

/** Export a pack for a named target. Throws on an unknown target. */
export function exportPack(pack: ContextPack, target: ExportTarget): string {
  switch (target) {
    case "chatgpt":
      return exportChatGPT(pack);
    case "claude":
      return exportClaude(pack);
    case "cursor":
      return exportCursor(pack);
    case "codex":
      return exportCodex(pack);
    default: {
      const bad: never = target;
      throw new Error(`Unknown export target: ${String(bad)}`);
    }
  }
}
