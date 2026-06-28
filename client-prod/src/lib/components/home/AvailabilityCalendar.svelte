<script lang="ts">
	import Calendar from '$lib/assets/icons/Calendar.svelte';

	import type { AvailabilityCalendarDay } from '$lib/utils/buildAvailabilityCalendar';

	type CalendarProps = {
		days: AvailabilityCalendarDay[];
		leadingBlanks: number;
		monthName: string;
		upcoming: { label: string; value: string }[];
	};

	let { days, leadingBlanks, monthName, upcoming }: CalendarProps = $props();
</script>

<section class="rounded-vintage border border-border bg-surface p-5 shadow-soft">
	<div class="mb-5 flex items-start justify-between gap-4">
		<div>
			<p class="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
				Availability Calendar
			</p>

			<h2 class="mt-2 text-3xl font-bold text-foreground">
				{monthName}
			</h2>
		</div>

		<div class="rounded-vintage border border-border bg-background/40 p-3 text-accent">
			<Calendar class="size-6" />
		</div>
	</div>

	<div class="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
		<div>
			<div class="mb-3 grid grid-cols-7 text-center text-[0.65rem] font-bold uppercase text-muted">
				<span>Sun</span>
				<span>Mon</span>
				<span>Tue</span>
				<span>Wed</span>
				<span>Thu</span>
				<span>Fri</span>
				<span>Sat</span>
			</div>

			<div class="grid grid-cols-7 gap-2 text-center">
				{#each Array(leadingBlanks) as _}
					<div></div>
				{/each}

				{#each days as day}
					<div
						class={[
							'flex aspect-square items-center justify-center rounded-sm text-sm font-semibold',
							day.status === 'closed' && 'bg-black/40 text-muted',
							day.status === 'partial' && 'bg-accent/50 text-primary',
							day.status === 'open' && 'text-foreground'
							// day.isToday && 'bg-highlight text-white'
						]
							.filter(Boolean)
							.join(' ')}
					>
						{day.dayNumber}
					</div>
				{/each}
			</div>
		</div>

		<div class="border-border lg:border-l lg:pl-6">
			<div class="space-y-3">
				<div class="flex items-center gap-3 text-sm text-foreground">
					<span class="size-4 rounded-full bg-black/70"></span>
					<span>Closed All Day</span>
				</div>

				<div class="flex items-center gap-3 text-sm text-foreground">
					<span class="size-4 rounded-full bg-accent"></span>
					<span>Partial Day Closure</span>
				</div>

				<div class="flex items-center gap-3 text-sm text-foreground">
					<span class="size-4 rounded-full bg-highlight"></span>
					<span>Open</span>
				</div>
			</div>

			<div class="my-5 border-t border-border"></div>

			<h3 class="mb-4 text-lg font-semibold text-foreground">Coming Up</h3>

			<div class="space-y-3">
				{#each upcoming as item}
					<div class="grid grid-cols-[90px_1fr] gap-4 text-sm">
						<p class="font-semibold text-foreground">{item.label}</p>
						<p class="text-muted">{item.value}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
