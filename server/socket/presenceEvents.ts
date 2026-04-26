/** 接続参加と切断に伴う presence 系イベント処理を定義するファイル。 */
import type { SocketContext } from "./context";
import type { TodoSocket } from "./types";

/**
 * presence 関連イベントをソケットへ登録する。
 * @param socket 登録対象ソケット
 * @param context サービス群を含むソケットコンテキスト
 */
export function registerPresenceEvents(socket: TodoSocket, context: SocketContext) {
  socket.on("user:join", (payload) => {
    const user = context.presence.join(socket.id, payload);

    // 参加直後のクライアントには全体状態を先に返し、その後で他者向けの presence 更新を流す。
    socket.emit("snapshot", {
      tasks: context.tasks.tasks(),
      users: context.presence.users(),
      editing: context.tasks.editing(),
      currentUser: user
    });
    context.io.emit("presence:changed", { users: context.presence.users() });
  });

  socket.on("disconnect", () => {
    context.presence.leave(socket.id);
    context.io.emit("presence:changed", { users: context.presence.users() });
    context.io.emit("editing:changed", { editing: context.tasks.editing() });
  });
}
