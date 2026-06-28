<script lang="ts">
	import type { Announcement } from '../../../../shared/types/Home';

	type Props = {
		announcement: Announcement;
	};

	let { announcement }: Props = $props();

	const priorityLabel: Record<string, string> = {
		info: 'Update',
		important: 'Important',
		urgent: 'Read First'
	};

	const formatDate = (value: string) =>
		new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		}).format(new Date(value));
</script>

<section class="rounded-vintage border border-border bg-surface p-6 shadow-soft">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
		<div>
			<p class="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
				{priorityLabel[announcement.priority] ?? 'Update'}
			</p>

			<h2 class="mt-2 text-2xl font-bold">
				{announcement.title}
			</h2>
		</div>

		<p class="text-sm text-muted">
			Updated {formatDate(announcement.updatedAt)}
		</p>
	</div>

	<p class="mt-4 text-base font-medium text-foreground">
		{announcement.summary}
	</p>

	<p class="mt-3 whitespace-pre-line leading-7 text-muted">
		{announcement.body}
	</p>
</section>
