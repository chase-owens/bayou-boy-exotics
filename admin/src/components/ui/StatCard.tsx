type Props = {
  label: string;
  value: string | number;
  icon?: React.ElementType;
  actionLabel?: string;
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  actionLabel,
}: Props) {
  return (
    <div className="admin-card p-5">
      {Icon && <Icon className="mb-4 size-7 text-highlight" />}
      <div className="text-3xl font-bold text-foreground">{value}</div>
      <p className="mt-1 text-sm text-white">{label}</p>
      {actionLabel && (
        <p className="mt-4 text-sm font-semibold text-accent">
          {actionLabel} →
        </p>
      )}
    </div>
  );
}
