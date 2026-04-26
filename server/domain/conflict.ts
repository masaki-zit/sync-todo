/** 競合通知用ペイロードの組み立てを担当するファイル。 */
import type { ConflictPayload, Task, UpdateTaskPayload } from "../../src/shared/types";
import { sanitizePatch } from "./sanitize";

/**
 * 更新要求と最新サーバータスクから競合通知ペイロードを生成する。
 * @param payload クライアントの更新要求
 * @param serverTask 最新のサーバータスク
 * @returns 競合通知ペイロード
 */
export function buildConflict(payload: UpdateTaskPayload, serverTask: Task): ConflictPayload {
  return {
    mutationId: payload.mutationId,
    taskId: payload.taskId,
    localPatch: sanitizePatch(payload.patch),
    serverTask,
    baseVersion: payload.baseVersion
  };
}
