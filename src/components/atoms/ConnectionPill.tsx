import { Wifi, WifiOff } from "lucide-react";

interface ConnectionPillProps {
  connected: boolean;
}

export function ConnectionPill({ connected }: ConnectionPillProps) {
  return (
    <div className={`connection-pill ${connected ? "is-online" : "is-offline"}`}>
      {connected ? <Wifi size={18} /> : <WifiOff size={18} />}
      <span>{connected ? "online" : "offline"}</span>
    </div>
  );
}
