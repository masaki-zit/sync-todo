import { createServer } from "node:http";

export function createHttpServer(startedAt: string) {
  return createServer((request, response) => {
    if (request.url === "/health") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ ok: true, startedAt }));
      return;
    }

    response.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    response.end("Realtime Sync Todo Socket.IO server is running.\n");
  });
}
