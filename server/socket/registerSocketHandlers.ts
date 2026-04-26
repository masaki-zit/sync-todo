/** 接続時に presence 系と task 系イベントをまとめて登録するファイル。 */
import type { SocketContext } from "./context";
import { registerPresenceEvents } from "./presenceEvents";
import { registerTaskEvents } from "./taskEvents";

/**
 * 新規接続ソケットへ必要なイベント群を登録する。
 * @param context サービス群を含むソケットコンテキスト
 */
export function registerSocketHandlers(context: SocketContext) {
  context.io.on("connection", (socket) => {
    registerPresenceEvents(socket, context);
    registerTaskEvents(socket, context);
  });
}
