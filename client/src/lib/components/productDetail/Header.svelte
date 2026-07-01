<script lang="ts">
	import type { Listing } from '../../../../../shared/types/Listing';

	type HeaderProps = { categoryLabel?: string; listing: Listing; primaryImage?: string };

	const { categoryLabel, listing, primaryImage }: HeaderProps = $props();
</script>

<section class="overflow-hidden rounded-vintage border border-border bg-surface shadow-soft">
	<div class="relative h-75 bg-background">
		{#if primaryImage}
			<img class="h-full w-full object-cover" src={primaryImage} alt={listing.name} />
		{:else}
			<div class="flex h-full items-center justify-center text-muted">No image yet</div>
		{/if}

		<!-- <div
					class="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent"
				></div> -->

		<div class="absolute inset-0 bg-linear-to-br from-black/85 via-black/60 to-black/40"></div>

		<div class="absolute top-0 left-0 right-0 p-5 max-w-80">
			<div class="mb-3 flex flex-wrap gap-2">
				{#if categoryLabel}
					<span class="rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase text-primary">
						{categoryLabel}
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
				<p class="mt-0.5 text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
					{listing.brand ?? listing.vendor}
				</p>
			{/if}

			{#if listing.description}
				<p class="mt-3 text-sm leading-7 text-muted">
					{listing.description}
				</p>
			{/if}
		</div>
	</div>
</section>
