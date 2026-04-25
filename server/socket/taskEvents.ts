import type { SocketContext } from "./context";
import type { TodoSocket } from "./types";

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
      socket.emit("task:updated", update);
    } else {
      context.io.emit("task:updated", update);
    }
  });
}
