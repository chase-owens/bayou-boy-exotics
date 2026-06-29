<script lang="ts">
	import Calendar from '$lib/assets/icons/Calendar.svelte';
	import Ticket from '$lib/assets/icons/Ticket.svelte';
	import Instagram from '$lib/assets/icons/Instagram.svelte';
	import Watch from '$lib/assets/icons/Watch.svelte';

	import Gift from '$lib/assets/icons/Gift.svelte';

	type HeaderVariant =
		| 'calendar'
		| 'clock'
		| 'raffle'
		| 'instagram'
		| 'menu'
		| 'cart'
		| 'gift'
		| 'instagram';

	type HeaderProps = {
		eyebrow: string;
		title: string;
		variant?: HeaderVariant;
	};

	const { eyebrow, title, variant }: HeaderProps = $props();
</script>

<div class="mb-5 flex items-start justify-between gap-4">
	<div>
		<p class="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
			{eyebrow}
		</p>

		<h2 class="mt-2 text-3xl font-bold text-foreground">
			{title}
		</h2>
	</div>

	<div class="rounded-vintage border border-border bg-background/40 p-3 text-accent">
		{#if variant === 'calendar'}
			<Calendar class="size-6" />
		{:else if variant === 'clock'}
			<Watch class="size-6" />
		{:else if variant === 'raffle'}
			<Ticket class="size-6" />
		{:else if variant === 'instagram'}
			<Instagram class="size-6" />
		{:else if variant === 'gift'}
			<Gift class="size-6" />
		{/if}
	</div>
</div>
