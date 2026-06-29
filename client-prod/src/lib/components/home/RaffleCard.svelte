<script lang="ts">
	import type { Raffle } from '../../../../../shared/types/Home';
	import Ticket from '../../assets/icons/Ticket.svelte';
	import SectionHeader from '../layout/SectionHeader.svelte';

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

<section class="rounded-vintage border border-accent/40 bg-secondary p-4 shadow-soft">
	<SectionHeader eyebrow="Raffle" title={raffle.title} variant="raffle" />

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
