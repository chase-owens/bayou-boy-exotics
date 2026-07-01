<script lang="ts">
	import Cube from '$lib/assets/icons/Cube.svelte';
	import Calendar from '$lib/assets/icons/Calendar.svelte';
	import Diamond from '$lib/assets/icons/Diamond.svelte';

	type HeaderProps = {
		listingsCount: number;
	};

	const { listingsCount }: HeaderProps = $props();
</script>

<section class="relative overflow-hidden bg-black shadow-soft">
	<img
		src="/images/menu-hero.png"
		alt=""
		class="absolute inset-0 h-full w-full object-cover opacity-41"
	/>

	<!-- <div class="absolute inset-0 bg-linear-to-r from-black via-black/20 to-black/10"></div> -->

	<div class="relative grid gap-8 p-6 lg:grid-cols-[1fr_260px] lg:items-center">
		<div>
			<p class="text-xs font-black uppercase tracking-[0.4em] text-accent">Shop</p>

			<h1 class="mt-3 font-serif text-5xl leading-tight font-bold">
				Fresh Drops.
				<br />
				<span class="text-accent">Weekly Steals.</span>
			</h1>

			<p class="mt-5 max-w-lg text-lg text-muted">
				Premium flower, carts, concentrates, mushrooms, and exclusive Bayou drops.
			</p>

			<div class="mt-8 flex flex-wrap gap-6">
				<div class="flex items-center gap-3">
					<div class="rounded-xl border border-purple-500/40 bg-black/40 p-3">
						<Cube class="h-5 w-5 text-accent" />
					</div>

					{#if listingsCount}
						<div>
							<div class="font-bold text-accent">{listingsCount}</div>
							<div class="text-sm text-muted">Active Products</div>
						</div>
					{/if}
				</div>

				<div class="flex items-center gap-3">
					<div class="rounded-xl border border-purple-500/40 bg-black/40 p-3">
						<Calendar class="h-5 w-5 text-accent" />
					</div>

					<div>
						<div class="font-bold text-accent">Friday</div>
						<div class="text-sm text-muted">Next Drop</div>
					</div>
				</div>

				<div class="flex items-center gap-3">
					<div class="rounded-xl border border-purple-500/40 bg-black/40 p-3">
						<Diamond class="h-5 w-5 text-accent" />
					</div>

					<div>
						<div class="font-bold text-accent">2012</div>
						<div class="text-sm text-muted">Premium Since</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
