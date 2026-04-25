import { randomUUID } from "node:crypto";
import type {
  ClientUser,
  ConflictResolvePayload,
  CreateTaskPayload,
  DeleteTaskPayload,
  EditingPayload,
  Task,
  UpdateTaskPayload
} from "../../src/shared/types";
import { buildConflict } from "../domain/conflict";
import { editingKey } from "../domain/editingKey";
import { applyPatch } from "../domain/taskPatch";
import { cleanTitle } from "../domain/sanitize";
import type { MemoryTodoRepository } from "../repositories/memoryTodoRepository";

interface TaskServiceOptions {
  ensureUser: (socketId: string) => ClientUser;
  repository: MemoryTodoRepository;
}

export function createTaskService({ ensureUser, repository }: TaskServiceOptions) {
  function createTask(socketId: string, payload: CreateTaskPayload) {
    const now = new Date().toISOString();
    const task: Task = {
      id: randomUUID(),
      title: cleanTitle(payload.title),
      completed: false,
      version: 1,
      createdAt: now,
      updatedAt: now,
      updatedBy: ensureUser(socketId).id
    };

    repository.saveTask(task);
    return { mutationId: payload.mutationId, optimisticId: payload.optimisticId, task };
  }

  function updateTask(socketId: string, payload: UpdateTaskPayload) {
    const existing = repository.getTask(payload.taskId);
    if (!existing) {
      return null;
    }

    if (existing.version !== payload.baseVersion) {
      return {
        conflict: buildConflict(payload, existing),
        kind: "conflict" as const
      };
    }

    const task = applyPatch(existing, payload.patch, ensureUser(socketId).id);
    repository.saveTask(task);
    return { kind: "updated" as const, mutationId: payload.mutationId, task };
  }

  function deleteTask(payload: DeleteTaskPayload) {
    if (!repository.hasTask(payload.taskId)) {
      return null;
    }

    repository.deleteTask(payload.taskId);
    repository.deleteEditingWhere((state) => state.taskId === payload.taskId);
    return { mutationId: payload.mutationId, taskId: payload.taskId };
  }

  function setEditing(socketId: string, payload: EditingPayload) {
    if (!repository.hasTask(payload.taskId)) {
      return false;
    }

    const key = editingKey(socketId, payload.taskId, payload.field);
    if (payload.isEditing) {
      repository.saveEditing(key, {
        taskId: payload.taskId,
        userId: ensureUser(socketId).id,
        field: payload.field,
        startedAt: new Date().toISOString()
      });
    } else {
      repository.deleteEditing(key);
    }
    return true;
  }

  function resolveConflict(socketId: string, payload: ConflictResolvePayload) {
    const existing = repository.getTask(payload.taskId);
    if (!existing) {
      return null;
    }

    if (payload.strategy === "use-server") {
      return { mutationId: payload.mutationId, scope: "socket" as const, task: existing };
    }

    const task = applyPatch(existing, payload.localPatch ?? {}, ensureUser(socketId).id);
    repository.saveTask(task);
    return { mutationId: payload.mutationId, scope: "all" as const, task };
  }

  return {
    createTask,
    deleteTask,
    editing: () => repository.listEditing(),
    resolveConflict,
    setEditing,
    tasks: () => repository.listTasks(),
    updateTask
  };
}

export type TaskService = ReturnType<typeof createTaskService>;
