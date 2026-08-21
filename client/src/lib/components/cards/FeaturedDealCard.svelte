<script lang="ts">
	import { goto } from '$app/navigation';
	import type { SuperSteal } from '../../../../../shared/types/Home';
	import { cart } from '$lib/stores/cart.svelte';
	import Arrow from '$lib/assets/icons/Arrow.svelte';
	import Sparkles from '$lib/assets/icons/Sparkles.svelte';
	import { resolve } from '$app/paths';

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

		goto(resolve(`/menu/${feature.listingId}`));
	};
</script>

<section
	class="group relative flex flex-col justify-between gap-3 overflow-hidden rounded-vintage border border-highlight/50 bg-black/70 px-4 py-4 shadow-soft transition hover:border-accent/80 sm:px-5"
>
	{#if price}
		<span
			class="w-fit rounded-full border border-accent/70 bg-black px-2.5 py-1 text-sm font-bold text-accent"
		>
			${price}
		</span>
	{/if}

	<h3 class="mt-2 line-clamp-2 font-serif text-2xl leading-tight font-bold text-white">
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
		class={`w-fit shrink-0 rounded-xl border px-4 py-2.5 text-sm font-bold transition
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
