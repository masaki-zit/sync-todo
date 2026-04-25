import { AlertTriangle, RefreshCw } from "lucide-react";
import { formatTime } from "../../models/time";
import type { PendingMutation, Task } from "../../shared/types";
import { SyncBadge } from "../atoms/SyncBadge";

interface TaskMetaProps {
  task: Task;
  pendingMutation?: PendingMutation;
  hasConflict: boolean;
}

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
