/** ページ全体で使う TODO 画面用 view model を組み立てるファイル。 */
import { useCallback, useMemo, useState } from "react";
import { editorsForTask, findPendingForTask } from "../models/taskModel";
import { readOrCreateProfile } from "../models/profileModel";
import type {
  ClientUser,
  ConflictPayload,
  EditingState,
  PendingMutation,
  Task
} from "../shared/types";
import { useSyncLogs } from "./useSyncLogs";
import { useConflictResolver } from "./useConflictResolver";
import { useTaskEditing } from "./useTaskEditing";
import { useTaskMutations } from "./useTaskMutations";
import { useTodoSocket } from "./useTodoSocket";

/**
 * 画面表示に必要な状態・派生値・操作群を 1 つの view model として返す。
 * @returns TODO 画面全体で使う view model
 */
export function useTodoViewModel() {
  // 再接続しても見た目上の利用者が変わらないよう、プロフィールはタブ内で固定する。
  const profile = useMemo(() => readOrCreateProfile(), []);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<ClientUser[]>([]);
  const [editing, setEditing] = useState<EditingState[]>([]);
  const [currentUser, setCurrentUser] = useState<ClientUser | null>(null);
  const [pending, setPending] = useState<Record<string, PendingMutation>>({});
  const [draftTitles, setDraftTitles] = useState<Record<string, string>>({});
  const [draftBases, setDraftBases] = useState<Record<string, number>>({});
  const [newTitle, setNewTitle] = useState("");
  const [conflict, setConflict] = useState<ConflictPayload | null>(null);
  const { logs, appendLog } = useSyncLogs();

  const { connected, socketRef } = useTodoSocket({
    profile,
    appendLog,
    setTasks,
    setUsers,
    setEditing,
    setCurrentUser,
    setPending,
    setDrafts: setDraftTitles,
    setDraftBases,
    setConflict
  });

  const mutations = useTaskMutations({
    socketRef,
    currentUser,
    appendLog,
    setTasks,
    setPending
  });
  const resolveConflict = useConflictResolver({
    socketRef,
    conflict,
    appendLog,
    setTasks,
    setPending,
    setConflict
  });
  const editingCommands = useTaskEditing({
    socketRef,
    draftTitles,
    draftBases,
    setDraftTitles,
    setDraftBases,
    updateTask: mutations.updateTask
  });

  /** 新規タスクを作成し、成功時に入力欄を空へ戻す。 */
  const submitNewTask = useCallback(() => {
    mutations.createTask(newTitle, () => setNewTitle(""));
  }, [mutations, newTitle]);

  /**
   * タスクの完了状態を反転して更新する。
   * @param task 更新対象のタスク
   */
  const toggleTask = useCallback((task: Task) => {
    mutations.updateTask(task, { completed: !task.completed });
  }, [mutations]);

  /**
   * 指定タスクの保留中 mutation を取得する。
   * @param taskId 対象タスク ID
   * @returns 見つかった mutation
   */
  const getPendingForTask = useCallback((taskId: string) => {
    return findPendingForTask(pending, taskId);
  }, [pending]);

  /**
   * 指定タスクを編集中の他ユーザー一覧を取得する。
   * @param taskId 対象タスク ID
   * @returns 編集中の他ユーザー一覧
   */
  const getEditorsForTask = useCallback((taskId: string) => {
    return editorsForTask(editing, users, taskId, currentUser?.id);
  }, [currentUser?.id, editing, users]);

  // テンプレート側では集計済みの値をそのまま使えるよう、派生値もここでまとめて返す。
  return {
    tasks,
    users,
    currentUser,
    connected,
    conflict,
    logs,
    draftTitles,
    newTitle,
    completedCount: tasks.filter((task) => task.completed).length,
    pendingCount: Object.keys(pending).length,
    setNewTitle,
    getPendingForTask,
    getEditorsForTask,
    submitNewTask,
    toggleTask,
    deleteTask: mutations.deleteTask,
    resolveConflict,
    ...editingCommands
  };
}

/** `useTodoViewModel` が返す画面用 view model の型。 */
export type TodoViewModel = ReturnType<typeof useTodoViewModel>;
