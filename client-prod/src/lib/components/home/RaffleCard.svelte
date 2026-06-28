<script lang="ts">
	import type { Raffle } from '../../../../../shared/types/Home';
	import Ticket from '../../assets/icons/Ticket.svelte';

	type Props = {
		raffle: Raffle;
	};

	let { raffle }: Props = $props();

	const formatDrawing = (value: string) =>
		new Intl.DateTimeFormat('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		}).format(new Date(value));
</script>

<section class="rounded-vintage border border-accent/40 bg-surface p-4 shadow-soft">
	<div class="flex justify-between items-center">
		<div>
			<p class="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Raffle</p>
			<h2 class="mt-2 text-2xl font-bold">
				{raffle.title}
			</h2>
		</div>
		<div class="p-2 border rounded-vintage border-border"><Ticket class="h-8 text-accent" /></div>
	</div>

	<div class="mt-4 rounded-vintage bg-background/60 p-3 text-sm">
		<p class="text-xs uppercase tracking-widest text-muted">Reward</p>
		<p class="mt-1 text-lg font-semibold text-accent">{raffle.reward}</p>
	</div>

	<p class="mt-4 text-sm text-muted">
		Drawing: <span class="font-medium text-foreground">{formatDrawing(raffle.drawingAt)}</span>
	</p>

	{#if raffle.requirements?.length}
		<div class="mt-5">
			<p class="text-sm font-semibold text-foreground">Requirements</p>

			<ul class="mt-3 space-y-2">
				{#each raffle.requirements as requirement}
					<li class="flex gap-2 text-sm leading-6 text-muted">
						<span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>
						<span>{requirement}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</section>
