/** 起動直後のサーバーへ投入する初期タスクを生成するファイル。 */
import { randomUUID } from "node:crypto";
import type { Task } from "../../src/shared/types";

/**
 * デモ表示用の初期タスク一覧を生成する。
 * @returns 初期タスク一覧
 */
export function createSeedTasks(): Task[] {
  const now = new Date().toISOString();

  return [
    buildSeedTask("Socket.IO のイベントを確認する", false, now),
    buildSeedTask("別タブで同じタスクを編集して競合を試す", false, now),
    buildSeedTask("presence と編集中表示を確認する", true, now)
  ];
}

/**
 * 初期タスク 1 件分を生成する。
 * @param title タスクタイトル
 * @param completed 完了状態
 * @param now 作成・更新時刻
 * @returns 初期タスク
 */
function buildSeedTask(title: string, completed: boolean, now: string): Task {
  return {
    id: randomUUID(),
    title,
    completed,
    version: 1,
    createdAt: now,
    updatedAt: now,
    updatedBy: "system"
  };
}
