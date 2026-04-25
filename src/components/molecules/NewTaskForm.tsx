import { ListTodo, Plus } from "lucide-react";
import { ActionButton } from "../atoms/ActionButton";

interface NewTaskFormProps {
  connected: boolean;
  title: string;
  onChange: (title: string) => void;
  onSubmit: () => void;
}

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
