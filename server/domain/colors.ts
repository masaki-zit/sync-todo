const COLORS = ["#0f766e", "#2563eb", "#c2410c", "#7c3aed", "#15803d", "#be123c"];

export function colorFromId(id: string) {
  const total = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return COLORS[total % COLORS.length];
}
