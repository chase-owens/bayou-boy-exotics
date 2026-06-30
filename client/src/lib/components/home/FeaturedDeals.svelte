<script lang="ts">
	import SectionHeader from '$lib/components/layout/SectionHeader.svelte';
	import FeaturedDealCard from './FeaturedDealCard.svelte';

	import type { SuperSteal } from '../../../../../shared/types/Home';

	type Props = {
		features: SuperSteal[];
	};

	const { features }: Props = $props();

	const activeFeatures = $derived(features.filter((feature) => feature.enabled));
</script>

{#if activeFeatures.length}
	<section class="space-y-6">
		<SectionHeader eyebrow="Featured Deals" title="Don't Miss These Deals" variant="gift" />

		<div class="space-y-6">
			{#each activeFeatures as feature}
				<FeaturedDealCard {feature} />
			{/each}
		</div>
	</section>
{/if}
