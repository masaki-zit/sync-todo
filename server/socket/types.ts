/** サーバー側 Socket.IO の型別名をまとめるファイル。 */
import type { Server, Socket } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "../../src/shared/types";

/** TODO アプリで使う Socket.IO サーバー型。 */
export type TodoServer = Server<ClientToServerEvents, ServerToClientEvents>;
/** TODO アプリで使う Socket.IO ソケット型。 */
export type TodoSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
