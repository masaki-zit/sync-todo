/** クライアント側で一意な識別子を生成する責務を持つファイル。 */
/**
 * 利用可能なら `crypto.randomUUID` を使い、なければ簡易な代替 ID を生成する。
 * @returns 生成した識別子
 */
export function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
