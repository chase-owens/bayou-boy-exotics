export default function TeamBayouCard() {
  return (
    <section className="admin-card p-6">
      <p className="admin-eyebrow">Team Bayou</p>

      <div className="mt-2 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl">Team Accounts</h2>
          <p className="mt-2 text-sm text-white/70">
            Manage admins and managers.
          </p>
        </div>

        <button className="rounded-vintage border border-accent px-4 py-2 text-sm font-semibold text-accent">
          Add Team Member
        </button>
      </div>
    </section>
  );
}
