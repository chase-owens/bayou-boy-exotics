type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function AdminCard({ children, className = "" }: Props) {
  return (
    <section className={`admin-card p-6 ${className}`}>{children}</section>
  );
}
