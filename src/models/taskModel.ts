import type { ClientUser, EditingState, PendingMutation, Task } from "../shared/types";

export function upsertTask(tasks: Task[], task: Task) {
  const exists = tasks.some((item) => item.id === task.id);
  return exists ? tasks.map((item) => (item.id === task.id ? task : item)) : [task, ...tasks];
}

export function sortTasks(tasks: Task[]) {
  return [...tasks].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function dropMutation(pending: Record<string, PendingMutation>, mutationId: string) {
  const next = { ...pending };
  delete next[mutationId];
  return next;
}

export function removeTaskDraft<T>(drafts: Record<string, T>, taskId: string) {
  const next = { ...drafts };
  delete next[taskId];
  return next;
}

export function findPendingForTask(pending: Record<string, PendingMutation>, taskId: string) {
  return Object.values(pending).find((mutation) => mutation.taskId === taskId);
}

export function editorsForTask(
  editing: EditingState[],
  users: ClientUser[],
  taskId: string,
  currentUserId?: string
) {
  const editorIds = new Set(
    editing.filter((state) => state.taskId === taskId && state.userId !== currentUserId).map((state) => state.userId)
  );
  return users.filter((user) => editorIds.has(user.id));
}
