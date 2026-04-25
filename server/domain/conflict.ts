import type { ConflictPayload, Task, UpdateTaskPayload } from "../../src/shared/types";
import { sanitizePatch } from "./sanitize";

export function buildConflict(payload: UpdateTaskPayload, serverTask: Task): ConflictPayload {
  return {
    mutationId: payload.mutationId,
    taskId: payload.taskId,
    localPatch: sanitizePatch(payload.patch),
    serverTask,
    baseVersion: payload.baseVersion
  };
}
