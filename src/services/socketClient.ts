import { io, type Socket } from "socket.io-client";
import { SOCKET_URL } from "../config";
import type { ClientToServerEvents, ServerToClientEvents } from "../shared/types";

export type TodoSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function createTodoSocket() {
  return io(SOCKET_URL, {
    transports: ["websocket", "polling"]
  }) as TodoSocket;
}
