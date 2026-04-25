import type { Server, Socket } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "../../src/shared/types";

export type TodoServer = Server<ClientToServerEvents, ServerToClientEvents>;
export type TodoSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
