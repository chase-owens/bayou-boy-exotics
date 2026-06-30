<script lang="ts">
	import type { MeetTimesDisplay } from '$lib/utils/buildMeetTimesCard';
	import Watch from '../assets/icons/Watch.svelte';
	import SectionHeader from './layout/SectionHeader.svelte';

	type MeetTimeProps = {
		meetTimesDisplay: MeetTimesDisplay;
		selectedMeetTime?: string | null;
		onChange?: (meetTime: string) => void;
	};

	let { meetTimesDisplay, onChange, selectedMeetTime }: MeetTimeProps = $props();
	const { dayLabel, meets } = $derived(meetTimesDisplay);

	const title = $derived(
		dayLabel === 'today' ? "Today's remaining meet times" : "Tomorrow's meet times"
	);
</script>

<section class="rounded-vintage border border-border bg-black/70 p-5 shadow-soft">
	<SectionHeader eyebrow="meet times" {title} variant="clock" />

	{#if meets.length}
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
			{#each meetTimesDisplay?.meets ?? [] as meet}
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
			<p class="text-sm text-muted">No remaining meet times today.</p>
		</div>
	{/if}
</section>
