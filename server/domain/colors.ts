/** ユーザー表示色を安定的に決めるルールをまとめるファイル。 */
const COLORS = ["#0f766e", "#2563eb", "#c2410c", "#7c3aed", "#15803d", "#be123c"];

/**
 * 文字列 ID から決定的に色を選ぶ。
 * @param id 色決定に使う識別子
 * @returns 選ばれた色コード
 */
export function colorFromId(id: string) {
  const total = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return COLORS[total % COLORS.length];
}
