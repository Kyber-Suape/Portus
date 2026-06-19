export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatRelativeToNow(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);

  const divisions: [Intl.RelativeTimeFormatUnit, number][] = [
    ["minute", 60],
    ["hour", 24],
    ["day", 30],
    ["month", 12],
    ["year", Infinity],
  ];

  let duration = diffMinutes;
  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

  for (const [unit, amount] of divisions) {
    if (Math.abs(duration) < amount) {
      return rtf.format(Math.round(duration), unit);
    }
    duration /= amount;
  }
  return rtf.format(Math.round(duration), "year");
}

/** Formato "14:23 - 22 out 2026", usado nos cards de evidência. */
export function formatEvidenceTimestamp(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const time = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(date);
  const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(date);
  return `${time} - ${day}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}
