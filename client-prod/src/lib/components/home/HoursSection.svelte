<script lang="ts">
	import type { BusinessDayHours, Hours } from '../../../../../shared/types/Root';
	import Clock from '../../assets/icons/Clock.svelte';

	type Props = {
		hours: Hours;
	};

	let { hours }: Props = $props();

	const formatTime = (time?: string) => {
		if (!time) return '';

		const [hour, minute] = time.split(':').map(Number);
		const date = new Date();
		date.setHours(hour, minute, 0, 0);

		return new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: '2-digit'
		}).format(date);
	};

	const getDayHours = (day: BusinessDayHours) => {
		if (day.closed) return 'Closed';

		if (!day.opensAt || !day.closesAt) return 'Hours unavailable';

		return `${formatTime(day.opensAt)} – ${formatTime(day.closesAt)}`;
	};
</script>

<section class="rounded-vintage border border-border bg-surface p-4 shadow-soft">
	<div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
		<div class="flex justify-between items-center">
			<div>
				<p class="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Availability</p>

				<h2 class="mt-2 text-2xl font-bold">Current Hours</h2>
			</div>
			<div class="p-2 border rounded-vintage border-border"><Clock class="h-8 text-accent" /></div>
		</div>

		{#if hours.dailyBreaks?.length}
			<p class="text-sm text-muted">
				Daily break:
				{#each hours.dailyBreaks as dailyBreak, index}
					<span class="font-medium text-foreground">
						{formatTime(dailyBreak.startsAt)} – {formatTime(dailyBreak.endsAt)}
					</span>{index < hours.dailyBreaks.length - 1 ? ', ' : ''}
				{/each}
			</p>
		{/if}
	</div>

	<div class="mt-5 grid sm:grid-cols-2 rounded-vintage border border-border overflow-hidden">
		{#each hours.schedule as day}
			<div class=" border border-border bg-background px-4 py-1">
				<div class="flex items-center justify-between gap-4 text-sm">
					<p class="font-semibold">{day.day}</p>
					<p
						class:font-semibold={!day.closed}
						class:text-accent={!day.closed}
						class:text-muted={day.closed}
					>
						{getDayHours(day)}
					</p>
				</div>

				{#if day.note}
					<p class="mt-2 text-sm text-muted">{day.note}</p>
				{/if}
			</div>
		{/each}
	</div>

	<!-- {#if hours.temporaryOverrides?.length}
		<div class="mt-6 border-t border-border pt-5">
			<h3 class="text-lg font-semibold">Upcoming Closures / Changes</h3>

			<div class="mt-3 space-y-3">
				{#each hours.temporaryOverrides as override}
					<div class="rounded-vintage bg-background/50 p-4">
						<p class="font-medium">
							{override.note ?? 'Schedule change'}
						</p>

						{#if override.startsAt && override.endsAt}
							<p class="mt-1 text-sm text-muted">
								{new Date(override.startsAt).toLocaleString()} – {new Date(override.endsAt).toLocaleString()}
							</p>
						{:else if override.date}
							<p class="mt-1 text-sm text-muted">
								{override.date}
								{#if override.opensAt && override.closesAt}
									: {formatTime(override.opensAt)} – {formatTime(override.closesAt)}
								{/if}
							</p>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if} -->
</section>
