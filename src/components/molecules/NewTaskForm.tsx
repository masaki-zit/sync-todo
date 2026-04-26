/** 新規タスク入力欄と追加操作をまとめるフォーム用ファイル。 */
import { ListTodo, Plus } from "lucide-react";
import { ActionButton } from "../atoms/ActionButton";

/** `NewTaskForm` に渡す入力値と操作群。 */
interface NewTaskFormProps {
  connected: boolean;
  title: string;
  onChange: (title: string) => void;
  onSubmit: () => void;
}

/**
 * 新規タスク入力フォームを表示する。
 * @param props 入力値と送信操作
 * @returns 新規タスク入力フォーム
 */
export function NewTaskForm({ connected, title, onChange, onSubmit }: NewTaskFormProps) {
  return (
    <form
      className="new-task-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <ListTodo size={20} />
      <input
        value={title}
        onChange={(event) => onChange(event.target.value)}
        placeholder="新しいタスクを入力"
        aria-label="新しいタスク"
      />
      <ActionButton icon={<Plus size={18} />} type="submit" disabled={!title.trim() || !connected}>
        追加
      </ActionButton>
    </form>
  );
}
