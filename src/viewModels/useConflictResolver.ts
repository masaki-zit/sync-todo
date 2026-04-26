/** 競合発生時の解決手順をまとめる view model を定義するファイル。 */
import { Dispatch, RefObject, SetStateAction, useCallback } from "react";
import { sortTasks, upsertTask } from "../models/taskModel";
import type { TodoSocket } from "../services/socketClient";
import type { ConflictPayload, PendingMutation, Task } from "../shared/types";
import type { SyncLog } from "./useSyncLogs";

/** 競合解決に必要な依存関係。 */
interface ConflictResolverOptions {
  socketRef: RefObject<TodoSocket | null>;
  conflict: ConflictPayload | null;
  appendLog: (text: string, tone: SyncLog["tone"]) => void;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  setPending: Dispatch<SetStateAction<Record<string, PendingMutation>>>;
  setConflict: Dispatch<SetStateAction<ConflictPayload | null>>;
}

/**
 * 競合解決方針に応じてローカル状態を更新し、サーバーへ解決結果を通知する。
 * @param options 競合状態と状態更新関数
 * @returns 競合解決を実行する関数
 */
export function useConflictResolver(options: ConflictResolverOptions) {
  return useCallback((strategy: "use-local" | "use-server") => {
    const socket = options.socketRef.current;
    if (!options.conflict || !socket) {
      return;
    }

    const { conflict } = options;
    if (strategy === "use-server") {
      // サーバー版を選んだときは、応答待ちせずローカル表示を即座に確定状態へ合わせる。
      options.setTasks((previous) => sortTasks(upsertTask(previous, conflict.serverTask)));
    } else {
      // 同じ mutationId を維持して再送し、後続の成功通知で正しい保留状態を解消できるようにする。
      options.setPending((previous) => ({
        ...previous,
        [conflict.mutationId]: {
          mutationId: conflict.mutationId,
          taskId: conflict.taskId,
          payload: conflict.localPatch,
          baseVersion: conflict.serverTask.version,
          createdAt: new Date().toISOString()
        }
      }));
    }

    socket.emit("conflict:resolve", {
      mutationId: conflict.mutationId,
      taskId: conflict.taskId,
      strategy,
      localPatch: strategy === "use-local" ? conflict.localPatch : undefined
    });
    options.setConflict(null);
    options.appendLog(strategy === "use-local" ? "自分の変更で上書きしました" : "サーバーの状態を採用しました", "info");
  }, [options]);
}
