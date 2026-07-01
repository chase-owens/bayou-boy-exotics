<script lang="ts">
	import type { Hero } from '../../../../../shared/types/Home';
	import Arrow from '../../assets/icons/Arrow.svelte';

	type HeroProps = {
		hero: Hero;
	};

	let { hero }: HeroProps = $props();
</script>

<section class="overflow-hidden bg-surface shadow-soft mb-0">
	<div class="relative h-72 bg-cover bg-no-repeat" style="background-image: url('{hero.image}');">
		<!-- <div class="absolute inset-0 bg-linear-to-r from-black/95 via-black/60 to-black/10"></div> -->
		<div class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
		<div
			class="absolute flex flex-col gap-2 lg:gap-4 top-0 left-0 bottom-0 max-w-50 lg:max-w-2xl p-5"
		>
			<p class=" text-xs font-semibold uppercase tracking-[0.3em] text-accent">
				{hero.eyebrow ?? 'Bayou Boy'}
			</p>

			<h1 class="text-4xl font-bold leading-tight text-foreground lg:text-5xl">
				{hero.title}
			</h1>

			{#if hero.subtitle}
				<p class=" max-w-3xl text-sm leading-7 text-foreground sm:text-lg">
					{hero.subtitle}
				</p>
			{/if}

			<div class=" flex flex-col gap-4 sm:flex-row">
				{#if hero.primaryAction}
					<div class="mt-1">
						<a
							href="/menu"
							class="inline-flex items-center gap-3 rounded-xl border border-highlight bg-black/70 px-6 py-3 font-semibold text-accent backdrop-blur transition hover:border-accent/80 hover:bg-black/85 hover:text-white"
						>
							<span>Shop Now</span>
							<Arrow class="h-4" />
						</a>
					</div>
				{/if}

				{#if hero.secondaryAction}
					<a class="btn-base btn-secondary" href={hero.secondaryAction.href}>
						{hero.secondaryAction.label}
					</a>
				{/if}
			</div>
		</div>
	</div>
</section>
