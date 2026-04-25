import { MousePointer2 } from "lucide-react";
import type { ClientUser } from "../../shared/types";

interface EditorsRowProps {
  editors: ClientUser[];
}

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
