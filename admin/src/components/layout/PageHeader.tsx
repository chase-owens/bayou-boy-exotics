type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: Props) {
  return (
    <div className="mb-8 flex items-start justify-between gap-6">
      <div>
        {eyebrow && <p className="admin-eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 text-4xl text-gray-600">{title}</h1>
        {description && <p className="mt-2 text-muted">{description}</p>}
      </div>

      {action}
    </div>
  );
}
