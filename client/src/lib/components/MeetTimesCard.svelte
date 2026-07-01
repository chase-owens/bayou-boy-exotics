<script lang="ts">
	import type { MeetTimesDisplay } from '$lib/utils/buildMeetTimesCard';
	import SectionHeader from './layout/SectionHeader.svelte';

	type MeetTimeProps = {
		meetTimesDisplay: MeetTimesDisplay | null;
		selectedMeetTime?: string | null;
		onChange?: (meetTime: string) => void;
	};

	const { meetTimesDisplay, onChange, selectedMeetTime }: MeetTimeProps = $props();

	const title = $derived(
		meetTimesDisplay === null
			? 'No meets today or tomorrow'
			: meetTimesDisplay.dayLabel === 'today'
				? "Today's remaining meet times"
				: "Tomorrow's meet times"
	);
</script>

<section class="rounded-vintage border border-border bg-black/70 p-5 shadow-soft">
	<SectionHeader eyebrow="meet times" {title} variant="clock" />
	{#if meetTimesDisplay?.meets.length}
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
			{#each meetTimesDisplay.meets as meet}
				<button
					type="button"
					class={[
						'rounded-vintage border px-4 py-4 font-semibold transition',
						selectedMeetTime === meet.label
							? 'border-accent bg-accent text-primary'
							: 'border-border bg-background/40 text-accent hover:border-accent'
					].join(' ')}
					onclick={() => onChange?.(meet.label)}
				>
					{meet.label}
				</button>
			{/each}
		</div>
	{:else}
		<div class="rounded-vintage border border-border bg-background/40 p-4">
			<p class="text-sm text-muted">Check Back Soon</p>
		</div>
	{/if}
</section>
