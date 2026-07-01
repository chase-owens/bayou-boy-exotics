<script lang="ts">
	import type { Category } from '../../../../../shared/types/Category';
	import IceCream from '$lib/assets/icons/IceCream.svelte';
	import Smile from '$lib/assets/icons/Smile.svelte';
	import Glasses from '$lib/assets/icons/Glasses.svelte';
	import Drip from '$lib/assets/icons/Drip.svelte';
	import Leaf from '$lib/assets/icons/Leaf.svelte';
	import Cart from '$lib/assets/icons/Cart.svelte';
	import type { Listing } from '../../../../../shared/types/Listing';

	const getListingsByCategory = (categoryId: string) =>
		activeListings.filter((listing) => listing.categoryId === categoryId);

	type CategoryCardProps = {
		activeListings: Listing[];
		category: Category;
	};

	const { activeListings, category }: CategoryCardProps = $props();
</script>

<a
	class="min-w-37.5 rounded-vintage border border-border bg-surface p-4 flex flex-col items-center gap-1 shadow-soft transition hover:border-accent hover:bg-background/40 sm:min-w-0"
	href={`#${category.id}`}
>
	{#if category.id === 'flower'}
		<Leaf class="size-6" />
	{:else if category.id === 'carts'}
		<Cart class="size-6" />
	{:else if category.id === 'wax'}
		<Drip class="size-6" />
	{:else if category.id === 'pre-rolls'}
		<Glasses class="size-6" />
	{:else if category.id === 'mushrooms'}
		<Smile class="size-6" />
	{:else if category.id === 'edibles'}
		<IceCream class="size-6" />
	{/if}
	<p class="font-semibold text-foreground">{category.label}</p>
	<p class=" text-xs text-muted">{getListingsByCategory(category.id).length} listed</p>
</a>
