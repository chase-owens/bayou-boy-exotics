<script lang="ts">
	import type { MenuContent } from '../../../../shared/types/Menu';

	const { data }: { data: { menu: MenuContent } } = $props();
	const menu = $derived(data.menu);

	const activeCategories = $derived(
		menu.categories.filter((category) => category.active).sort((a, b) => a.sortOrder - b.sortOrder)
	);

	const activeListings = $derived(
		menu.listings.filter((listing) => listing.active).sort((a, b) => a.sortOrder - b.sortOrder)
	);

	const activePromotions = $derived(
		menu.promotions
			.filter((promotion) => promotion.active)
			.sort((a, b) => a.sortOrder - b.sortOrder)
	);

	const getListingsByCategory = (categoryId: string) =>
		activeListings.filter((listing) => listing.categoryId === categoryId);

	const lowestPrice = (pricing: { price: number }[]) => {
		if (!pricing.length) return null;
		return Math.min(...pricing.map((price) => price.price));
	};
</script>

<svelte:head>
	<title>Menu | Bayou Exotics</title>
	<meta
		name="description"
		content="Browse the latest Bayou Exotics menu, featured deals, and active inventory."
	/>
</svelte:head>

<div class="mx-auto flex w-full max-w-5xl flex-col gap-5 pb-10">
	<section class="rounded-vintage border border-border bg-black/85 p-5 shadow-soft">
		<p class="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Menu</p>

		<div class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h1 class="text-4xl font-bold text-foreground">Current Menu</h1>
				<p class="mt-2 max-w-2xl text-sm leading-6 text-muted">
					Fresh drops, weekly steals, and active inventory. Availability can change quickly.
				</p>
			</div>

			{#if menu.lastUpdated}
				<p
					class="w-fit rounded-full border border-border bg-background/40 px-3 py-2 text-xs font-semibold text-muted"
				>
					Updated {new Date(menu.lastUpdated).toLocaleDateString('en-US', {
						month: 'short',
						day: 'numeric'
					})}
				</p>
			{/if}
		</div>
	</section>

	{#if activePromotions.length}
		<section class="rounded-vintage border border-accent/40 bg-surface p-5 shadow-soft">
			<p class="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Super Steals</p>
			<h2 class="mt-2 text-3xl font-bold text-foreground">Deals This Week</h2>

			<div class="mt-5 grid gap-3">
				{#each activePromotions as promotion}
					<article class="rounded-vintage border border-border bg-background/40 p-4">
						<h3 class="text-lg font-bold text-foreground">{promotion.title}</h3>
						{#if promotion.description}
							<p class="mt-1 text-sm leading-6 text-muted">{promotion.description}</p>
						{/if}

						{#if promotion.items?.length}
							<div class="mt-4 grid gap-2">
								{#each promotion.items as item}
									<div
										class="flex items-center justify-between gap-3 rounded-lg bg-surface/70 px-3 py-2"
									>
										<p class="text-sm font-semibold text-foreground">{item.label}</p>
										<p class="shrink-0 text-sm font-bold text-accent">${item.price}</p>
									</div>
								{/each}
							</div>
						{/if}
					</article>
				{/each}
			</div>
		</section>
	{/if}

	<section
		class="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6"
	>
		{#each activeCategories as category}
			<a
				class="min-w-37.5 rounded-vintage border border-border bg-surface p-4 text-center shadow-soft transition hover:border-accent hover:bg-background/40 sm:min-w-0"
				href={`#${category.id}`}
			>
				<p class="font-semibold text-foreground">{category.label}</p>
				<p class="mt-1 text-xs text-muted">{getListingsByCategory(category.id).length} listed</p>
			</a>
		{/each}
	</section>

	{#each activeCategories as category}
		{@const listings = getListingsByCategory(category.id)}

		{#if listings.length}
			<section class="space-y-4 relative">
				<div class="absolute -mt-25" id={category.label.toLocaleLowerCase()}></div>
				<div class="flex items-end justify-between gap-4">
					<div>
						<p class="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
							{category.label}
						</p>
						{#if category.description}
							<p class="mt-2 text-sm text-muted">{category.description}</p>
						{/if}
					</div>
				</div>
				<div
					class="-mx-4 grid grid-cols-2 lg:grid-cols-3 snap-x gap-4 overflow-visible px-4 pb-3 sm:mx-0 sm:px-0"
				>
					{#each listings as listing}
						<a
							class="group min-w-65 max-w-120 snap-start overflow-hidden rounded-vintage border border-border bg-black shadow-soft transition hover:-translate-y-0.5 hover:border-accent sm:min-w-[300px] lg:min-w-[320px] lg:max-w-[320px]"
							href={`/menu/${listing.id}`}
						>
							<div class="relative h-48 overflow-hidden bg-background sm:h-52">
								{#if listing.images?.[0]}
									<img
										class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
										src={listing.images[0]}
										alt={listing.name}
										loading="lazy"
									/>
								{:else}
									<div
										class="flex h-full items-center justify-center bg-background/50 text-sm text-muted"
									>
										No image yet
									</div>
								{/if}

								{#if lowestPrice(listing.pricing) !== null}
									<div
										class="absolute right-3 top-3 rounded-full bg-surface/95 px-3 py-1 text-sm shadow-soft backdrop-blur"
									>
										<span class="text-muted">From</span>
										<span class="ml-1 font-bold text-accent">${lowestPrice(listing.pricing)}</span>
									</div>
								{/if}

								{#if listing.type}
									<span
										class="absolute bottom-3 left-3 rounded-full bg-surface/95 px-3 py-1 text-xs font-semibold text-accent shadow-soft backdrop-blur"
									>
										{listing.type}
									</span>
								{/if}
							</div>

							<div class="min-h-28 p-4">
								<h3 class="line-clamp-2 text-2xl font-bold text-foreground group-hover:text-accent">
									{listing.name}
								</h3>

								{#if listing.brand || listing.vendor}
									<p
										class="mt-2 line-clamp-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted"
									>
										{listing.brand ?? listing.vendor}
									</p>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}
	{/each}
</div>
