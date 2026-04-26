/** タスク更新ルールと競合判定をまとめるサービスを定義するファイル。 */
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

/** タスクサービス生成時に必要な依存関係。 */
interface TaskServiceOptions {
  ensureUser: (socketId: string) => ClientUser;
  repository: MemoryTodoRepository;
}

/**
 * タスク操作のドメインルールをまとめたサービスを生成する。
 * @param options ユーザー解決関数とリポジトリ
 * @returns タスク操作群
 */
export function createTaskService({ ensureUser, repository }: TaskServiceOptions) {
  /**
   * 新しいタスクを生成して保存する。
   * @param socketId 操作したソケット ID
   * @param payload 作成要求
   * @returns 作成結果
   */
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

  /**
   * タスク差分を適用し、必要なら競合結果を返す。
   * @param socketId 操作したソケット ID
   * @param payload 更新要求
   * @returns 更新結果または競合結果
   */
  function updateTask(socketId: string, payload: UpdateTaskPayload) {
    const existing = repository.getTask(payload.taskId);
    if (!existing) {
      return null;
    }

    if (existing.version !== payload.baseVersion) {
      // 新しい版がすでに存在する場合は上書きせず、競合として明示的に扱う。
      return {
        conflict: buildConflict(payload, existing),
        kind: "conflict" as const
      };
    }

    const task = applyPatch(existing, payload.patch, ensureUser(socketId).id);
    repository.saveTask(task);
    return { kind: "updated" as const, mutationId: payload.mutationId, task };
  }

  /**
   * タスクと関連する編集中状態を削除する。
   * @param payload 削除要求
   * @returns 削除結果
   */
  function deleteTask(payload: DeleteTaskPayload) {
    if (!repository.hasTask(payload.taskId)) {
      return null;
    }

    repository.deleteTask(payload.taskId);
    repository.deleteEditingWhere((state) => state.taskId === payload.taskId);
    return { mutationId: payload.mutationId, taskId: payload.taskId };
  }

  /**
   * 指定タスクの編集中状態を登録または解除する。
   * @param socketId 操作したソケット ID
   * @param payload 編集状態通知
   * @returns 対象タスクが存在したかどうか
   */
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

  /**
   * 競合解決方針に応じてタスクを確定する。
   * @param socketId 操作したソケット ID
   * @param payload 競合解決要求
   * @returns 解決結果
   */
  function resolveConflict(socketId: string, payload: ConflictResolvePayload) {
    const existing = repository.getTask(payload.taskId);
    if (!existing) {
      return null;
    }

    if (payload.strategy === "use-server") {
      // サーバー版採用では共有状態は変わらないため、要求元だけを補正すれば足りる。
      return { mutationId: payload.mutationId, scope: "socket" as const, task: existing };
    }

    // ローカル案は最新のサーバー状態へ差分を重ね直し、全員の表示を同じ版へ収束させる。
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

/** `createTaskService` が返すタスクサービスの型。 */
export type TaskService = ReturnType<typeof createTaskService>;
