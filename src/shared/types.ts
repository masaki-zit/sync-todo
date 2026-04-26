/** クライアントとサーバーで共有するデータ構造と Socket.IO の契約を定義するファイル。 */
/** タスクに対して編集可能なフィールド。 */
export type TaskField = "title" | "completed";

/** 同期対象となる TODO タスク。 */
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

/** 接続中のクライアント利用者。 */
export interface ClientUser {
  id: string;
  name: string;
  color: string;
  connectedAt: string;
}

/** どの利用者がどのタスクを編集中かを表す状態。 */
export interface EditingState {
  taskId: string;
  userId: string;
  field: TaskField;
  startedAt: string;
}

/** タスク更新時に変更対象となる差分。 */
export type TaskPatch = Partial<Pick<Task, "title" | "completed">>;

/** サーバー応答待ちの楽観更新情報。 */
export interface PendingMutation {
  mutationId: string;
  taskId: string;
  payload: TaskPatch;
  baseVersion: number;
  createdAt: string;
}

/** 接続時にクライアントから送る利用者プロフィール。 */
export interface JoinUserPayload {
  name: string;
  color: string;
}

/** 初回接続時にサーバーから送る全体スナップショット。 */
export interface SnapshotPayload {
  tasks: Task[];
  users: ClientUser[];
  editing: EditingState[];
  currentUser: ClientUser;
}

/** タスク作成要求のペイロード。 */
export interface CreateTaskPayload {
  mutationId: string;
  optimisticId: string;
  title: string;
}

/** タスク更新要求のペイロード。 */
export interface UpdateTaskPayload {
  mutationId: string;
  taskId: string;
  patch: TaskPatch;
  baseVersion: number;
}

/** タスク削除要求のペイロード。 */
export interface DeleteTaskPayload {
  mutationId: string;
  taskId: string;
  baseVersion: number;
}

/** 編集開始・終了を通知するペイロード。 */
export interface EditingPayload {
  taskId: string;
  field: TaskField;
  isEditing: boolean;
}

/** タスク作成・更新成功時に返す結果。 */
export interface TaskMutationResult {
  mutationId: string;
  task: Task;
  optimisticId?: string;
}

/** タスク削除成功時に返す結果。 */
export interface DeleteTaskResult {
  mutationId: string;
  taskId: string;
}

/** 競合検知時にクライアントへ返す情報。 */
export interface ConflictPayload {
  mutationId: string;
  taskId: string;
  localPatch: TaskPatch;
  serverTask: Task;
  baseVersion: number;
}

/** 競合解決時にクライアントから送る選択内容。 */
export interface ConflictResolvePayload {
  mutationId: string;
  taskId: string;
  strategy: "use-local" | "use-server";
  localPatch?: TaskPatch;
}

/** サーバーからクライアントへ配信するイベント一覧。 */
export interface ServerToClientEvents {
  snapshot: (payload: SnapshotPayload) => void;
  "task:created": (payload: TaskMutationResult) => void;
  "task:updated": (payload: TaskMutationResult) => void;
  "task:deleted": (payload: DeleteTaskResult) => void;
  "presence:changed": (payload: { users: ClientUser[] }) => void;
  "editing:changed": (payload: { editing: EditingState[] }) => void;
  "task:conflict": (payload: ConflictPayload) => void;
}

/** クライアントからサーバーへ送信するイベント一覧。 */
export interface ClientToServerEvents {
  "user:join": (payload: JoinUserPayload) => void;
  "task:create": (payload: CreateTaskPayload) => void;
  "task:update": (payload: UpdateTaskPayload) => void;
  "task:delete": (payload: DeleteTaskPayload) => void;
  "task:editing": (payload: EditingPayload) => void;
  "conflict:resolve": (payload: ConflictResolvePayload) => void;
}
