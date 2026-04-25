export type TaskField = "title" | "completed";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ClientUser {
  id: string;
  name: string;
  color: string;
  connectedAt: string;
}

export interface EditingState {
  taskId: string;
  userId: string;
  field: TaskField;
  startedAt: string;
}

export type TaskPatch = Partial<Pick<Task, "title" | "completed">>;

export interface PendingMutation {
  mutationId: string;
  taskId: string;
  payload: TaskPatch;
  baseVersion: number;
  createdAt: string;
}

export interface JoinUserPayload {
  name: string;
  color: string;
}

export interface SnapshotPayload {
  tasks: Task[];
  users: ClientUser[];
  editing: EditingState[];
  currentUser: ClientUser;
}

export interface CreateTaskPayload {
  mutationId: string;
  optimisticId: string;
  title: string;
}

export interface UpdateTaskPayload {
  mutationId: string;
  taskId: string;
  patch: TaskPatch;
  baseVersion: number;
}

export interface DeleteTaskPayload {
  mutationId: string;
  taskId: string;
  baseVersion: number;
}

export interface EditingPayload {
  taskId: string;
  field: TaskField;
  isEditing: boolean;
}

export interface TaskMutationResult {
  mutationId: string;
  task: Task;
  optimisticId?: string;
}

export interface DeleteTaskResult {
  mutationId: string;
  taskId: string;
}

export interface ConflictPayload {
  mutationId: string;
  taskId: string;
  localPatch: TaskPatch;
  serverTask: Task;
  baseVersion: number;
}

export interface ConflictResolvePayload {
  mutationId: string;
  taskId: string;
  strategy: "use-local" | "use-server";
  localPatch?: TaskPatch;
}

export interface ServerToClientEvents {
  snapshot: (payload: SnapshotPayload) => void;
  "task:created": (payload: TaskMutationResult) => void;
  "task:updated": (payload: TaskMutationResult) => void;
  "task:deleted": (payload: DeleteTaskResult) => void;
  "presence:changed": (payload: { users: ClientUser[] }) => void;
  "editing:changed": (payload: { editing: EditingState[] }) => void;
  "task:conflict": (payload: ConflictPayload) => void;
}

export interface ClientToServerEvents {
  "user:join": (payload: JoinUserPayload) => void;
  "task:create": (payload: CreateTaskPayload) => void;
  "task:update": (payload: UpdateTaskPayload) => void;
  "task:delete": (payload: DeleteTaskPayload) => void;
  "task:editing": (payload: EditingPayload) => void;
  "conflict:resolve": (payload: ConflictResolvePayload) => void;
}
