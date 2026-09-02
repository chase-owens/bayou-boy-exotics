<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Hero } from '../../../../../shared/types/Home';
	import Arrow from '../../assets/icons/Arrow.svelte';

	type HeroProps = {
		hero: Hero;
	};

	let { hero }: HeroProps = $props();
</script>

<section class="mb-0 overflow-hidden bg-surface shadow-soft">
	<div class="relative h-72 bg-cover bg-no-repeat" style="background-image: url('{hero.image}');">
		<!-- <div class="absolute inset-0 bg-linear-to-r from-black/95 via-black/60 to-black/10"></div> -->
		<div class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
		<div
			class="absolute top-0 bottom-0 left-0 flex max-w-50 flex-col gap-2 p-5 lg:max-w-2xl lg:gap-4"
		>
			<p class=" text-xs font-semibold tracking-[0.3em] text-accent uppercase">
				{hero.eyebrow ?? 'Bayou Boy'}
			</p>

			<h1 class="text-4xl leading-tight font-bold text-foreground lg:text-5xl">
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
							href={hero.primaryAction.href}
							class="inline-flex items-center gap-3 rounded-xl border border-highlight bg-black/70 px-6 py-3 font-semibold text-accent backdrop-blur transition hover:border-accent/80 hover:bg-black/85 hover:text-white"
						>
							<span>{hero.primaryAction.label}</span>
							<Arrow class="h-4" />
						</a>
					</div>
				{/if}

				{#if hero.secondaryAction}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a class="btn-base btn-secondary" href={hero.secondaryAction.href}>
						{hero.secondaryAction.label}
					</a>
				{/if}
			</div>
		</div>
	</div>
</section>
