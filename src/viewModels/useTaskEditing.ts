/** タスクタイトル編集中の下書き状態を扱う view model を定義するファイル。 */
import { Dispatch, RefObject, SetStateAction, useCallback } from "react";
import { removeTaskDraft } from "../models/taskModel";
import type { TodoSocket } from "../services/socketClient";
import type { Task, TaskPatch } from "../shared/types";

/** タイトル編集中の状態管理に必要な依存関係。 */
interface TaskEditingOptions {
  socketRef: RefObject<TodoSocket | null>;
  draftTitles: Record<string, string>;
  draftBases: Record<string, number>;
  setDraftTitles: Dispatch<SetStateAction<Record<string, string>>>;
  setDraftBases: Dispatch<SetStateAction<Record<string, number>>>;
  updateTask: (task: Task, patch: TaskPatch, baseVersion?: number) => void;
}

/**
 * タイトル編集開始・変更・確定・取消の操作群を返す。
 * @param options 編集中状態を扱うための依存関係
 * @returns タイトル編集用の操作群
 */
export function useTaskEditing(options: TaskEditingOptions) {
  /**
   * タイトル編集開始を記録し、他ユーザーへ編集中状態を通知する。
   * @param task 編集対象のタスク
   */
  const startTitleEdit = useCallback((task: Task) => {
    // 編集開始時点の版を覚えておき、あとで保存するときの競合判定基準に使う。
    options.setDraftBases((previous) => ({
      ...previous,
      [task.id]: previous[task.id] ?? task.version
    }));
    options.socketRef.current?.emit("task:editing", { taskId: task.id, field: "title", isEditing: true });
  }, [options]);

  /**
   * タイトル下書きを更新する。
   * @param taskId 対象タスク ID
   * @param title 入力中タイトル
   */
  const changeDraftTitle = useCallback((taskId: string, title: string) => {
    options.setDraftTitles((previous) => ({ ...previous, [taskId]: title }));
  }, [options]);

  /**
   * 指定タスクの下書き情報と基準バージョンを破棄する。
   * @param taskId 対象タスク ID
   */
  const clearDraft = useCallback((taskId: string) => {
    options.setDraftTitles((previous) => removeTaskDraft(previous, taskId));
    options.setDraftBases((previous) => removeTaskDraft(previous, taskId));
  }, [options]);

  /**
   * タイトル編集を取り消し、編集中通知を解除する。
   * @param task 編集対象のタスク
   */
  const cancelTitleEdit = useCallback((task: Task) => {
    clearDraft(task.id);
    options.socketRef.current?.emit("task:editing", { taskId: task.id, field: "title", isEditing: false });
  }, [clearDraft, options]);

  /**
   * 下書きタイトルを確定し、必要なら更新要求を送る。
   * @param task 編集対象のタスク
   */
  const commitTitle = useCallback((task: Task) => {
    const draft = options.draftTitles[task.id];
    const title = draft?.trim();
    const baseVersion = options.draftBases[task.id] ?? task.version;
    options.socketRef.current?.emit("task:editing", { taskId: task.id, field: "title", isEditing: false });

    // 空文字や未変更の入力は更新扱いにせず、ノイズの少ない編集終了として扱う。
    if (!draft || !title || title === task.title) {
      clearDraft(task.id);
      return;
    }

    options.updateTask(task, { title }, baseVersion);
    clearDraft(task.id);
  }, [clearDraft, options]);

  return { startTitleEdit, changeDraftTitle, commitTitle, cancelTitleEdit };
}
