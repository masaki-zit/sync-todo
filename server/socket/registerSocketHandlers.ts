import type { SocketContext } from "./context";
import { registerPresenceEvents } from "./presenceEvents";
import { registerTaskEvents } from "./taskEvents";

export function registerSocketHandlers(context: SocketContext) {
  context.io.on("connection", (socket) => {
    registerPresenceEvents(socket, context);
    registerTaskEvents(socket, context);
  });
}
