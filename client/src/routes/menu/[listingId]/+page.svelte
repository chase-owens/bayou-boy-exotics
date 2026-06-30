<script lang="ts">
	import ProductOptionSelector from '$lib/components/productDetail/ProductOptionSelector.svelte';
	import type { Category } from '../../../../../shared/types/Category';
	import type { Listing } from '../../../../../shared/types/Listing';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const {
		listing,
		category,
		relatedListings
	}: { listing: Listing; category: Category; relatedListings: Listing[] } = $derived(data);

	const primaryImage = $derived(listing.images?.[0]);

	const lowestPrice = $derived(
		listing.pricing.length ? Math.min(...listing.pricing.map((price) => price.price)) : null
	);
</script>

<svelte:head>
	<title>{listing.name} | Bayou Exotics</title>
</svelte:head>

<div class="mx-auto flex w-full max-w-5xl flex-col gap-5 pb-24">
	<a class="text-sm font-semibold text-accent" href="/menu"> ← Back to Menu </a>

	<section class="overflow-hidden rounded-vintage border border-border bg-surface shadow-soft">
		<div class="relative h-90 bg-background sm:h-115">
			{#if primaryImage}
				<img class="h-full w-full object-cover" src={primaryImage} alt={listing.name} />
			{:else}
				<div class="flex h-full items-center justify-center text-muted">No image yet</div>
			{/if}

			<div class="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent"></div>

			<div class="absolute bottom-0 left-0 right-0 p-5">
				<div class="mb-3 flex flex-wrap gap-2">
					{#if category}
						<span class="rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase text-primary">
							{category.label}
						</span>
					{/if}

					{#if listing.type}
						<span
							class="rounded-full bg-background/80 px-3 py-1 text-xs font-bold capitalize text-accent backdrop-blur"
						>
							{listing.type.replaceAll('-', ' ')}
						</span>
					{/if}
				</div>

				<h1 class="text-4xl font-bold leading-tight text-white sm:text-6xl">
					{listing.name}
				</h1>

				{#if listing.brand || listing.vendor}
					<p class="mt-2 text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
						{listing.brand ?? listing.vendor}
					</p>
				{/if}
			</div>
		</div>
	</section>

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

			<section class="rounded-vintage border border-border bg-surface p-5 shadow-soft">
				<p class="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Details</p>

				{#if listing.description}
					<p class="mt-3 text-sm leading-7 text-muted">
						{listing.description}
					</p>
				{:else}
					<p class="mt-3 text-sm leading-7 text-muted">
						No description posted yet. Check Instagram for visuals and latest drop details.
					</p>
				{/if}
			</section>

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

		<ProductOptionSelector {listing} />
	</section>

	{#if relatedListings.length}
		<section class="space-y-4">
			<div class="flex items-center justify-between">
				<p class="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
					More {category?.label}
				</p>

				<a class="text-sm font-semibold text-accent" href="/menu"> View Menu → </a>
			</div>

			<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
				{#each relatedListings as item}
					<a
						class="group overflow-hidden rounded-vintage border border-border bg-surface"
						href={`/menu/${item.id}`}
					>
						<div class="aspect-square bg-background">
							{#if item.images?.[0]}
								<img
									class="h-full w-full object-cover transition group-hover:scale-105"
									src={item.images[0]}
									alt={item.name}
									loading="lazy"
								/>
							{:else}
								<div class="flex h-full items-center justify-center text-xs text-muted">
									No image
								</div>
							{/if}
						</div>

						<div class="p-3">
							<p class="line-clamp-2 text-sm font-bold text-foreground group-hover:text-accent">
								{item.name}
							</p>
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}
</div>
