<script lang="ts">
	import Arrow from '$lib/assets/icons/Arrow.svelte';
	import ProductCard from '$lib/components/cards/ProductCard.svelte';
	import Header from '$lib/components/productDetail/Header.svelte';
	import ProductOptionSelector from '$lib/components/productDetail/ProductOptionSelector.svelte';
	import type { Listing } from '../../../../../shared/types/Listing';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const {
		listing,
		categoryLabel,
		relatedListings,
		priceOptionId,
		primaryImage
	}: {
		listing: Listing;
		categoryLabel: string;
		relatedListings: Listing[];
		priceOptionId: string | null;
		primaryImage: string;
	} = $derived(data);
</script>

<div class="px-4 pt-4 sm:px-6 lg:px-8">
	<div class="mx-auto flex w-full max-w-5xl flex-col gap-5 pb-24">
		<a
			class="text-sm font-semibold text-accent items-center flex gap-2 transition group-hover:text-highlight"
			href="/menu"
		>
			<Arrow class="size-4 rotate-180 inline" />
			<p>Back to Menu</p>
		</a>

		<Header {categoryLabel} {listing} {primaryImage} />

		<section class="grid gap-5 lg:grid-cols-[1fr_380px]">
			<div class="space-y-5">
				{#if listing.tags?.length}
					<div class="flex flex-wrap gap-2">
						{#each listing.tags as tag}
							<span
								class="rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-muted"
							>
								{tag}
							</span>
						{/each}
					</div>
				{/if}

				{#if listing.images?.length > 1}
					<section class="space-y-3">
						<p class="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Photos</p>

						<div class="grid grid-cols-3 gap-3">
							{#each listing.images.slice(1) as image}
								<img
									class="aspect-square rounded-vintage border border-border object-cover"
									src={image}
									alt={listing.name}
									loading="lazy"
								/>
							{/each}
						</div>
					</section>
				{/if}
			</div>

			<ProductOptionSelector {listing} {priceOptionId} />
		</section>

		{#if relatedListings.length}
			<section class="space-y-4">
				<div class="flex items-center justify-between">
					<p class="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
						More {categoryLabel}
					</p>

					<a class="text-sm font-semibold text-accent flex gap-2 items-center" href="/menu">
						<p>View Menu</p>
						<Arrow class="size-4" />
					</a>
				</div>

				<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
					{#each relatedListings as listing}
						<ProductCard {listing} />
					{/each}
				</div>
			</section>
		{/if}
	</div>
</div>
