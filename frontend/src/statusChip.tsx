import { Chip } from "@mui/material";

/** Смысл статуса — один на весь интерфейс (см. tokens.css). */
export type StatusTone = "ok" | "warn" | "bad" | "info" | "idle";

type ReportLike = {
  status: string;
  all_rows_failed?: boolean;
  has_errors?: boolean;
  failed_rows?: number | null;
};

/**
 * Оранжевый — идёт работа или пауза, зелёный — готово, синий — очередь,
 * красный — ошибка, серый — отменено. Готовый отчёт с ошибками строк — оранжевый.
 */
export function reportTone(report: ReportLike): StatusTone {
  if (report.all_rows_failed || report.status === "failed") return "bad";
  if (report.status === "completed") return report.has_errors || report.failed_rows ? "warn" : "ok";
  if (report.status === "running" || report.status === "paused") return "warn";
  if (report.status === "queued") return "info";
  return "idle";
}

export function StatusChip({ label, tone, live = false, line = false, title }: {
  label: string;
  tone: StatusTone;
  /** Мигающая точка: процесс идёт прямо сейчас. */
  live?: boolean;
  /** Контурный вид: состояние без активности (пауза). */
  line?: boolean;
  title?: string;
}) {
  const className = ["status-chip", `tone-${tone}`, live ? "live" : "", line ? "line" : ""].filter(Boolean).join(" ");
  return <Chip size="small" label={label} title={title} className={className} />;
}

/** Чип статуса отчёта: работа идёт — точка мигает, пауза — контур. */
export function ReportStatusChip({ report, label, title }: { report: ReportLike; label: string; title?: string }) {
  return <StatusChip
    label={label}
    title={title}
    tone={reportTone(report)}
    live={report.status === "running"}
    line={report.status === "paused"}
  />;
}
