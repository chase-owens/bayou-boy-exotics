<script lang="ts">
	type CategoryLink = {
		label: string;
		href: string;
		description?: string;
	};

	type Props = {
		categories: CategoryLink[];
	};

	let { categories }: Props = $props();
</script>

{#if categories.length}
	<section class="rounded-vintage border border-border bg-surface p-6 shadow-soft">
		<p class="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
			Menu
		</p>

		<h2 class="mt-2 text-2xl font-bold">
			Browse Categories
		</h2>

		<div class="mt-5 grid gap-4 sm:grid-cols-2">
			{#each categories as category}
				<a
					class="rounded-vintage border border-border bg-background/50 p-5 hover:border-accent/60 hover:bg-background"
					href={category.href}
				>
					<p class="text-lg font-semibold text-foreground">{category.label}</p>

					{#if category.description}
						<p class="mt-2 text-sm leading-6 text-muted">
							{category.description}
						</p>
					{/if}
				</a>
			{/each}
		</div>
	</section>
{/if}
