/** タスク作成・更新・削除の楽観更新処理をまとめる view model を定義するファイル。 */
import { Dispatch, RefObject, SetStateAction, useCallback } from "react";
import { makeId } from "../models/id";
import { sortTasks, upsertTask } from "../models/taskModel";
import type { TodoSocket } from "../services/socketClient";
import type { ClientUser, PendingMutation, Task, TaskPatch } from "../shared/types";
import type { SyncLog } from "./useSyncLogs";

/** タスク mutation 実行時に必要な依存関係。 */
interface TaskMutationOptions {
  socketRef: RefObject<TodoSocket | null>;
  currentUser: ClientUser | null;
  appendLog: (text: string, tone: SyncLog["tone"]) => void;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  setPending: Dispatch<SetStateAction<Record<string, PendingMutation>>>;
}

/**
 * タスク mutation 用の操作群を返す。
 * @param options ソケット参照や状態更新関数
 * @returns 作成・更新・削除の操作群
 */
export function useTaskMutations(options: TaskMutationOptions) {
  /**
   * 新規タスクを楽観追加し、作成要求をサーバーへ送る。
   * @param title 入力中のタスクタイトル
   * @param onCreated 作成開始後に呼ぶ後処理
   */
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

    // 正式 ID の到着を待たずに一覧へ反映し、入力直後の体感速度を優先する。
    options.setTasks((previous) => sortTasks([optimisticTask, ...previous]));
    options.setPending((previous) => ({
      ...previous,
      [mutationId]: { mutationId, taskId: optimisticId, payload: { title: trimmedTitle }, baseVersion: 0, createdAt: now }
    }));
    socket.emit("task:create", { mutationId, optimisticId, title: trimmedTitle });
    options.appendLog("タスク作成を送信しました", "info");
    onCreated();
  }, [options]);

  /**
   * タスク差分を楽観反映し、更新要求をサーバーへ送る。
   * @param task 更新対象のタスク
   * @param patch 反映したい差分
   * @param baseVersion 競合判定に使う基準バージョン
   */
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

    // バッジや並び順がすぐ追従するよう、ローカル側でも先にバージョンを進める。
    options.setTasks((previous) => sortTasks(upsertTask(previous, optimisticTask)));
    options.setPending((previous) => ({
      ...previous,
      [mutationId]: { mutationId, taskId: task.id, payload: patch, baseVersion, createdAt: now }
    }));
    socket.emit("task:update", { mutationId, taskId: task.id, patch, baseVersion });
    options.appendLog("タスク更新を送信しました", "info");
  }, [options]);

  /**
   * タスクを一覧から楽観削除し、削除要求をサーバーへ送る。
   * @param task 削除対象のタスク
   */
  const deleteTask = useCallback((task: Task) => {
    const socket = options.socketRef.current;
    if (!socket) {
      return;
    }

    const mutationId = makeId();
    // 削除は即時反映し、必要ならサーバー側の結果で戻す方が操作感を損ねにくい。
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
