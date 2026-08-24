import { LoaderCircle } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  label: string;
  value: string | number;
  icon?: React.ElementType;
  actionLabel?: string;
  to?: string;
  isLoading?: boolean;
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  actionLabel,
  to,
  isLoading = false,
}: Props) {
  return (
    <div className="admin-card p-5">
      {Icon && <Icon className="mb-4 size-7 text-highlight" />}

      <div className="flex h-9 items-center text-3xl font-bold text-foreground">
        {isLoading ? (
          <LoaderCircle className="size-7 animate-spin text-accent" />
        ) : (
          value
        )}
      </div>

      <p className="mt-1 text-sm text-white">{label}</p>

      {actionLabel && to && (
        <Link
          to={to}
          className="mt-4 inline-flex text-sm font-semibold text-accent"
        >
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}
