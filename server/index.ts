/** サーバー起動時の依存関係を組み立て、Socket.IO を立ち上げるエントリーファイル。 */
import { Server } from "socket.io";
import { PORT, STARTED_AT } from "./config";
import { createSeedTasks } from "./domain/seedTasks";
import { createHttpServer } from "./http/createHttpServer";
import { createMemoryTodoRepository } from "./repositories/memoryTodoRepository";
import { createPresenceService } from "./services/presenceService";
import { createTaskService } from "./services/taskService";
import { registerSocketHandlers } from "./socket/registerSocketHandlers";
import type { TodoServer } from "./socket/types";

const httpServer = createHttpServer(STARTED_AT);
const io: TodoServer = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

const repository = createMemoryTodoRepository(createSeedTasks());
const presence = createPresenceService(repository);
const tasks = createTaskService({
  ensureUser: presence.ensureUser,
  repository
});

registerSocketHandlers({ io, presence, tasks });

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server listening on http://localhost:${PORT}`);
});
