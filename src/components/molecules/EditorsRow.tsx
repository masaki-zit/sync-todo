/** 同じタスクを編集中の他ユーザーを横並びで表示するファイル。 */
import { MousePointer2 } from "lucide-react";
import type { ClientUser } from "../../shared/types";

/** `EditorsRow` に渡す編集中ユーザー一覧。 */
interface EditorsRowProps {
  editors: ClientUser[];
}

/**
 * 他ユーザーの編集中表示を必要なときだけ描画する。
 * @param props 編集中ユーザー一覧
 * @returns 編集者表示行
 */
export function EditorsRow({ editors }: EditorsRowProps) {
  if (editors.length === 0) {
    return null;
  }

  return (
    <div className="editor-row">
      <MousePointer2 size={14} />
      {editors.map((user) => (
        <span className="editor-chip" key={user.id} style={{ borderColor: user.color }}>
          {user.name}
        </span>
      ))}
    </div>
  );
}
