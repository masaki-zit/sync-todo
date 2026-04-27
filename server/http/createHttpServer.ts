/** Socket.IO と併設する最小限の HTTP サーバーを生成するファイル。 */
import { createServer } from "node:http";
import express from "express";

/**
 * ヘルスチェック用エンドポイントを持つ HTTP サーバーを生成する。
 * @param startedAt サーバー起動時刻
 * @returns Node.js の HTTP サーバー
 */
export function createHttpServer(startedAt: string) {
  const app = express();

  app.get("/health", (_request, response) => {
    response.json({ ok: true, startedAt });
  });

  app.get("/", (_request, response) => {
    response.type("text/plain; charset=utf-8");
    response.send("Realtime Sync Todo Socket.IO server is running.\n");
  });

  return createServer(app);
}
