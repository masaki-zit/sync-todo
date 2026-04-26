/** タスク一覧の空状態と通常状態を切り替え、各タスクをカードへ受け渡すファイル。 */
import { ListTodo } from "lucide-react";
import type { ClientUser, PendingMutation, Task } from "../../shared/types";
import { TaskCard } from "../molecules/TaskCard";

/** `TaskList` に渡す一覧表示用のデータと操作群。 */
interface TaskListProps {
  connected: boolean;
  conflictTaskId?: string;
  draftTitles: Record<string, string>;
  tasks: Task[];
  getEditorsForTask: (taskId: string) => ClientUser[];
  getPendingForTask: (taskId: string) => PendingMutation | undefined;
  onCancelTitle: (task: Task) => void;
  onChangeDraft: (taskId: string, title: string) => void;
  onCommitTitle: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStartTitleEdit: (task: Task) => void;
  onToggle: (task: Task) => void;
}

/**
 * タスク一覧を表示し、空状態の案内も含めて描画する。
 * @param props 一覧表示に必要なデータと操作群
 * @returns タスク一覧セクション
 */
export function TaskList(props: TaskListProps) {
  if (props.tasks.length === 0) {
    return (
      <section className="task-list" aria-label="TODO一覧">
        <div className="empty-state">
          <ListTodo size={32} />
          <p>まだタスクがありません。</p>
        </div>
      </section>
    );
  }

  return (
    <section className="task-list" aria-label="TODO一覧">
      {props.tasks.map((task) => (
        <TaskCard
          connected={props.connected}
          draftTitle={props.draftTitles[task.id]}
          editors={props.getEditorsForTask(task.id)}
          hasConflict={props.conflictTaskId === task.id}
          key={task.id}
          pendingMutation={props.getPendingForTask(task.id)}
          task={task}
          onCancelTitle={props.onCancelTitle}
          onChangeDraft={props.onChangeDraft}
          onCommitTitle={props.onCommitTitle}
          onDelete={props.onDelete}
          onStartTitleEdit={props.onStartTitleEdit}
          onToggle={props.onToggle}
        />
      ))}
    </section>
  );
}
