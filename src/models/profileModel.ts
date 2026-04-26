/** タブ単位の利用者プロフィールを読み書きする責務を持つファイル。 */
import type { JoinUserPayload } from "../shared/types";

const STORAGE_KEY = "sync-todo-profile";
const NAMES = ["Aki", "Ren", "Mio", "Sora", "Yui", "Kai"];
const COLORS = ["#0f766e", "#2563eb", "#c2410c", "#7c3aed", "#15803d", "#be123c"];

/**
 * セッションストレージからプロフィールを取得し、なければテスト用の既定値で新規作成する。
 * @returns 現在のタブで使う利用者プロフィール
 */
export function readOrCreateProfile(): JoinUserPayload {
  const saved = window.sessionStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved) as JoinUserPayload;
  }

  // 複数タブでの動作確認を始めやすくするため、表示名と色は自動で補う。
  const profile: JoinUserPayload = {
    name: `${pick(NAMES)}-${Math.floor(Math.random() * 90 + 10)}`,
    color: pick(COLORS)
  };
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  return profile;
}

/**
 * 配列からランダムに 1 件選ぶ。
 * @param values 候補一覧
 * @returns 選ばれた値
 */
function pick(values: string[]) {
  return values[Math.floor(Math.random() * values.length)];
}
