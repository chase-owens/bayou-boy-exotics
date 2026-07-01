<script lang="ts">
	import FeaturedDeals from '$lib/components/ui/FeaturedDeals.svelte';
	import Header from '$lib/components/menu/Header.svelte';
	import type { Category } from '../../../../shared/types/Category';
	import type { HomeContent } from '../../../../shared/types/Home';
	import type { Listing } from '../../../../shared/types/Listing';
	import type { MenuContent } from '../../../../shared/types/Menu';
	import ProductCard from '$lib/components/cards/ProductCard.svelte';
	import CategoryCard from '$lib/components/cards/CategoryCard.svelte';
	import SoldOutCard from '$lib/components/cards/SoldOutCard.svelte';

	const {
		data
	}: {
		data: {
			activeCategories: Category[];
			activeListings: Listing[];
			menu: MenuContent;
			home: HomeContent;
		};
	} = $props();

	const { activeCategories, activeListings } = $derived(data);

	const isSoldOut = $derived(activeListings.length === 0);

	const getListingsByCategory = (categoryId: string) =>
		activeListings.filter((listing) => listing.categoryId === categoryId);
</script>

<Header listingsCount={activeListings.length} />

{#if isSoldOut}
	<div class="flex flex-col gap-8 px-4 pt-8 sm:px-6 lg:px-8"><SoldOutCard /></div>
{:else}
	<div class="flex flex-col gap-8 px-4 pt-8 sm:px-6 lg:px-8">
		<FeaturedDeals features={data.home.features} />

		<section
			class="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6"
		>
			{#each activeCategories as category}
				<CategoryCard {activeListings} {category} />
			{/each}
		</section>

		{#each activeCategories as category}
			{@const listings = getListingsByCategory(category.id)}

			{#if listings.length}
				<section class="relative space-y-4">
					<div class="absolute -mt-25" id={category.label.toLocaleLowerCase()}></div>

					<div class="flex items-end justify-between gap-4">
						<div>
							<p class="text-sm font-black uppercase tracking-[0.35em] text-accent">
								{category.label}
							</p>

							{#if category.description}
								<p class="mt-2 text-sm text-muted">{category.description}</p>
							{/if}
						</div>
					</div>

					<div class="grid grid-cols-2 gap-4 lg:grid-cols-3">
						{#each listings as listing}
							<ProductCard {listing} />
						{/each}
					</div>
				</section>
			{/if}
		{/each}
	</div>{/if}
