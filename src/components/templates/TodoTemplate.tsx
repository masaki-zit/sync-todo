import type { TodoViewModel } from "../../viewModels/useTodoViewModel";
import { ConnectionPill } from "../atoms/ConnectionPill";
import { NewTaskForm } from "../molecules/NewTaskForm";
import { ConflictModal } from "../organisms/ConflictModal";
import { MetricsRow } from "../organisms/MetricsRow";
import { SidePanel } from "../organisms/SidePanel";
import { TaskList } from "../organisms/TaskList";

interface TodoTemplateProps {
  viewModel: TodoViewModel;
}

export function TodoTemplate({ viewModel }: TodoTemplateProps) {
  return (
    <main className="app-shell">
      <section className="workspace">
        <header className="workspace-header">
          <div>
            <p className="eyebrow">Realtime Sync Todo</p>
            <h1>共同編集TODO</h1>
          </div>
          <ConnectionPill connected={viewModel.connected} />
        </header>

        <NewTaskForm
          connected={viewModel.connected}
          title={viewModel.newTitle}
          onChange={viewModel.setNewTitle}
          onSubmit={viewModel.submitNewTask}
        />
        <MetricsRow
          completedCount={viewModel.completedCount}
          pendingCount={viewModel.pendingCount}
          taskCount={viewModel.tasks.length}
        />
        <TaskList
          connected={viewModel.connected}
          conflictTaskId={viewModel.conflict?.taskId}
          draftTitles={viewModel.draftTitles}
          tasks={viewModel.tasks}
          getEditorsForTask={viewModel.getEditorsForTask}
          getPendingForTask={viewModel.getPendingForTask}
          onCancelTitle={viewModel.cancelTitleEdit}
          onChangeDraft={viewModel.changeDraftTitle}
          onCommitTitle={viewModel.commitTitle}
          onDelete={viewModel.deleteTask}
          onStartTitleEdit={viewModel.startTitleEdit}
          onToggle={viewModel.toggleTask}
        />
      </section>

      <SidePanel currentUser={viewModel.currentUser} logs={viewModel.logs} users={viewModel.users} />

      {viewModel.conflict ? (
        <ConflictModal
          conflict={viewModel.conflict}
          onClose={() => viewModel.resolveConflict("use-server")}
          onResolve={viewModel.resolveConflict}
        />
      ) : null}
    </main>
  );
}
