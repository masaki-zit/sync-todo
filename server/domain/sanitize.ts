import type { TaskPatch } from "../../src/shared/types";

export function cleanName(value: string) {
  const name = value.trim();
  return name.length > 0 ? name.slice(0, 32) : "Guest";
}

export function cleanTitle(value: string) {
  const title = value.trim();
  return title.length > 0 ? title.slice(0, 140) : "Untitled task";
}

export function sanitizePatch(patch: TaskPatch): TaskPatch {
  const sanitized: TaskPatch = {};

  if (typeof patch.title === "string") {
    sanitized.title = cleanTitle(patch.title);
  }

  if (typeof patch.completed === "boolean") {
    sanitized.completed = patch.completed;
  }

  return sanitized;
}
