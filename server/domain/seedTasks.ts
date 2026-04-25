import { randomUUID } from "node:crypto";
import type { Task } from "../../src/shared/types";

export function createSeedTasks(): Task[] {
  const now = new Date().toISOString();

  return [
    buildSeedTask("Socket.IO のイベントを確認する", false, now),
    buildSeedTask("別タブで同じタスクを編集して競合を試す", false, now),
    buildSeedTask("presence と編集中表示を確認する", true, now)
  ];
}

function buildSeedTask(title: string, completed: boolean, now: string): Task {
  return {
    id: randomUUID(),
    title,
    completed,
    version: 1,
    createdAt: now,
    updatedAt: now,
    updatedBy: "system"
  };
}
