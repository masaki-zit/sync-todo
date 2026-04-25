import { Dispatch, RefObject, SetStateAction, useCallback } from "react";
import { sortTasks, upsertTask } from "../models/taskModel";
import type { TodoSocket } from "../services/socketClient";
import type { ConflictPayload, PendingMutation, Task } from "../shared/types";
import type { SyncLog } from "./useSyncLogs";

interface ConflictResolverOptions {
  socketRef: RefObject<TodoSocket | null>;
  conflict: ConflictPayload | null;
  appendLog: (text: string, tone: SyncLog["tone"]) => void;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  setPending: Dispatch<SetStateAction<Record<string, PendingMutation>>>;
  setConflict: Dispatch<SetStateAction<ConflictPayload | null>>;
}

export function useConflictResolver(options: ConflictResolverOptions) {
  return useCallback((strategy: "use-local" | "use-server") => {
    const socket = options.socketRef.current;
    if (!options.conflict || !socket) {
      return;
    }

    const { conflict } = options;
    if (strategy === "use-server") {
      options.setTasks((previous) => sortTasks(upsertTask(previous, conflict.serverTask)));
    } else {
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
