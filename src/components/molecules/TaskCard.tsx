import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import type { ClientUser, PendingMutation, Task } from "../../shared/types";
import { IconButton } from "../atoms/IconButton";
import { EditorsRow } from "./EditorsRow";
import { TaskMeta } from "./TaskMeta";

interface TaskCardProps {
  connected: boolean;
  draftTitle?: string;
  editors: ClientUser[];
  hasConflict: boolean;
  pendingMutation?: PendingMutation;
  task: Task;
  onCancelTitle: (task: Task) => void;
  onChangeDraft: (taskId: string, title: string) => void;
  onCommitTitle: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStartTitleEdit: (task: Task) => void;
  onToggle: (task: Task) => void;
}

export function TaskCard(props: TaskCardProps) {
  const { connected, draftTitle, editors, hasConflict, pendingMutation, task } = props;
  const title = draftTitle ?? task.title;

  return (
    <article className={`task-card ${task.completed ? "is-complete" : ""} ${hasConflict ? "has-conflict" : ""}`}>
      <IconButton
        aria-label={task.completed ? "未完了に戻す" : "完了にする"}
        disabled={!connected}
        icon={task.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
        onClick={() => props.onToggle(task)}
        title={task.completed ? "未完了に戻す" : "完了にする"}
        tone="check"
      />

      <div className="task-content">
        <input
          aria-label={`${task.title} のタイトル`}
          className="task-title-input"
          disabled={!connected}
          onBlur={() => props.onCommitTitle(task)}
          onChange={(event) => props.onChangeDraft(task.id, event.target.value)}
          onFocus={() => props.onStartTitleEdit(task)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }

            if (event.key === "Escape") {
              props.onCancelTitle(task);
              event.currentTarget.blur();
            }
          }}
          value={title}
        />
        <TaskMeta task={task} pendingMutation={pendingMutation} hasConflict={hasConflict} />
        <EditorsRow editors={editors} />
      </div>

      <IconButton
        aria-label="削除"
        disabled={!connected}
        icon={<Trash2 size={18} />}
        onClick={() => props.onDelete(task)}
        title="削除"
        tone="danger"
      />
    </article>
  );
}
