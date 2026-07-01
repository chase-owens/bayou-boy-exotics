<script lang="ts">
	import SectionHeader from '$lib/components/layout/SectionHeader.svelte';
	import FeaturedDealCard from '../cards/FeaturedDealCard.svelte';

	import type { SuperSteal } from '../../../../../shared/types/Home';

	type Props = {
		features: SuperSteal[];
		tintHeaderIcon?: boolean;
	};

	const { features, tintHeaderIcon = false }: Props = $props();

	const activeFeatures = $derived(features.filter((feature) => feature.enabled));
</script>

{#if activeFeatures.length}
	<section class="space-y-6">
		<SectionHeader
			eyebrow="Featured Deals"
			title="Don't Miss These Deals"
			variant="gift"
			tintIconBg={tintHeaderIcon}
		/>
		<p class="-mt-3 text-sm text-white/55">Limited drops while inventory lasts.</p>

		<div class="">
			{#each activeFeatures as feature}
				<FeaturedDealCard {feature} />
			{/each}
		</div>
	</section>
{/if}
