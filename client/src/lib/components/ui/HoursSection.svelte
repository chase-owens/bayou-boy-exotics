<script lang="ts">
	import { formatTime } from '$lib/utils/buildDateWithTime';
	import type { BusinessDayHours, Hours } from '../../../../../shared/types/Root';
	import Clock from '../../assets/icons/Clock.svelte';

	type Props = {
		hours: Hours;
	};

	let { hours }: Props = $props();

	const getDayHours = (day: BusinessDayHours) => {
		if (day.closed) return 'Closed';

		if (!day.opensAt || !day.closesAt) return 'Hours unavailable';

		return `${formatTime(day.opensAt)} - ${formatTime(day.closesAt)}`;
	};
</script>

<section class="  pt-4">
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<div>
				<p class="text-xs font-semibold tracking-[0.25em] text-secondary uppercase">Availability</p>

				<h2 class="mt-2 text-2xl font-bold">Current Hours</h2>
			</div>
			<div class="rounded-vintage border border-border p-2">
				<Clock class="h-8 text-secondary" />
			</div>
		</div>

		{#if hours.dailyBreaks?.length}
			<p class="text-sm text-muted">
				Daily break:
				{#each hours.dailyBreaks as dailyBreak, index (dailyBreak.startsAt)}
					<span class="font-medium text-foreground">
						{formatTime(dailyBreak.startsAt)} – {formatTime(dailyBreak.endsAt)}
					</span>{index < hours.dailyBreaks.length - 1 ? ', ' : ''}
				{/each}
			</p>
		{/if}
	</div>

	<div class="mt-5 grid overflow-hidden rounded-vintage border border-border sm:grid-cols-2">
		{#each hours.schedule as day (day.day)}
			<div class=" border border-border px-4 py-1">
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
</section>
