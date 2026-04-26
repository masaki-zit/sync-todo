/** ソケットイベント登録時に共有するサービス群を定義するファイル。 */
import type { PresenceService } from "../services/presenceService";
import type { TaskService } from "../services/taskService";
import type { TodoServer } from "./types";

/** 各イベント登録関数へ渡す依存関係の束。 */
export interface SocketContext {
  io: TodoServer;
  presence: PresenceService;
  tasks: TaskService;
}
