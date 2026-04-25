import { Save, Undo2, X } from "lucide-react";
import type { ConflictPayload } from "../../shared/types";
import { ActionButton } from "../atoms/ActionButton";
import { IconButton } from "../atoms/IconButton";

interface ConflictModalProps {
  conflict: ConflictPayload;
  onClose: () => void;
  onResolve: (strategy: "use-local" | "use-server") => void;
}

export function ConflictModal({ conflict, onClose, onResolve }: ConflictModalProps) {
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

interface ConflictOptionProps {
  label: string;
  status: string;
  title: string;
  version: string;
}

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
