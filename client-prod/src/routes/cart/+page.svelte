<script lang="ts">
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

<section class="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-10">
	<div>
		<p class="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Cart</p>
		<h1 class="mt-2 text-4xl font-bold text-foreground">Your Request</h1>
		<p class="mt-2 text-sm text-muted">Review your items before choosing a meet time.</p>
	</div>

	{#if hasItems}
		<div class="space-y-4">
			{#each cart.items as item}
				<article class="rounded-vintage border border-border bg-secondary p-4 shadow-soft">
					<div class="flex items-start justify-between gap-4">
						<div>
							<h2 class="text-xl font-bold text-foreground">{item.listingName}</h2>
							<p class="mt-1 text-sm text-muted">
								{item.priceLabel}{item.price !== item.total ? ` $${item.price}` : ``}
							</p>
							{#if item.quantity && item.quantity > 1}
								<p class="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
									{item.quantity} packs
								</p>
							{/if}
							<img
								class="h-24 w-24 border border-border rounded-vintage object-cover"
								src={item.image}
								alt="product-close-up"
							/>
						</div>

						<p class="text-xl font-bold text-accent">${item.total}</p>
					</div>

					{#if item.selections.length}
						<div class="mt-4 rounded-vintage bg-background/40 p-3">
							<p class="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
								Selections
							</p>

							<div class="mt-3 grid gap-2">
								{#each item.selections as selection}
									<div class="flex justify-between text-sm">
										<span class="text-foreground">{selection.label}</span>
										<span class="font-semibold text-accent">x{selection.units}</span>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<button
						type="button"
						class="mt-4 text-sm font-semibold text-muted hover:text-accent"
						onclick={() => cart.removeItem(item.id)}
					>
						Remove
					</button>
				</article>
			{/each}
		</div>

		<MeetTimesCard
			{meetTimesDisplay}
			{selectedMeetTime}
			onChange={(meetTime) => (selectedMeetTime = meetTime)}
		/>

		<section class="rounded-vintage border border-accent/30 bg-highlight p-5 shadow-soft">
			<div class="flex flex-col items-center justify-between">
				<div class="flex gap-2">
					<p class="text-lg font-bold text-foreground">Total:</p>
					<p class="text-xl font-bold text-white">${cart.total}</p>
				</div>

				{#if selectedMeetTime}
					<p class="font-bold text-2xl text-black">Selected Meet Time: {selectedMeetTime}</p>
				{/if}
			</div>

			<button class="btn-base btn-primary mt-5 block bg-black m-auto" onclick={handleSubmit}>
				{!selectedMeetTime ? 'Select Meet Time' : 'Continue'}
			</button>
		</section>
	{:else}
		<section class="rounded-vintage border border-border bg-surface p-6 text-center shadow-soft">
			<h2 class="text-2xl font-bold text-foreground">Your cart is empty</h2>
			<p class="mt-2 text-sm text-muted">Add products from the menu to start a request.</p>

			<a class="btn-base btn-primary mt-5 inline-block" href="/menu"> View Menu </a>
		</section>
	{/if}
</section>
