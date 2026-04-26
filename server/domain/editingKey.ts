/** 編集中状態を一意に識別するキー生成を担当するファイル。 */
/**
 * ユーザー・タスク・フィールドの組み合わせから編集中状態キーを作る。
 * @param userId ユーザー ID
 * @param taskId タスク ID
 * @param field フィールド名
 * @returns 編集中状態キー
 */
export function editingKey(userId: string, taskId: string, field: string) {
  return `${userId}:${taskId}:${field}`;
}
