/** サーバーへ入る文字列や差分の正規化を担当するファイル。 */
import type { TaskPatch } from "../../src/shared/types";

/**
 * ユーザー名を前後トリムし、空なら既定名へ補正する。
 * @param value 入力されたユーザー名
 * @returns 正規化後のユーザー名
 */
export function cleanName(value: string) {
  const name = value.trim();
  return name.length > 0 ? name.slice(0, 32) : "Guest";
}

/**
 * タスクタイトルを前後トリムし、空なら既定タイトルへ補正する。
 * @param value 入力されたタイトル
 * @returns 正規化後のタイトル
 */
export function cleanTitle(value: string) {
  const title = value.trim();
  return title.length > 0 ? title.slice(0, 140) : "Untitled task";
}

/**
 * タスク差分のうち許可された項目だけを正規化して返す。
 * @param patch 入力された差分
 * @returns 正規化後の差分
 */
export function sanitizePatch(patch: TaskPatch): TaskPatch {
  const sanitized: TaskPatch = {};

  if (typeof patch.title === "string") {
    sanitized.title = cleanTitle(patch.title);
  }

  if (typeof patch.completed === "boolean") {
    sanitized.completed = patch.completed;
  }

  return sanitized;
}
