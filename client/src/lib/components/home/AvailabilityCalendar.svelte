<script lang="ts">
	import type { AvailabilityCalendarDay } from '$lib/utils/buildAvailabilityCalendar';
	import getRandomBrandImage from '$lib/utils/getRandomBrandImage';
	import SectionHeader from '../layout/SectionHeader.svelte';

	export type CalendarProps = {
		days: AvailabilityCalendarDay[];
		leadingBlanks: number;
		monthName: string;
		upcoming: { label: string; value: string }[];
	};

	let { days, leadingBlanks, monthName, upcoming }: CalendarProps = $props();
</script>

<section class="relative rounded-vintage border border-purple-400/70 bg-black/70 p-5 shadow-soft">
	<img
		src={getRandomBrandImage()}
		alt=""
		aria-hidden="true"
		class="absolute inset-0 h-full w-full object-cover opacity-20"
	/>
	<SectionHeader eyebrow="Availability Calendar" title={monthName} variant="calendar" />

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
							day.status === 'closed' && 'bg-highlight/80 text-muted',
							day.status === 'partial' && 'bg-secondary/80',
							day.status === 'open' && 'text-foreground border border-border'
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
					<span class="size-4 rounded-full bg-highlight/70"></span>
					<span>Closed All Day</span>
				</div>

				<div class="flex items-center gap-3 text-sm text-foreground">
					<span class="size-4 rounded-full bg-secondary"></span>
					<span>Partial Day Closure</span>
				</div>

				<!-- <div class="flex items-center gap-3 text-sm text-foreground">
					<span class="size-4 rounded-full bg-highlight"></span>
					<span>Open</span>
				</div> -->
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
