import { Dispatch, RefObject, SetStateAction, useCallback } from "react";
import { makeId } from "../models/id";
import { sortTasks, upsertTask } from "../models/taskModel";
import type { TodoSocket } from "../services/socketClient";
import type { ClientUser, PendingMutation, Task, TaskPatch } from "../shared/types";
import type { SyncLog } from "./useSyncLogs";

interface TaskMutationOptions {
  socketRef: RefObject<TodoSocket | null>;
  currentUser: ClientUser | null;
  appendLog: (text: string, tone: SyncLog["tone"]) => void;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  setPending: Dispatch<SetStateAction<Record<string, PendingMutation>>>;
}

export function useTaskMutations(options: TaskMutationOptions) {
  const createTask = useCallback((title: string, onCreated: () => void) => {
    const socket = options.socketRef.current;
    const trimmedTitle = title.trim();
    if (!trimmedTitle || !socket) {
      return;
    }

    const mutationId = makeId();
    const optimisticId = `optimistic-${mutationId}`;
    const now = new Date().toISOString();
    const optimisticTask: Task = {
      id: optimisticId,
      title: trimmedTitle,
      completed: false,
      version: 0,
      createdAt: now,
      updatedAt: now,
      updatedBy: options.currentUser?.id ?? "local"
    };

    options.setTasks((previous) => sortTasks([optimisticTask, ...previous]));
    options.setPending((previous) => ({
      ...previous,
      [mutationId]: { mutationId, taskId: optimisticId, payload: { title: trimmedTitle }, baseVersion: 0, createdAt: now }
    }));
    socket.emit("task:create", { mutationId, optimisticId, title: trimmedTitle });
    options.appendLog("タスク作成を送信しました", "info");
    onCreated();
  }, [options]);

  const updateTask = useCallback((task: Task, patch: TaskPatch, baseVersion = task.version) => {
    const socket = options.socketRef.current;
    if (!socket) {
      return;
    }

    const mutationId = makeId();
    const now = new Date().toISOString();
    const optimisticTask = {
      ...task,
      ...patch,
      version: task.version + 1,
      updatedAt: now,
      updatedBy: options.currentUser?.id ?? "local"
    };

    options.setTasks((previous) => sortTasks(upsertTask(previous, optimisticTask)));
    options.setPending((previous) => ({
      ...previous,
      [mutationId]: { mutationId, taskId: task.id, payload: patch, baseVersion, createdAt: now }
    }));
    socket.emit("task:update", { mutationId, taskId: task.id, patch, baseVersion });
    options.appendLog("タスク更新を送信しました", "info");
  }, [options]);

  const deleteTask = useCallback((task: Task) => {
    const socket = options.socketRef.current;
    if (!socket) {
      return;
    }

    const mutationId = makeId();
    options.setTasks((previous) => previous.filter((item) => item.id !== task.id));
    options.setPending((previous) => ({
      ...previous,
      [mutationId]: { mutationId, taskId: task.id, payload: {}, baseVersion: task.version, createdAt: new Date().toISOString() }
    }));
    socket.emit("task:delete", { mutationId, taskId: task.id, baseVersion: task.version });
    options.appendLog("タスク削除を送信しました", "info");
  }, [options]);

  return { createTask, updateTask, deleteTask };
}
