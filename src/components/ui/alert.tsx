import { type HTMLAttributes } from "react";
import { CheckCircle2, Info, AlertTriangle, OctagonAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertTone = "info" | "success" | "warning" | "danger";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: AlertTone;
  title?: string;
}

const TONE_CONFIG: Record<
  AlertTone,
  { icon: typeof Info; classes: string }
> = {
  info: { icon: Info, classes: "bg-primary-50 text-primary-800" },
  success: { icon: CheckCircle2, classes: "bg-success-50 text-success-600" },
  warning: { icon: AlertTriangle, classes: "bg-warning-50 text-warning-600" },
  danger: { icon: OctagonAlert, classes: "bg-danger-50 text-danger-600" },
};

export function Alert({
  className,
  tone = "info",
  title,
  children,
  ...props
}: AlertProps) {
  const { icon: Icon, classes } = TONE_CONFIG[tone];

  return (
    <div
      role={tone === "danger" || tone === "warning" ? "alert" : "status"}
      className={cn(
        "flex gap-3 rounded-lg p-4 text-sm",
        classes,
        className,
      )}
      {...props}
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      <div className="flex flex-col gap-0.5">
        {title && <p className="font-semibold">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}
