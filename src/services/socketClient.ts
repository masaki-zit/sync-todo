/** Socket.IO クライアントの生成方法と型を集約するファイル。 */
import { io, type Socket } from "socket.io-client";
import { SOCKET_URL } from "../config";
import type { ClientToServerEvents, ServerToClientEvents } from "../shared/types";

/** TODO アプリで使う Socket.IO クライアント型。 */
export type TodoSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

/**
 * TODO アプリ用の Socket.IO クライアントを生成する。
 * @returns 型付け済みのソケットクライアント
 */
export function createTodoSocket() {
  return io(SOCKET_URL, {
    transports: ["websocket", "polling"]
  }) as TodoSocket;
}
