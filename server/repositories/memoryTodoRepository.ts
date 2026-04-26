/** メモリ上で TODO・ユーザー・編集中状態を保持するリポジトリを定義するファイル。 */
import type { ClientUser, EditingState, Task } from "../../src/shared/types";

/** インメモリ実装が提供する永続化操作の契約。 */
export interface MemoryTodoRepository {
  deleteEditing(key: string): void;
  deleteEditingWhere(predicate: (state: EditingState) => boolean): void;
  deleteTask(taskId: string): void;
  deleteUser(userId: string): void;
  getTask(taskId: string): Task | undefined;
  getUser(userId: string): ClientUser | undefined;
  hasTask(taskId: string): boolean;
  listEditing(): EditingState[];
  listTasks(): Task[];
  listUsers(): ClientUser[];
  saveEditing(key: string, state: EditingState): void;
  saveTask(task: Task): void;
  saveUser(user: ClientUser): void;
}

/**
 * 初期タスクを受け取ってインメモリリポジトリを生成する。
 * @param seedTasks 起動時に読み込む初期タスク一覧
 * @returns インメモリリポジトリ
 */
export function createMemoryTodoRepository(seedTasks: Task[] = []): MemoryTodoRepository {
  const users = new Map<string, ClientUser>();
  const tasks = new Map(seedTasks.map((task) => [task.id, task]));
  const editing = new Map<string, EditingState>();

  return {
    deleteEditing: (key) => editing.delete(key),
    deleteEditingWhere: (predicate) => {
      // 削除対象だけをその場で除去し、切断や削除のたびに Map 全体を作り直さない。
      for (const [key, state] of editing) {
        if (predicate(state)) {
          editing.delete(key);
        }
      }
    },
    deleteTask: (taskId) => tasks.delete(taskId),
    deleteUser: (userId) => users.delete(userId),
    getTask: (taskId) => tasks.get(taskId),
    getUser: (userId) => users.get(userId),
    hasTask: (taskId) => tasks.has(taskId),
    listEditing: () => [...editing.values()].sort((a, b) => a.startedAt.localeCompare(b.startedAt)),
    listTasks: () => [...tasks.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    listUsers: () => [...users.values()].sort((a, b) => a.connectedAt.localeCompare(b.connectedAt)),
    saveEditing: (key, state) => editing.set(key, state),
    saveTask: (task) => tasks.set(task.id, task),
    saveUser: (user) => users.set(user.id, user)
  };
}
