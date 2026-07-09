/**
 * Context Pack validation, backed by the JSON Schema
 * (schema/context-pack.schema.json). Returns clear, human-readable errors
 * rather than a bare boolean.
 */

import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import type { ErrorObject } from "ajv";
import type { ContextPack } from "./types.js";

// ajv and ajv-formats are CommonJS. Loading them via createRequire avoids the
// ESM/NodeNext default-interop friction and works identically at runtime.
const require = createRequire(import.meta.url);
const Ajv = require("ajv");
const addFormats = require("ajv-formats");

/** Resolve the schema relative to the compiled file, so it works from dist/. */
const SCHEMA_URL = new URL("../schema/context-pack.schema.json", import.meta.url);
const schema = JSON.parse(readFileSync(SCHEMA_URL, "utf8")) as Record<string, unknown>;

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validateFn = ajv.compile(schema);

export interface ValidationError {
  /** JSON path to the offending value, e.g. "/decisions/0/title". */
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

function formatError(err: ErrorObject): ValidationError {
  const path = err.instancePath || "/";
  // Ajv's "additionalProperties" carries the offending key in params.
  const extra =
    err.keyword === "additionalProperties" && err.params?.additionalProperty
      ? ` (unknown property "${err.params.additionalProperty}")`
      : "";
  return { path, message: `${err.message ?? "is invalid"}${extra}` };
}

/**
 * Validate an unknown value against the Context Pack schema.
 * On success, `valid` is true and the value can be treated as a ContextPack.
 */
export function validateContextPack(input: unknown): ValidationResult {
  const ok = validateFn(input);
  if (ok) return { valid: true, errors: [] };
  const errors = (validateFn.errors ?? []).map(formatError);
  return { valid: false, errors };
}

/** Narrowing helper: validate and cast, or throw with a readable message. */
export function assertContextPack(input: unknown): ContextPack {
  const { valid, errors } = validateContextPack(input);
  if (!valid) {
    const lines = errors.map((e) => `  ${e.path} ${e.message}`).join("\n");
    throw new Error(`Invalid Context Pack:\n${lines}`);
  }
  return input as ContextPack;
}
