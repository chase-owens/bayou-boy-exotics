<script lang="ts">
	import CartItem from '$lib/components/cart/CartItem.svelte';
	import CartMeetSummary from '$lib/components/cart/CartMeetSummary.svelte';
	import MeetTimesCard from '$lib/components/MeetTimesCard.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import type { PageData } from './$types';

	const hasItems = $derived(cart.items.length > 0);

	let { data }: { data: PageData } = $props();

	const { meetTimesDisplay } = $derived(data);

	let selectedMeetTime = $state<string | null>(null);

	const selectedMeet = $derived(
		meetTimesDisplay?.meets.find((meet) => meet.time === selectedMeetTime) ?? null
	);

	const canContinue = $derived(cart.items.length > 0 && Boolean(selectedMeet));

	const handleSubmit = () => {
		if (!selectedMeet || !meetTimesDisplay || !canContinue) return;

		const payload = {
			items: cart.items,
			total: cart.total,
			meet: {
				dayLabel: meetTimesDisplay.dayLabel,
				time: selectedMeet.time,
				label: selectedMeet.label
			}
		};

		console.log('request payload', payload);
	};
</script>

<section class="px-4 pt-4 sm:px-6 lg:px-8 mx-auto flex w-full max-w-3xl flex-col gap-5 pb-10">
	<div>
		<p class="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Cart</p>
		<h1 class="mt-2 text-4xl font-bold text-foreground">Your Request</h1>
		<p class="mt-2 text-sm text-muted">Review your items before choosing a meet time.</p>
	</div>

	{#if hasItems}
		<div class="space-y-4">
			{#each cart.items as item}
				<CartItem {item} />
			{/each}
		</div>

		<MeetTimesCard
			{meetTimesDisplay}
			{selectedMeetTime}
			onChange={(meetTime) => (selectedMeetTime = meetTime)}
		/>

		<CartMeetSummary {selectedMeetTime} onSubmit={handleSubmit} total={cart.total} />
	{:else}
		<section class="rounded-vintage border border-border bg-surface p-6 text-center shadow-soft">
			<h2 class="text-2xl font-bold text-foreground">Your cart is empty</h2>
			<p class="mt-2 text-sm text-muted">Add products from the menu to start a request.</p>

			<a class="btn-base btn-primary mt-5 inline-block" href="/menu"> View Menu </a>
		</section>
	{/if}
</section>
