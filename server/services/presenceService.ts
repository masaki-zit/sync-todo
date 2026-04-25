import type { ClientUser, JoinUserPayload } from "../../src/shared/types";
import { colorFromId } from "../domain/colors";
import { cleanName } from "../domain/sanitize";
import type { MemoryTodoRepository } from "../repositories/memoryTodoRepository";

export function createPresenceService(repository: MemoryTodoRepository) {
  function join(socketId: string, payload: JoinUserPayload) {
    const user: ClientUser = {
      id: socketId,
      name: cleanName(payload.name),
      color: payload.color || colorFromId(socketId),
      connectedAt: new Date().toISOString()
    };

    repository.saveUser(user);
    return user;
  }

  function leave(socketId: string) {
    repository.deleteUser(socketId);
    repository.deleteEditingWhere((state) => state.userId === socketId);
  }

  function ensureUser(socketId: string) {
    const knownUser = repository.getUser(socketId);
    if (knownUser) {
      return knownUser;
    }

    const user: ClientUser = {
      id: socketId,
      name: "Guest",
      color: colorFromId(socketId),
      connectedAt: new Date().toISOString()
    };
    repository.saveUser(user);
    return user;
  }

  return {
    ensureUser,
    join,
    leave,
    users: () => repository.listUsers()
  };
}

export type PresenceService = ReturnType<typeof createPresenceService>;
