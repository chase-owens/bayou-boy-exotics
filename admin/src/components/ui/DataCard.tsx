import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  icon: LucideIcon;
  children: ReactNode;
  isMinimal?: boolean;
  className?: string;
};

export default function DataCard({
  eyebrow,
  icon: Icon,
  children,
  isMinimal = false,
  className = "",
}: Props) {
  return (
    <section
      className={[
        "rounded-vintage border p-5",
        isMinimal
          ? "border-border bg-white/95 text-foreground shadow-sm"
          : "border-white/10 bg-surface/80 text-white shadow-soft backdrop-blur",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <Icon className="size-5 text-highlight" />
        <p className="admin-eyebrow">{eyebrow}</p>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}
