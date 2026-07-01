<script lang="ts">
	import type { Listing } from '../../../../../shared/types/Listing';
	import type { PriceOption } from '../../../../../shared/types/Pricing';
	import { cart } from '$lib/stores/cart.svelte';
	import type { CartItem } from '../../../../../shared/types/Cart';

	type Props = {
		listing: Listing;
		onAddToCart?: (item: CartItem) => void;
	};

	let { listing, onAddToCart }: Props = $props();

	let selectedPriceOption = $state<PriceOption>(listing.pricing[0]);
	let selections = $state<Record<string, number>>({});

	const hasOptions = $derived(Boolean(listing.options?.length));

	let requiredMinimum = $derived(selectedPriceOption.units);

	const selectedTotal = $derived(Object.values(selections).reduce((sum, units) => sum + units, 0));

	const isSelectedTotalAMultipleOfRequiredMinimum = $derived(selectedTotal % requiredMinimum === 0);

	const setPriceOption = (option: PriceOption) => {
		selectedPriceOption = option;
	};

	const incrementOption = (optionId: string) => {
		selections[optionId] = (selections[optionId] ?? 0) + 1;
	};

	const decrementOption = (optionId: string) => {
		const current = selections[optionId] ?? 0;

		if (current <= 0) return;

		selections[optionId] = current - 1;
	};

	const addToCart = () => {
		if (hasOptions && (!selectedTotal || !isSelectedTotalAMultipleOfRequiredMinimum)) return;

		const selectedOptions =
			listing.options
				?.filter((option) => (selections[option.id] ?? 0) > 0)
				.map((option) => ({
					optionId: option.id,
					label: option.label,
					units: selections[option.id]
				})) ?? [];

		const totalUnits = hasOptions
			? selectedOptions.reduce((acc, cur) => {
					const currUnits = (acc += cur.units);
					return acc;
				}, 0)
			: 1;

		const quantity = totalUnits / selectedPriceOption.units;

		cart.addItem({
			image: listing.images[0],
			listingId: listing.id,
			listingName: listing.name,
			priceOptionId: selectedPriceOption.id,
			priceLabel: selectedPriceOption.label,
			price: selectedPriceOption.price,
			total: !hasOptions ? selectedPriceOption.price : selectedPriceOption.price * quantity,
			quantity,
			selections: selectedOptions,
			units: selectedPriceOption.units
		});
	};
</script>

<section class="rounded-vintage bg-surface p-5 shadow-soft">
	<p class="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Select Option</p>

	<div class="mt-5 grid gap-3">
		{#each listing.pricing as option}
			<button
				type="button"
				class={[
					'flex items-center justify-between rounded-vintage border px-4 py-3 text-left transition cursor-pointer',
					selectedPriceOption.id === option.id
						? 'border-highlight bg-black/60'
						: 'border-border bg-background/40 hover:border-accent'
				].join(' ')}
				onclick={() => setPriceOption(option)}
			>
				<span class="font-semibold text-foreground">{option.label}</span>
				<span class="text-xl font-bold text-accent">${option.price}</span>
			</button>
		{/each}
	</div>

	{#if hasOptions}
		<div class="mt-6">
			<div class="flex items-end justify-between gap-4">
				<div>
					<p class="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Select Flavors</p>
				</div>

				<p class="text-sm font-bold text-accent">
					{selectedTotal}{requiredMinimum && selectedTotal <= requiredMinimum
						? `/${requiredMinimum}`
						: ''}
				</p>
			</div>

			<div class="mt-4 grid gap-3">
				{#each listing.options ?? [] as option}
					<div
						class="flex items-center justify-between rounded-vintage border border-border bg-background/40 px-4 py-3"
					>
						<div>
							<p class="font-semibold text-foreground">{option.label}</p>

							{#if option.soldOut}
								<p class="text-xs text-muted">Sold out</p>
							{/if}
						</div>

						<div class="flex items-center gap-3">
							<button
								type="button"
								class="cursor-pointer size-8 rounded-full border border-border text-foreground disabled:opacity-40"
								disabled={(selections[option.id] ?? 0) === 0 || option.soldOut}
								onclick={() => decrementOption(option.id)}
							>
								−
							</button>

							<span class="w-6 text-center font-bold text-accent">
								{selections[option.id] ?? 0}
							</span>

							<button
								type="button"
								class="cursor-pointer size-8 rounded-full border border-border text-foreground disabled:opacity-40"
								disabled={option.soldOut}
								onclick={() => incrementOption(option.id)}
							>
								+
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<button
		type="button"
		class="cursor-pointer btn-base btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50 bg-black"
		disabled={!isSelectedTotalAMultipleOfRequiredMinimum || (hasOptions && !selectedTotal)}
		onclick={addToCart}
	>
		{!hasOptions ? 'Add To Cart' : !!selectedTotal ? `Add ${selectedTotal} to Cart` : `Add Flavors`}
	</button>
</section>
