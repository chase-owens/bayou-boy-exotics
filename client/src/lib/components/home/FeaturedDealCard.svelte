<script lang="ts">
	import { goto } from '$app/navigation';
	import type { SuperSteal } from '../../../../../shared/types/Home';
	import { cart } from '$lib/stores/cart.svelte';

	type Props = {
		feature: SuperSteal;
	};

	let { feature }: Props = $props();

	const buttonLabel = $derived('cartItem' in feature ? 'Add to Cart' : 'View Deal');

	const handleClick = () => {
		if ('cartItem' in feature) {
			cart.addItem(feature.cartItem);
			return;
		}

		goto(`/menu/${feature.listingId}`);
	};
</script>

<section class="overflow-hidden rounded-vintage border border-border bg-surface shadow-soft">
	<div class="relative h-72 bg-background sm:h-96">
		<img
			class="h-full w-full object-cover"
			src={feature.image}
			alt={feature.headline}
			loading="lazy"
		/>

		<div class="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-transparent"></div>

		<div class="absolute inset-0 flex items-end">
			<div class="max-w-md p-6">
				<p class="text-xs font-bold uppercase tracking-[0.35em] text-accent">
					{feature.eyebrow}
				</p>

				<h2 class="mt-3 text-4xl font-bold leading-tight text-white">
					{feature.headline}
				</h2>

				<p class="mt-3 text-sm leading-6 text-white/75">
					{feature.summary}
				</p>

				<button
					type="button"
					class="mt-6 inline-flex items-center rounded-xl border border-accent bg-black/70 px-6 py-3 font-semibold text-accent backdrop-blur transition hover:bg-black hover:text-white"
					onclick={handleClick}
				>
					{buttonLabel}
				</button>
			</div>
		</div>
	</div>
</section>
