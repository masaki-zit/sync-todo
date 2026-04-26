/** 競合発生時に解決方針を選ばせるモーダルを定義するファイル。 */
import { Save, Undo2, X } from "lucide-react";
import type { ConflictPayload } from "../../shared/types";
import { ActionButton } from "../atoms/ActionButton";
import { IconButton } from "../atoms/IconButton";

/** `ConflictModal` に渡す競合状態と操作群。 */
interface ConflictModalProps {
  conflict: ConflictPayload;
  onClose: () => void;
  onResolve: (strategy: "use-local" | "use-server") => void;
}

/**
 * サーバー版とローカル版の差分を見せ、解決方針を選ばせる。
 * @param props 競合状態と解決操作
 * @returns 競合解決モーダル
 */
export function ConflictModal({ conflict, onClose, onResolve }: ConflictModalProps) {
  // サーバー版の形を流用してローカル案を作ることで、比較 UI を同じ構造で描画する。
  const localTask = {
    ...conflict.serverTask,
    ...conflict.localPatch
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="conflict-modal" role="dialog" aria-modal="true" aria-labelledby="conflict-title">
        <div className="modal-heading">
          <div>
            <p className="eyebrow">version conflict</p>
            <h2 id="conflict-title">編集が競合しました</h2>
          </div>
          <IconButton aria-label="閉じる" icon={<X size={18} />} onClick={onClose} title="閉じる" />
        </div>

        <div className="conflict-grid">
          <ConflictOption
            label="サーバーの状態"
            title={conflict.serverTask.title}
            status={conflict.serverTask.completed ? "完了" : "未完了"}
            version={`v${conflict.serverTask.version}`}
          />
          <ConflictOption
            label="自分の変更"
            title={localTask.title}
            status={localTask.completed ? "完了" : "未完了"}
            version={`base v${conflict.baseVersion}`}
          />
        </div>

        <div className="modal-actions">
          <ActionButton icon={<Undo2 size={18} />} onClick={() => onResolve("use-server")} variant="secondary">
            サーバーを採用
          </ActionButton>
          <ActionButton icon={<Save size={18} />} onClick={() => onResolve("use-local")}>
            自分の変更で上書き
          </ActionButton>
        </div>
      </section>
    </div>
  );
}

/** 競合比較用カード 1 件分の表示データ。 */
interface ConflictOptionProps {
  label: string;
  status: string;
  title: string;
  version: string;
}

/**
 * 競合解決モーダル内の比較項目を 1 件表示する。
 * @param props 表示ラベルとタスク状態
 * @returns 比較項目
 */
function ConflictOption({ label, status, title, version }: ConflictOptionProps) {
  return (
    <div className="conflict-option">
      <span>{label}</span>
      <strong>{title}</strong>
      <small>
        {status} / {version}
      </small>
    </div>
  );
}
