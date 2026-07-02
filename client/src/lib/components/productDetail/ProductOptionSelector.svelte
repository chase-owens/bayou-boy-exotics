<script lang="ts">
	import type { Listing } from '../../../../../shared/types/Listing';
	import type { PriceOption } from '../../../../../shared/types/Pricing';
	import { cart } from '$lib/stores/cart.svelte';
	import type { CartItem } from '../../../../../shared/types/Cart';
	import Sparkles from '$lib/assets/icons/Sparkles.svelte';

	type Props = {
		listing: Listing;
		priceOptionId: string | null;
	};

	let { listing, priceOptionId }: Props = $props();

	const toSelectionRecord = (item: CartItem) =>
		Object.fromEntries(item.selections.map((selection) => [selection.optionId, selection.units]));

	const hydrateFromCartItem = (priceOptionId: string) => {
		const item = cart.getItem(listing.id, priceOptionId);
		if (!item) return;

		selectionsByPriceOption = {
			...selectionsByPriceOption,
			[priceOptionId]: toSelectionRecord(item)
		};
	};

	let selectedPriceOption = $state<PriceOption>();
	let selectionsByPriceOption = $state<Record<string, Record<string, number>>>({});
	const existingCartItem = $derived(
		selectedPriceOption ? cart.getItem(listing.id, selectedPriceOption.id) : undefined
	);

	const canEdit = $derived(existingCartItem?.selections.length);

	let hasInitialized = $state(false);

	$effect(() => {
		if (hasInitialized) return;

		const initialOption =
			listing.pricing.find((option) => option.id === priceOptionId) ?? listing.pricing[0];

		selectedPriceOption = initialOption;

		if (initialOption) {
			hydrateFromCartItem(initialOption.id);
		}

		hasInitialized = true;
	});

	const selections = $derived(
		selectedPriceOption ? (selectionsByPriceOption[selectedPriceOption.id] ?? {}) : {}
	);
	const hasOptions = $derived(Boolean(listing.options?.length));

	let requiredMinimum = $derived(selectedPriceOption?.units ?? 1);

	const selectedTotal = $derived(Object.values(selections).reduce((sum, units) => sum + units, 0));

	const isSelectedTotalAMultipleOfRequiredMinimum = $derived(selectedTotal % requiredMinimum === 0);

	const currentSelections = $derived(
		Object.entries(selections)
			.filter(([, units]) => units > 0)
			.map(([optionId, units]) => ({ optionId, units }))
	);

	const normalized = (items: { optionId: string; units: number }[]) =>
		[...items]
			.filter((item) => item.units > 0)
			.sort((a, b) => a.optionId.localeCompare(b.optionId))
			.map((item) => `${item.optionId}:${item.units}`)
			.join('|');

	const hasConfigChanged = $derived(
		existingCartItem
			? normalized(existingCartItem.selections) !== normalized(currentSelections)
			: false
	);

	const setPriceOption = (option: PriceOption) => {
		selectedPriceOption = option;

		// If user has not drafted anything for this price option yet,
		// hydrate from bag so returning to "2 for" shows the cart config.
		if (!selectionsByPriceOption[option.id]) {
			hydrateFromCartItem(option.id);
		}
	};

	const incrementOption = (optionId: string) => {
		if (!selectedPriceOption) return;

		const priceOptionId = selectedPriceOption.id;
		const current = selectionsByPriceOption[priceOptionId] ?? {};

		selectionsByPriceOption = {
			...selectionsByPriceOption,
			[priceOptionId]: {
				...current,
				[optionId]: (current[optionId] ?? 0) + 1
			}
		};
	};

	const decrementOption = (optionId: string) => {
		if (!selectedPriceOption) return;

		const priceOptionId = selectedPriceOption.id;
		const current = selectionsByPriceOption[priceOptionId] ?? {};
		const count = current[optionId] ?? 0;

		if (count <= 0) return;

		selectionsByPriceOption = {
			...selectionsByPriceOption,
			[priceOptionId]: {
				...current,
				[optionId]: count - 1
			}
		};
	};

	const addToCart = () => {
		if (
			(hasOptions && (!selectedTotal || !isSelectedTotalAMultipleOfRequiredMinimum)) ||
			!selectedPriceOption
		) {
			return;
		}

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

		const item = {
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
		};
		if (existingCartItem) {
			if (!hasConfigChanged) return;

			cart.updateItem(existingCartItem.id, item);
		} else {
			cart.addItem(item);
		}
	};

	const isInBag = $derived(
		selectedPriceOption ? cart.hasItem(listing.id, selectedPriceOption?.id) : false
	);

	const buttonLabel = $derived(
		existingCartItem
			? hasConfigChanged
				? 'Update Bag'
				: 'In Your Bag'
			: cart.status === 'adding'
				? 'Adding...'
				: cart.status === 'success'
					? 'Added to Bag'
					: hasOptions
						? selectedTotal && isSelectedTotalAMultipleOfRequiredMinimum
							? `Add ${selectedTotal} to Cart`
							: 'Add Flavors'
						: 'Add To Cart'
	);
</script>

<section class="rounded-vintage bg-surface p-5 shadow-soft">
	<p class="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Select Option</p>

	<div class="mt-5 grid gap-3">
		{#each listing.pricing as option}
			<button
				type="button"
				class={[
					'flex items-center justify-between rounded-vintage border px-4 py-3 text-left transition cursor-pointer',
					selectedPriceOption?.id === option.id
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
		disabled={(existingCartItem && !hasConfigChanged) || cart.status === 'adding'}
		class={`flex justify-center mt-6  w-full items-center gap-3 rounded-xl border px-6 py-3 cursor-pointer
		font-semibold backdrop-blur transition-all duration-300
		${
			cart.status === 'success'
				? 'border-black bg-secondary text-white'
				: 'border-highlight bg-black/70 text-accent hover:border-accent/80 hover:bg-black/85 hover:text-white'
		}
		${cart.status === 'adding' ? 'cursor-wait opacity-80' : ''}
	`}
		onclick={addToCart}
	>
		{#if existingCartItem}
			<Sparkles class="size-4" />
		{/if}
		<span class="text-xl">{buttonLabel}</span>
	</button>
</section>
