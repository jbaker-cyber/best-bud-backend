import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "primary";

const tones: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/20 text-warning-foreground border-warning/40",
  danger: "bg-destructive/12 text-destructive border-destructive/30",
  info: "bg-info/15 text-info border-info/30",
  primary: "bg-primary/15 text-primary border-primary/30",
};

const map: Record<string, Tone> = {
  Pending: "warning",
  Accepted: "info",
  Confirmed: "info",
  "In Progress": "primary",
  Completed: "success",
  Cancelled: "danger",
  Paid: "success",
  Failed: "danger",
  Refunded: "neutral",
  active: "success",
  pending: "warning",
  suspended: "danger",
  Open: "info",
  Resolved: "success",
  Closed: "neutral",
  Sent: "success",
  Scheduled: "info",
  Draft: "neutral",
  Low: "neutral",
  Medium: "info",
  High: "warning",
  Urgent: "danger",
};

export function StatusPill({ value }: { value: string }) {
  const tone = map[value] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        tones[tone]
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {value}
    </span>
  );
}
