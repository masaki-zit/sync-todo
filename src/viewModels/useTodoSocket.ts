/** Socket.IO 接続の生存期間と受信イベント反映を担当する view model を定義するファイル。 */
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { dropMutation, removeTaskDraft, sortTasks, upsertTask } from "../models/taskModel";
import { createTodoSocket, type TodoSocket } from "../services/socketClient";
import type {
  ClientUser,
  ConflictPayload,
  EditingState,
  JoinUserPayload,
  PendingMutation,
  Task
} from "../shared/types";
import type { SyncLog } from "./useSyncLogs";

/** ソケット接続管理に必要な状態更新関数群。 */
interface TodoSocketOptions {
  profile: JoinUserPayload;
  appendLog: (text: string, tone: SyncLog["tone"]) => void;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  setUsers: Dispatch<SetStateAction<ClientUser[]>>;
  setEditing: Dispatch<SetStateAction<EditingState[]>>;
  setCurrentUser: Dispatch<SetStateAction<ClientUser | null>>;
  setPending: Dispatch<SetStateAction<Record<string, PendingMutation>>>;
  setDrafts: Dispatch<SetStateAction<Record<string, string>>>;
  setDraftBases: Dispatch<SetStateAction<Record<string, number>>>;
  setConflict: Dispatch<SetStateAction<ConflictPayload | null>>;
}

/**
 * サーバーとの接続を開始し、受信イベントを React の状態へ反映する。
 * @param options 接続管理に必要な状態更新関数
 * @returns 接続状態とソケット参照
 */
export function useTodoSocket({
  profile,
  appendLog,
  setTasks,
  setUsers,
  setEditing,
  setCurrentUser,
  setPending,
  setDrafts,
  setDraftBases,
  setConflict
}: TodoSocketOptions) {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<TodoSocket | null>(null);

  useEffect(() => {
    const socket = createTodoSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      appendLog("サーバーに接続しました", "success");
      socket.emit("user:join", profile);
    });
    socket.on("disconnect", () => {
      setConnected(false);
      appendLog("サーバーから切断されました", "warning");
    });
    socket.on("snapshot", (payload) => {
      // 初回スナップショットを正とし、共同編集状態をサーバー基準へそろえる。
      setTasks(sortTasks(payload.tasks));
      setUsers(payload.users);
      setEditing(payload.editing);
      setCurrentUser(payload.currentUser);
      appendLog("最新の状態を受信しました", "success");
    });
    socket.on("presence:changed", ({ users }) => setUsers(users));
    socket.on("editing:changed", ({ editing }) => setEditing(editing));
    socket.on("task:created", (payload) => {
      // 楽観追加した仮 ID のタスクを、サーバー確定後の正式タスクで置き換える。
      setPending((previous) => dropMutation(previous, payload.mutationId));
      setTasks((previous) => sortTasks(upsertTask(
        previous.filter((task) => task.id !== payload.optimisticId),
        payload.task
      )));
      appendLog("タスク作成を同期しました", "success");
    });
    socket.on("task:updated", (payload) => {
      setPending((previous) => dropMutation(previous, payload.mutationId));
      setTasks((previous) => sortTasks(upsertTask(previous, payload.task)));
      // 同じ mutation の更新が確定したら、開いている競合モーダルも閉じる。
      setConflict((current) => (current?.mutationId === payload.mutationId ? null : current));
      appendLog("タスク更新を同期しました", "success");
    });
    socket.on("task:deleted", (payload) => {
      setPending((previous) => dropMutation(previous, payload.mutationId));
      setTasks((previous) => previous.filter((task) => task.id !== payload.taskId));
      setDrafts((previous) => removeTaskDraft(previous, payload.taskId));
      setDraftBases((previous) => removeTaskDraft(previous, payload.taskId));
      appendLog("タスク削除を同期しました", "success");
    });
    socket.on("task:conflict", (payload) => {
      setPending((previous) => dropMutation(previous, payload.mutationId));
      setConflict(payload);
      appendLog("編集の競合を検出しました", "warning");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [appendLog, profile, setConflict, setCurrentUser, setDraftBases, setDrafts, setEditing, setPending, setTasks, setUsers]);

  return { connected, socketRef: socketRef as RefObject<TodoSocket | null> };
}
