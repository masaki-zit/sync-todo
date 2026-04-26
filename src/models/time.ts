/** 画面表示用の時刻整形をまとめて扱うファイル。 */
/**
 * ISO 形式の日時文字列を日本語ロケールの時刻表示へ変換する。
 * @param value 整形対象の日時文字列
 * @returns 時分秒を含む表示用文字列
 */
export function formatTime(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date(value));
}
