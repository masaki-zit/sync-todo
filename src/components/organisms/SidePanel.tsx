/** 共同編集ユーザーと同期ログをまとめて表示する補助パネル用ファイル。 */
import { Clock3, Users } from "lucide-react";
import { formatTime } from "../../models/time";
import type { ClientUser } from "../../shared/types";
import type { SyncLog } from "../../viewModels/useSyncLogs";

/** `SidePanel` に渡す補助情報。 */
interface SidePanelProps {
  currentUser: ClientUser | null;
  logs: SyncLog[];
  users: ClientUser[];
}

/**
 * 接続中ユーザー一覧と同期ログ一覧を表示する。
 * @param props 補助表示に必要なユーザー情報とログ
 * @returns サイドパネル
 */
export function SidePanel({ currentUser, logs, users }: SidePanelProps) {
  return (
    <aside className="side-panel">
      <section className="panel-section">
        <div className="panel-heading">
          <Users size={18} />
          <h2>オンライン</h2>
        </div>
        <div className="user-list">
          {users.map((user) => (
            <div className="user-row" key={user.id}>
              <span className="avatar-dot" style={{ background: user.color }} />
              <div>
                <strong>{user.name}</strong>
                <small>{user.id === currentUser?.id ? "you" : "collaborator"}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel-section">
        <div className="panel-heading">
          <Clock3 size={18} />
          <h2>同期ログ</h2>
        </div>
        <div className="log-list">
          {logs.map((log) => (
            <div className={`log-row is-${log.tone}`} key={log.id}>
              <span>{formatTime(log.createdAt)}</span>
              <p>{log.text}</p>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
