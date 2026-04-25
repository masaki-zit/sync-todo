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

export function useTodoViewModel() {
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

  const submitNewTask = useCallback(() => {
    mutations.createTask(newTitle, () => setNewTitle(""));
  }, [mutations, newTitle]);

  const toggleTask = useCallback((task: Task) => {
    mutations.updateTask(task, { completed: !task.completed });
  }, [mutations]);

  const getPendingForTask = useCallback((taskId: string) => {
    return findPendingForTask(pending, taskId);
  }, [pending]);

  const getEditorsForTask = useCallback((taskId: string) => {
    return editorsForTask(editing, users, taskId, currentUser?.id);
  }, [currentUser?.id, editing, users]);

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

export type TodoViewModel = ReturnType<typeof useTodoViewModel>;
