import type { PresenceService } from "../services/presenceService";
import type { TaskService } from "../services/taskService";
import type { TodoServer } from "./types";

export interface SocketContext {
  io: TodoServer;
  presence: PresenceService;
  tasks: TaskService;
}
