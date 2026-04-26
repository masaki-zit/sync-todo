/** 接続状態を小さなバッジで見せる表示部品を定義するファイル。 */
import { Wifi, WifiOff } from "lucide-react";

/** `ConnectionPill` に渡す接続状態。 */
interface ConnectionPillProps {
  connected: boolean;
}

/**
 * オンライン・オフライン状態をコンパクトに表示する。
 * @param props 接続状態
 * @returns 接続状態バッジ
 */
export function ConnectionPill({ connected }: ConnectionPillProps) {
  return (
    <div className={`connection-pill ${connected ? "is-online" : "is-offline"}`}>
      {connected ? <Wifi size={18} /> : <WifiOff size={18} />}
      <span>{connected ? "online" : "offline"}</span>
    </div>
  );
}
