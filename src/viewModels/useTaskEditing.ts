import { Dispatch, RefObject, SetStateAction, useCallback } from "react";
import { removeTaskDraft } from "../models/taskModel";
import type { TodoSocket } from "../services/socketClient";
import type { Task, TaskPatch } from "../shared/types";

interface TaskEditingOptions {
  socketRef: RefObject<TodoSocket | null>;
  draftTitles: Record<string, string>;
  draftBases: Record<string, number>;
  setDraftTitles: Dispatch<SetStateAction<Record<string, string>>>;
  setDraftBases: Dispatch<SetStateAction<Record<string, number>>>;
  updateTask: (task: Task, patch: TaskPatch, baseVersion?: number) => void;
}

export function useTaskEditing(options: TaskEditingOptions) {
  const startTitleEdit = useCallback((task: Task) => {
    options.setDraftBases((previous) => ({
      ...previous,
      [task.id]: previous[task.id] ?? task.version
    }));
    options.socketRef.current?.emit("task:editing", { taskId: task.id, field: "title", isEditing: true });
  }, [options]);

  const changeDraftTitle = useCallback((taskId: string, title: string) => {
    options.setDraftTitles((previous) => ({ ...previous, [taskId]: title }));
  }, [options]);

  const clearDraft = useCallback((taskId: string) => {
    options.setDraftTitles((previous) => removeTaskDraft(previous, taskId));
    options.setDraftBases((previous) => removeTaskDraft(previous, taskId));
  }, [options]);

  const cancelTitleEdit = useCallback((task: Task) => {
    clearDraft(task.id);
    options.socketRef.current?.emit("task:editing", { taskId: task.id, field: "title", isEditing: false });
  }, [clearDraft, options]);

  const commitTitle = useCallback((task: Task) => {
    const draft = options.draftTitles[task.id];
    const title = draft?.trim();
    const baseVersion = options.draftBases[task.id] ?? task.version;
    options.socketRef.current?.emit("task:editing", { taskId: task.id, field: "title", isEditing: false });

    if (!draft || !title || title === task.title) {
      clearDraft(task.id);
      return;
    }

    options.updateTask(task, { title }, baseVersion);
    clearDraft(task.id);
  }, [clearDraft, options]);

  return { startTitleEdit, changeDraftTitle, commitTitle, cancelTitleEdit };
}
