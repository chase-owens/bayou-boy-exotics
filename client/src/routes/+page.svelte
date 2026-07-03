<script lang="ts">
	import Hero from '$lib/components/home/Hero.svelte';
	import RaffleCard from '$lib/components/home/RaffleCard.svelte';
	import AvailabilityCalendar from '$lib/components/home/AvailabilityCalendar.svelte';
	import MeetTimesCard from '$lib/components/MeetTimesCard.svelte';
	import FeaturedDeals from '$lib/components/ui/FeaturedDeals.svelte';
	import ShopCta from '$lib/components/home/ShopCta.svelte';

	let { data } = $props();

	const { calendarProps, closedMessage, home, meetTimesDisplay } = $derived(data);
</script>

<svelte:head>
	<title>Bayou Boy Exotics</title>

	<meta name="description" content="Premium Products | Premium Service" />

	<meta property="og:title" content="Bayou Boy Exotics" />
	<meta property="og:description" content="Premium Products | Premium Service" />
	<meta property="og:image" content="https://d2uhik5lt0ieo8.cloudfront.net/images/menu-hero.png" />
	<meta property="og:type" content="website" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Bayou Boy Exotics" />
	<meta name="twitter:description" content="Premium Products | Premium Service" />
	<meta name="twitter:image" content="https://d2uhik5lt0ieo8.cloudfront.net/images/menu-hero.png" />
</svelte:head>

<Hero hero={home.hero} />
<div class="flex flex-col gap-8 px-4 pt-8 sm:px-6 lg:px-8">
	<MeetTimesCard {meetTimesDisplay} />
	<FeaturedDeals features={home.features} tintHeaderIcon />
	<AvailabilityCalendar {...calendarProps} />
	{#if home.raffle.enabled}
		<RaffleCard raffle={home.raffle} />
	{/if}
	<ShopCta />
</div>
