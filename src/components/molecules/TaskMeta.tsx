/** タスクの版数・更新時刻・同期状態を表示する補助情報用ファイル。 */
import { AlertTriangle, RefreshCw } from "lucide-react";
import { formatTime } from "../../models/time";
import type { PendingMutation, Task } from "../../shared/types";
import { SyncBadge } from "../atoms/SyncBadge";

/** `TaskMeta` に渡す補助表示用データ。 */
interface TaskMetaProps {
  task: Task;
  pendingMutation?: PendingMutation;
  hasConflict: boolean;
}

/**
 * タスクのメタ情報と同期状態バッジを表示する。
 * @param props 対象タスクと同期状態
 * @returns タスクの補助情報表示
 */
export function TaskMeta({ task, pendingMutation, hasConflict }: TaskMetaProps) {
  return (
    <div className="task-meta">
      <span>v{task.version}</span>
      <span>{formatTime(task.updatedAt)}</span>
      {pendingMutation ? (
        <SyncBadge icon={<RefreshCw size={13} />} tone="pending">
          同期中
        </SyncBadge>
      ) : (
        <SyncBadge>同期済み</SyncBadge>
      )}
      {hasConflict ? (
        <SyncBadge icon={<AlertTriangle size={13} />} tone="conflict">
          競合
        </SyncBadge>
      ) : null}
    </div>
  );
}
