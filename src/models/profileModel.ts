import type { JoinUserPayload } from "../shared/types";

const STORAGE_KEY = "sync-todo-profile";
const NAMES = ["Aki", "Ren", "Mio", "Sora", "Yui", "Kai"];
const COLORS = ["#0f766e", "#2563eb", "#c2410c", "#7c3aed", "#15803d", "#be123c"];

export function readOrCreateProfile(): JoinUserPayload {
  const saved = window.sessionStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved) as JoinUserPayload;
  }

  const profile: JoinUserPayload = {
    name: `${pick(NAMES)}-${Math.floor(Math.random() * 90 + 10)}`,
    color: pick(COLORS)
  };
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  return profile;
}

function pick(values: string[]) {
  return values[Math.floor(Math.random() * values.length)];
}
