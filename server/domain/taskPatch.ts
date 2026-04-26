/** タスク差分の適用と更新メタデータ付与を共通化するファイル。 */
import type { Task, TaskPatch } from "../../src/shared/types";
import { sanitizePatch } from "./sanitize";

/**
 * タスクへ差分を適用し、版数や更新者などのメタデータも更新する。
 * @param task 更新前のタスク
 * @param patch 反映する差分
 * @param userId 更新者 ID
 * @returns 更新後のタスク
 */
export function applyPatch(task: Task, patch: TaskPatch, userId: string): Task {
  return {
    ...task,
    ...sanitizePatch(patch),
    version: task.version + 1,
    updatedAt: new Date().toISOString(),
    updatedBy: userId
  };
}
