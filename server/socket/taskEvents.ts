/** タスク関連イベントの受信処理と配信範囲制御を定義するファイル。 */
import type { SocketContext } from "./context";
import type { TodoSocket } from "./types";

/**
 * タスク関連イベントをソケットへ登録する。
 * @param socket 登録対象ソケット
 * @param context サービス群を含むソケットコンテキスト
 */
export function registerTaskEvents(socket: TodoSocket, context: SocketContext) {
  socket.on("task:create", (payload) => {
    context.io.emit("task:created", context.tasks.createTask(socket.id, payload));
  });

  socket.on("task:update", (payload) => {
    const result = context.tasks.updateTask(socket.id, payload);
    if (!result) {
      return;
    }

    if (result.kind === "conflict") {
      // 競合通知は要求元だけに返し、他ユーザーの操作を不必要に遮らない。
      socket.emit("task:conflict", result.conflict);
      return;
    }

    context.io.emit("task:updated", {
      mutationId: result.mutationId,
      task: result.task
    });
  });

  socket.on("task:delete", (payload) => {
    const result = context.tasks.deleteTask(payload);
    if (!result) {
      return;
    }

    context.io.emit("task:deleted", result);
    context.io.emit("editing:changed", { editing: context.tasks.editing() });
  });

  socket.on("task:editing", (payload) => {
    if (!context.tasks.setEditing(socket.id, payload)) {
      return;
    }

    context.io.emit("editing:changed", { editing: context.tasks.editing() });
  });

  socket.on("conflict:resolve", (payload) => {
    const result = context.tasks.resolveConflict(socket.id, payload);
    if (!result) {
      return;
    }

    const update = { mutationId: result.mutationId, task: result.task };
    if (result.scope === "socket") {
      // サーバー版採用では共有状態が変わらないため、要求元だけ補正すればよい。
      socket.emit("task:updated", update);
    } else {
      context.io.emit("task:updated", update);
    }
  });
}
