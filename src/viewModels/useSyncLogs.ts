import { useCallback, useState } from "react";
import { MAX_LOGS } from "../config";
import { makeId } from "../models/id";

export interface SyncLog {
  id: string;
  text: string;
  tone: "info" | "success" | "warning";
  createdAt: string;
}

export function useSyncLogs() {
  const [logs, setLogs] = useState<SyncLog[]>(() => [
    {
      id: makeId(),
      text: "クライアントを起動しました",
      tone: "info",
      createdAt: new Date().toISOString()
    }
  ]);

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
