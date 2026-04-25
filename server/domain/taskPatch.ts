import type { Task, TaskPatch } from "../../src/shared/types";
import { sanitizePatch } from "./sanitize";

export function applyPatch(task: Task, patch: TaskPatch, userId: string): Task {
  return {
    ...task,
    ...sanitizePatch(patch),
    version: task.version + 1,
    updatedAt: new Date().toISOString(),
    updatedBy: userId
  };
}
