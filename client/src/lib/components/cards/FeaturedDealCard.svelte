<script lang="ts">
	import { goto } from '$app/navigation';
	import type { SuperSteal } from '../../../../../shared/types/Home';
	import { cart } from '$lib/stores/cart.svelte';
	import Arrow from '$lib/assets/icons/Arrow.svelte';
	import Sparkles from '$lib/assets/icons/Sparkles.svelte';

	type Props = {
		feature: SuperSteal;
	};

	let { feature }: Props = $props();
	let didUserClickAddToCart = $state(false);

	const isCartFeature = $derived('cartItem' in feature);

	const isInBag = $derived(
		'cartItem' in feature
			? cart.hasItem(feature.cartItem.listingId, feature.cartItem.priceOptionId)
			: false
	);

	const price = $derived(
		'cartItem' in feature ? feature.cartItem.price : 'price' in feature ? feature.price : null
	);

	const buttonLabel = $derived(
		isInBag
			? 'In Your Bag'
			: isCartFeature
				? cart.status === 'adding' && didUserClickAddToCart
					? 'Adding...'
					: cart.status === 'success' && didUserClickAddToCart
						? 'Added'
						: 'Reserve'
				: 'Select Flavors'
	);

	const handleClick = () => {
		didUserClickAddToCart = true;
		if ('cartItem' in feature) {
			if (isInBag) return;
			cart.addItem(feature.cartItem);
			return;
		}

		goto(`/menu/${feature.listingId}`);
	};
</script>

<section
	class="flex flex-col gap-3 justify-between group relative overflow-hidden rounded-vintage border border-highlight/50 bg-black/70 px-4 py-4 shadow-soft transition hover:border-accent/80 sm:px-5"
>
	{#if price}
		<span
			class="rounded-full border border-accent/70 bg-black px-2.5 py-1 text-sm font-bold text-accent w-fit"
		>
			${price}
		</span>
	{/if}

	<h3 class="mt-2 line-clamp-2 font-serif text-2xl font-bold leading-tight text-white">
		{feature.headline}
	</h3>

	{#if feature.summary}
		<p class="mt-1 line-clamp-1 text-sm text-muted">
			{feature.summary}
		</p>
	{/if}

	<button
		type="button"
		disabled={cart.status === 'adding' || isInBag}
		onclick={handleClick}
		class={`shrink-0 rounded-xl border px-4 py-2.5 text-sm font-bold transition w-fit
				${
					isInBag
						? 'border-secondary bg-secondary text-white'
						: didUserClickAddToCart && cart.status === 'success'
							? 'border-secondary bg-secondary text-white'
							: 'border-highlight bg-black text-accent hover:border-accent hover:text-white'
				}
				${didUserClickAddToCart && cart.status === 'adding' ? 'cursor-wait opacity-80' : ''}
				${isInBag ? 'cursor-default' : 'cursor-pointer'}
			`}
	>
		<span class="flex items-center gap-2 whitespace-nowrap">
			{#if isInBag}
				<Sparkles class="size-4" />
			{/if}

			{buttonLabel}

			{#if !isInBag}
				<Arrow class="size-4" />
			{/if}
		</span>
	</button>
</section>
