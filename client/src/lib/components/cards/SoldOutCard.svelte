<script lang="ts">
	import getRandomBrandImage from '$lib/utils/getRandomBrandImage';
</script>

<section
	class="relative overflow-hidden rounded-vintage border border-purple-400/60 bg-black shadow-soft"
>
	<img
		src={getRandomBrandImage()}
		alt=""
		aria-hidden="true"
		class="absolute inset-0 h-full w-full object-cover opacity-55"
	/>
	<div class="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-black/20"></div>
	<div
		class="absolute inset-y-0 right-0 w-2/3 bg-linear-to-l from-purple-950/30 to-transparent"
	></div>

	<div class="relative grid gap-4 p-8 sm:min-h-96 sm:grid-cols-[1fr_auto]">
		<div class="flex max-w-md flex-col justify-center">
			<p class="text-xs font-black uppercase tracking-[0.38em] text-accent">sold out</p>

			<h2 class="mt-3 font-serif text-4xl font-bold leading-tight text-white drop-shadow">
				New menu drops this Friday
			</h2>

			<p class="mt-2 text-base leading-6 text-white/75">Coming Soon</p>
		</div>
	</div>
</section>
