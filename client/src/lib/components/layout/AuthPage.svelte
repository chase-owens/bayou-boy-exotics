<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		image: string;
		imageAlt: string;
		eyebrow?: string;
		titleLead: string;
		titleAccent: string;
		description: string;
		children: Snippet;
	};

	const {
		image,
		imageAlt,
		eyebrow = 'Bayou Boy Exotics',
		titleLead,
		titleAccent,
		description,
		children
	}: Props = $props();
</script>

<section class="overflow-hidden bg-black">
	<div class="grid lg:grid-cols-[minmax(360px,0.8fr)_minmax(0,1.4fr)]">
		<!-- Form band -->
		<div
			class="order-2 flex items-center bg-black px-5 py-8 sm:px-8 sm:py-10 lg:order-1 lg:px-10 xl:px-14"
		>
			<div class="mx-auto w-full max-w-md">
				<p class="text-xs font-semibold tracking-[0.3em] text-accent uppercase">
					{eyebrow}
				</p>

				<h1
					class="mt-3 font-heading text-4xl leading-[1.02] font-bold tracking-[-0.035em] text-foreground sm:text-5xl"
				>
					{titleLead}
					<br />

					<span class="relative inline-block text-accent">
						<span class="relative z-10">{titleAccent}</span>

						<span
							class="absolute bottom-0 left-0 z-0 h-1 w-full -rotate-1 rounded-full bg-highlight"
						></span>
					</span>
				</h1>

				<p class="mt-5 max-w-sm text-sm leading-6 text-muted sm:text-base">
					{description}
				</p>

				<div class="mt-7">
					{@render children()}
				</div>
			</div>
		</div>

		<!-- Artwork -->
		<div class="order-1 lg:order-2">
			<img
				src={image}
				alt={imageAlt}
				class="block h-auto w-full lg:h-full lg:min-h-[680px] lg:object-cover"
			/>
		</div>
	</div>
</section>
