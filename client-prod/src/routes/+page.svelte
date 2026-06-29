<script lang="ts">
	import Hero from '$lib/components/home/Hero.svelte';
	import HoursSection from '$lib/components/ui/HoursSection.svelte';
	import LatestUpdate from '$lib/components/LatestUpdate.svelte';
	import RaffleCard from '$lib/components/home/RaffleCard.svelte';
	import AvailabilityCalendar from '$lib/components/home/AvailabilityCalendar.svelte';
	import MeetTimesCard from '$lib/components/home/MeetTimesCard.svelte';
	import { buildMeetTimesCard } from '$lib/utils/buildMeetTimesCard.js';
	import { buildAvailabilityCalendar } from '$lib/utils/buildAvailabilityCalendar.js';

	let { data } = $props();

	const { home, raffle, root } = $derived(data);

	const { closedMessage, meetTimesDisplay } = $derived(
		buildMeetTimesCard({ hours: root.business.hours, ...data.availability })
	);
</script>

<div class="flex flex-col gap-3">
	<Hero hero={home.hero} />
	{#if closedMessage}
		<div class="mt-3 rounded-vintage border border-accent/30 bg-background/40 px-4 py-3">
			<p class="text-sm leading-6 text-foreground">
				{closedMessage}
			</p>
		</div>
	{/if}
	{#if meetTimesDisplay}<MeetTimesCard {meetTimesDisplay} />{/if}
	<AvailabilityCalendar
		{...buildAvailabilityCalendar({ hours: root.business.hours, ...data.availability })}
	/>
	{#if raffle.enabled}
		<RaffleCard {raffle} />
	{/if}

	<!-- <CategoryLinks categories={home.featuredCategories ?? []} /> -->
</div>
