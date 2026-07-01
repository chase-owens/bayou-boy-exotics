<script lang="ts">
	import type { Listing } from '../../../../../shared/types/Listing';
	import Arrow from '$lib/assets/icons/Arrow.svelte';
	const { listing }: { listing: Listing } = $props();

	const lowestPrice = (pricing: { price: number }[]) => {
		if (!pricing.length) return null;
		return Math.min(...pricing.map((price) => price.price));
	};
</script>

<a
	class="group overflow-hidden rounded-vintage border border-purple-400/30 bg-black shadow-soft transition hover:-translate-y-1 hover:border-accent/80 hover:shadow-[0_0_30px_rgba(126,34,206,.25)]"
	href={`/menu/${listing.id}`}
>
	<div class="relative h-44 overflow-hidden bg-black sm:h-52">
		{#if listing.images?.[0]}
			<img
				class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
				src={listing.images[0]}
				alt={listing.name}
				loading="lazy"
			/>
		{:else}
			<div class="flex h-full items-center justify-center bg-background/50 text-sm text-muted">
				No image yet
			</div>
		{/if}

		<div class="absolute inset-0 bg-linear-to-t from-black via-black/10 to-transparent"></div>

		{#if listing.type}
			<span
				class="absolute bottom-3 left-3 rounded-full border border-purple-400/25 bg-surface/95 px-3 py-1 text-xs font-bold lowercase text-accent shadow-soft backdrop-blur"
			>
				{listing.type}
			</span>
		{/if}
	</div>

	<div class="space-y-2 bg-black p-4">
		<h3
			class="line-clamp-2 font-heading text-2xl font-bold leading-tight text-white transition group-hover:text-accent"
		>
			{listing.name}
		</h3>

		{#if listing.brand || listing.vendor}
			<p class="line-clamp-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/65">
				{listing.brand ?? listing.vendor}
			</p>
		{/if}

		<div class="flex items-center justify-between">
			{#if lowestPrice(listing.pricing) !== null}
				<p class="text-sm text-white/60">
					From
					<span class="ml-1 text-lg font-black text-accent">
						${lowestPrice(listing.pricing)}
					</span>
				</p>
			{/if}
		</div>

		<span class="flex items-center gap-3 text-accent transition group-hover:text-highlight">
			View Options <Arrow class="size-4 transition hover:ml-2 " />
		</span>
	</div>
</a>
