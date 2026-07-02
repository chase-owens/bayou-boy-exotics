<script lang="ts">
	import { goto } from '$app/navigation';
	import type { SuperSteal } from '../../../../../shared/types/Home';
	import { cart } from '$lib/stores/cart.svelte';
	import Arrow from '$lib/assets/icons/Arrow.svelte';
	import getRandomBrandImage from '$lib/utils/getRandomBrandImage';
	import Sparkles from '$lib/assets/icons/Sparkles.svelte';

	type Props = {
		feature: SuperSteal;
	};

	let { feature }: Props = $props();

	const isInBag = $derived(
		'cartItem' in feature
			? cart.hasItem(feature.cartItem.listingId, feature.cartItem.priceOptionId)
			: false
	);

	const buttonLabel = $derived(
		isInBag
			? `In Your Bag`
			: 'cartItem' in feature
				? cart.status === 'adding'
					? 'Adding...'
					: cart.status === 'success'
						? 'Added to Bag'
						: 'Reserve'
				: 'View Deal'
	);

	const price = $derived('cartItem' in feature ? feature.cartItem.price : null);

	const handleClick = () => {
		if ('cartItem' in feature) {
			cart.addItem(feature.cartItem);
			return;
		}

		goto(`/menu/${feature.listingId}`);
	};
</script>

<section
	class="relative overflow-hidden rounded-vintage border border-purple-400/60 bg-black shadow-soft"
>
	<img
		src={getRandomBrandImage()}
		alt=""
		aria-hidden="true"
		class="absolute inset-0 h-full w-full object-cover opacity-55"
	/>
	<div class="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-black/20"></div>
	<div
		class="absolute inset-y-0 right-0 w-2/3 bg-linear-to-l from-purple-950/30 to-transparent"
	></div>

	<div class="relative grid gap-4 p-8 sm:min-h-96 sm:grid-cols-[1fr_auto]">
		<div class="flex max-w-md flex-col justify-center">
			<p class="text-xs font-black uppercase tracking-[0.38em] text-accent">
				{feature.eyebrow}
			</p>

			<h2 class="mt-3 font-serif text-4xl font-bold leading-tight text-white drop-shadow">
				{feature.headline}
			</h2>

			<p class="mt-2 text-base leading-6 text-white/75">
				{feature.summary}
			</p>

			<button
				type="button"
				disabled={cart.status === 'adding' || isInBag}
				class={`mt-6  w-fit items-center gap-3 rounded-xl border px-6 py-3 cursor-pointer
		font-semibold backdrop-blur transition-all duration-300 flex justify-between
		${
			cart.status === 'success'
				? 'border-highlight bg-secondary text-white'
				: 'border-highlight bg-black/70 text-accent hover:border-accent/80 hover:bg-black/85 hover:text-white'
		}
		${cart.status === 'adding' ? 'cursor-wait opacity-80' : ''}
	`}
				onclick={handleClick}
				>{#if isInBag}
					<Sparkles class="size-4" />{/if}
				<div class="flex flex-col gap-1 items-start">
					<span>{buttonLabel}</span>
					{#if isInBag}
						<span>Secure a Meet Time to Lock it in!</span>{/if}
				</div>
				<span class="text-xl">
					{#if !isInBag}
						<Arrow class="size-4" />
					{/if}</span
				>
			</button>
		</div>

		{#if price}
			<div class="absolute top-3 right-3">
				<div
					class="flex h-16 w-16 flex-col items-center justify-center rounded-full border-3 border-accent bg-black/80 text-center shadow-[0_0_35px_rgba(234,179,8,.25)]"
				>
					<span class="font-serif text-xl font-bold leading-none text-accent">
						${price}
					</span>
				</div>
			</div>
		{/if}
	</div>
</section>
