/** 接続ユーザーの参加・離脱・補完を扱う presence サービスを定義するファイル。 */
import type { ClientUser, JoinUserPayload } from "../../src/shared/types";
import { colorFromId } from "../domain/colors";
import { cleanName } from "../domain/sanitize";
import type { MemoryTodoRepository } from "../repositories/memoryTodoRepository";

/**
 * presence 管理サービスを生成する。
 * @param repository ユーザー状態を保存するリポジトリ
 * @returns presence 操作群
 */
export function createPresenceService(repository: MemoryTodoRepository) {
  /**
   * 接続ユーザーを登録する。
   * @param socketId 接続ソケット ID
   * @param payload 利用者プロフィール
   * @returns 登録後のユーザー情報
   */
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

  /**
   * 接続ユーザーを削除し、関連する編集中状態も掃除する。
   * @param socketId 切断したソケット ID
   */
  function leave(socketId: string) {
    repository.deleteUser(socketId);
    repository.deleteEditingWhere((state) => state.userId === socketId);
  }

  /**
   * 既存ユーザーを返し、未登録ならゲストユーザーとして補完する。
   * @param socketId 対象ソケット ID
   * @returns 対応するユーザー情報
   */
  function ensureUser(socketId: string) {
    const knownUser = repository.getUser(socketId);
    if (knownUser) {
      return knownUser;
    }

    // join より先にイベントが来ても破綻しないよう、最低限のゲストユーザーを補完する。
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

/** `createPresenceService` が返す presence サービスの型。 */
export type PresenceService = ReturnType<typeof createPresenceService>;
