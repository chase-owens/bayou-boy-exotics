<script lang="ts">
	import type { CartItem } from '../../../../../shared/types/Cart';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import getRandomBrandImage from '../../utils/getRandomBrandImage';
	import Edit from '../../assets/icons/Edit.svelte';
	import Diamond from '../../assets/icons/Diamond.svelte';
	import Trash from '../../assets/icons/Trash.svelte';
	import { cart } from '../../stores/cart.svelte';

	const { item }: { item: CartItem } = $props();

	const canEdit = $derived(!!item.selections.length);

	const editItem = () => {
		goto(resolve(`/menu/${item.listingId}?editOption=${item.priceOptionId}`));
	};
</script>

<article
	class="relative overflow-hidden rounded-[1.35rem] border border-highlight bg-black shadow-[0_18px_45px_rgba(0,0,0,.45)]"
>
	<img
		src={getRandomBrandImage()}
		alt=""
		aria-hidden="true"
		class="absolute inset-0 h-full w-full object-cover opacity-95"
	/>

	<div class="absolute inset-0 bg-linear-to-r from-black/85 via-black/45 to-black/15"></div>

	<div class="relative grid gap-4 p-5 sm:grid-cols-[8rem_1fr_auto] sm:items-center">
		<img
			class="h-32 w-32 rounded-2xl border border-purple-300/70 object-cover shadow-[0_0_28px_rgba(168,85,247,.3)]"
			src={item.image}
			alt={item.listingName}
		/>

		<div class="min-w-0">
			<p
				class="mb-3 inline-flex items-center gap-2 rounded-md border border-purple-300/60 bg-black/45 px-3 py-1 text-xs font-bold tracking-[0.2em] text-yellow-300 uppercase"
			>
				<Diamond class="size-5" />
				Premium
			</p>

			<h2 class="font-serif leading-none font-bold text-white drop-shadow">
				{item.listingName}
			</h2>

			<p class="mt-3 text-sm text-white/70">
				{item.priceLabel}<span class="pl-1">{item.price}</span>
				<span class="mx-2 text-highlight">•</span>
				Exotic Hybrid
			</p>

			{#if item.quantity && item.quantity > 1}
				<p class="mt-2 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
					{item.quantity} packs
				</p>
			{/if}
		</div>

		<p class="absolute top-5 right-5 text-3xl font-black text-yellow-400 sm:static sm:self-start">
			${item.total ?? item.price}
		</p>
	</div>

	{#if item.selections.length}
		<div
			class="relative mx-5 mb-4 rounded-2xl border border-purple-400/25 bg-black/35 p-3 backdrop-blur-sm"
		>
			<p class="text-xs font-semibold tracking-[0.25em] text-yellow-300 uppercase">Selections</p>

			<div class="mt-3 grid gap-2">
				{#each item.selections as selection (selection.optionId)}
					<div class="flex justify-between text-sm">
						<span class="text-white/85">{selection.label}</span>
						<span class="font-semibold text-yellow-300">x{selection.units}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="relative flex gap-6 px-5 pb-2">
		<button
			type="button"
			class="inline-flex items-center gap-3 text-sm font-bold text-white/85 transition hover:text-purple-300"
			onclick={() => cart.removeItem(item.id)}
		>
			<Trash class="size-6 text-highlight" />
			Remove
		</button>
		{#if canEdit}<button
				class="inline-flex items-center gap-3 text-sm font-bold text-white/85 transition hover:text-purple-300"
				onclick={editItem}
			>
				<Edit class="size-6 text-highlight" />
				Edit
			</button>{/if}
	</div>
</article>
