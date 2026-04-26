/** 同期ログの生成と保持を担当する view model を定義するファイル。 */
import { useCallback, useState } from "react";
import { MAX_LOGS } from "../config";
import { makeId } from "../models/id";

/** サイドパネルに表示する同期ログ 1 件分のデータ。 */
export interface SyncLog {
  id: string;
  text: string;
  tone: "info" | "success" | "warning";
  createdAt: string;
}

/**
 * 新しいログを先頭に積み、表示件数を制限したログ状態を提供する。
 * @returns ログ一覧と追記関数
 */
export function useSyncLogs() {
  const [logs, setLogs] = useState<SyncLog[]>(() => [
    {
      id: makeId(),
      text: "クライアントを起動しました",
      tone: "info",
      createdAt: new Date().toISOString()
    }
  ]);

  /**
   * 同期ログを先頭へ追加し、保持件数を上限内に保つ。
   * @param text 表示するログ文言
   * @param tone ログの見た目種別
   */
  const appendLog = useCallback((text: string, tone: SyncLog["tone"]) => {
    setLogs((previous) =>
      [
        {
          id: makeId(),
          text,
          tone,
          createdAt: new Date().toISOString()
        },
        ...previous
      ].slice(0, MAX_LOGS)
    );
  }, []);

  return { logs, appendLog };
}
