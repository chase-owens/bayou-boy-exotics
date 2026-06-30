<script lang="ts">
	import Arrow from '$lib/assets/icons/Arrow.svelte';
	import Hero from '$lib/components/home/Hero.svelte';
	import RaffleCard from '$lib/components/home/RaffleCard.svelte';
	import AvailabilityCalendar from '$lib/components/home/AvailabilityCalendar.svelte';
	import MeetTimesCard from '$lib/components/MeetTimesCard.svelte';
	import { buildMeetTimesCard } from '$lib/utils/buildMeetTimesCard.js';
	import { buildAvailabilityCalendar } from '$lib/utils/buildAvailabilityCalendar.js';
	import { buildClosedLabel } from '$lib/utils/buildClosedLabel.js';
	import FeaturedDeals from '$lib/components/home/FeaturedDeals.svelte';

	let { data } = $props();

	const { home, raffle, root } = $derived(data);

	const { closedMessage } = $derived(
		buildClosedLabel({ hours: root.business.hours, ...data.availability })
	);

	const { meetTimesDisplay } = $derived(
		buildMeetTimesCard({ hours: root.business.hours, ...data.availability })
	);
</script>

<div class="flex flex-col gap-12">
	<Hero hero={home.hero} />
	{#if closedMessage}
		<div class=" rounded-vintage border border-accent bg-error px-4 py-3">
			<p class="text-sm leading-6 text-foreground">
				{closedMessage}
			</p>
		</div>
	{/if}
	<FeaturedDeals features={home.features} />
	{#if meetTimesDisplay}<MeetTimesCard {meetTimesDisplay} />{/if}
	<AvailabilityCalendar
		{...buildAvailabilityCalendar({ hours: root.business.hours, ...data.availability })}
	/>
	{#if raffle.enabled}
		<RaffleCard {raffle} />
	{/if}
	<section class="overflow-hidden rounded-vintage border border-border bg-surface shadow-soft">
		<div class="relative h-72 bg-background sm:h-96">
			<img
				class="h-full w-full object-cover object-right"
				src="/images/perma.png"
				alt="Premium Bayou Exotics Flower"
			/>

			<div class="absolute inset-0 bg-linear-to-r from-black/90 via-black/55 to-transparent"></div>

			<div class="absolute inset-0 flex items-end">
				<div class="max-w-md p-6 sm:p-8">
					<p class="text-xs font-bold uppercase tracking-[0.35em] text-accent">
						Shop Bayou Exotics
					</p>

					<h2 class="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl">
						Premium flower.<br />
						Every drop.
					</h2>

					<p class="mt-4 text-white/80">
						Browse this week's premium flower, carts, concentrates, mushrooms, and exclusive drops.
					</p>

					<div class="mt-5">
						<a
							href="/menu"
							class="inline-flex items-center gap-3 rounded-xl border border-highlight bg-black/70 px-6 py-3 font-semibold text-accent backdrop-blur transition hover:border-accent/80 hover:bg-black/85 hover:text-white"
						>
							<span>Shop Now</span>
							<Arrow class="h-4" />
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- <CategoryLinks categories={home.featuredCategories ?? []} /> -->
</div>
