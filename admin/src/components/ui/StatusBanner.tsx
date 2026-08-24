import {
  CheckCircle2,
  CircleAlert,
  Info,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

type Status = "success" | "error" | "warning" | "info";

type Props = {
  status: Status;
  children: React.ReactNode;
};

const statusConfig: Record<
  Status,
  {
    Icon: LucideIcon;
    className: string;
  }
> = {
  success: {
    Icon: CheckCircle2,
    className: "admin-status-success",
  },
  error: {
    Icon: CircleAlert,
    className: "admin-status-error",
  },
  warning: {
    Icon: TriangleAlert,
    className: "admin-status-warning",
  },
  info: {
    Icon: Info,
    className: "admin-status-info",
  },
};

export default function StatusBanner({ status, children }: Props) {
  const { Icon, className } = statusConfig[status];

  return (
    <div className={`admin-status-banner ${className}`} role="status">
      <Icon className="size-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
