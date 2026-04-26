/** タスク一覧や編集中状態を純粋関数で加工する責務を持つファイル。 */
import type { ClientUser, EditingState, PendingMutation, Task } from "../shared/types";

/**
 * 既存タスクを置き換えるか、新規タスクを先頭へ追加する。
 * @param tasks 現在のタスク一覧
 * @param task 反映したいタスク
 * @returns 更新後のタスク一覧
 */
export function upsertTask(tasks: Task[], task: Task) {
  const exists = tasks.some((item) => item.id === task.id);
  return exists ? tasks.map((item) => (item.id === task.id ? task : item)) : [task, ...tasks];
}

/**
 * 更新日時の降順でタスク一覧を並べ替える。
 * @param tasks 並べ替え対象のタスク一覧
 * @returns 並べ替え後のタスク一覧
 */
export function sortTasks(tasks: Task[]) {
  return [...tasks].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/**
 * 指定した mutation を保留一覧から取り除く。
 * @param pending 保留中 mutation の一覧
 * @param mutationId 削除したい mutation の識別子
 * @returns 指定 mutation を除いた一覧
 */
export function dropMutation(pending: Record<string, PendingMutation>, mutationId: string) {
  const next = { ...pending };
  delete next[mutationId];
  return next;
}

/**
 * タスク ID をキーに持つ下書き情報を 1 件削除する。
 * @param drafts 下書きや基準バージョンの一覧
 * @param taskId 削除対象のタスク ID
 * @returns 指定タスクを除いた一覧
 */
export function removeTaskDraft<T>(drafts: Record<string, T>, taskId: string) {
  const next = { ...drafts };
  delete next[taskId];
  return next;
}

/**
 * 指定タスクに対する保留中 mutation を 1 件取得する。
 * @param pending 保留中 mutation の一覧
 * @param taskId 対象タスク ID
 * @returns 見つかった mutation
 */
export function findPendingForTask(pending: Record<string, PendingMutation>, taskId: string) {
  return Object.values(pending).find((mutation) => mutation.taskId === taskId);
}

/**
 * 指定タスクを編集中の他ユーザー一覧を解決する。
 * @param editing 編集中状態の一覧
 * @param users 接続中ユーザー一覧
 * @param taskId 対象タスク ID
 * @param currentUserId 現在の利用者 ID
 * @returns 対象タスクを編集中の他ユーザー一覧
 */
export function editorsForTask(
  editing: EditingState[],
  users: ClientUser[],
  taskId: string,
  currentUserId?: string
) {
  // 自分自身は表示せず、同じタスクを触っている他ユーザーだけを強調表示する。
  const editorIds = new Set(
    editing.filter((state) => state.taskId === taskId && state.userId !== currentUserId).map((state) => state.userId)
  );
  return users.filter((user) => editorIds.has(user.id));
}
