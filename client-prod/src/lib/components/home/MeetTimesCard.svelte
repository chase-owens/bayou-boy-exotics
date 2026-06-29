<script lang="ts">
	import type { AvailableMeetingTime, MeetTimesDisplay } from '$lib/utils/buildMeetTimesCard';

	type MeetTimeProps = {
		meetTimesDisplay: MeetTimesDisplay;
	};

	let { meetTimesDisplay }: MeetTimeProps = $props();
	const { dayLabel, meets } = $derived(meetTimesDisplay);

	const title = $derived(
		dayLabel === 'today' ? "Today's remaining meet times" : "Tomorrow's meet times"
	);
</script>

<section class="rounded-vintage border border-border bg-black p-5 shadow-soft">
	<p class="text-xs font-semibold uppercase tracking-[0.3em] text-accent">meet times</p>

	<div class="mb-5">
		<h2 class="mt-2 text-3xl font-bold text-foreground capitalize">{title}</h2>
	</div>

	{#if meets.length}
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
			{#each meets as meet}
				<div class="rounded-vintage border border-border bg-background/40 px-4 py-3 text-center">
					<p class="font-semibold text-accent">{meet.label}</p>
				</div>
			{/each}
		</div>
	{:else}
		<div class="rounded-vintage border border-border bg-background/40 p-4">
			<p class="text-sm text-muted">No remaining meet times today.</p>
		</div>
	{/if}
</section>
