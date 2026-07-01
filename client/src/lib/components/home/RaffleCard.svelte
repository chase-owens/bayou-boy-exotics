<script lang="ts">
	import type { Raffle } from '../../../../../shared/types/Home';
	import Ticket from '../../assets/icons/Ticket.svelte';
	import Arrow from '$lib/assets/icons/Arrow.svelte';

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

<section
	class="relative overflow-hidden rounded-3xl border border-purple-400/70 bg-black p-5 shadow-[0_24px_70px_rgba(0,0,0,.55)]"
>
	<img
		src="/images/frog.png"
		alt=""
		aria-hidden="true"
		class="absolute inset-0 h-full w-full object-cover opacity-55"
	/>

	<div class="absolute inset-0 bg-linear-to-br from-black/85 via-purple-950/60 to-black/24"></div>
	<div class="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl"></div>
	<div class="absolute -right-20 -bottom-24 h-64 w-64 rounded-full bg-accent/15 blur-3xl"></div>

	<div class="relative rounded-vintage">
		<div class="flex items-start justify-between gap-4">
			<div>
				<p class="text-xs font-black uppercase tracking-[0.45em] text-accent">Raffle</p>

				<h2 class="mt-3 font-serif text-4xl font-bold leading-none text-white drop-shadow">
					{raffle.title}
				</h2>
			</div>

			<div
				class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-purple-400/50 bg-black/45 text-accent shadow-[0_0_25px_rgba(168,85,247,.25)]"
			>
				<Ticket class="size-6" />
			</div>
		</div>

		<div
			class="relative mt-6 overflow-hidden rounded-[1.15rem] border border-purple-400/45 bg-black/35 p-5 backdrop-blur-sm"
		>
			<img
				src="/images/treasure_chest.png"
				alt=""
				aria-hidden="true"
				class="pointer-events-none absolute -right-6 bottom-0 h-32 w-40 object-contain opacity-80"
			/>

			<p class="text-xs font-black uppercase tracking-[0.35em] text-purple-300">Reward</p>

			<p class="relative mt-4 max-w-[72%] text-2xl font-black leading-tight text-accent">
				{raffle.reward}
			</p>
		</div>

		<div class="mt-5 flex items-center gap-3 text-sm text-white/70">
			<p>
				Drawing:
				<span class="font-bold text-accent">{formatDrawing(raffle.drawingAt)}</span>
			</p>
		</div>

		{#if raffle.requirements?.length}
			<div class="mt-6">
				<p class="text-xs font-black uppercase tracking-[0.35em] text-purple-300">Requirements</p>

				<ul class="mt-4 space-y-3">
					{#each raffle.requirements as requirement, index}
						<li class="flex items-center gap-3 border-b border-purple-400/15 pb-3 last:border-b-0">
							<span
								class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/45 bg-black/45 text-sm font-black text-accent"
							>
								{index + 1}
							</span>

							<span class="text-sm font-medium leading-6 text-white/85">
								{requirement}
							</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<a
			href="/shop"
			class="inline-flex items-center gap-3 rounded-xl border border-highlight bg-black/70 px-6 py-3 font-semibold text-accent backdrop-blur transition hover:border-accent/80 hover:bg-black/85 hover:text-white"
		>
			Get Entered
			<span class="text-3xl leading-none"><Arrow class="size-6" /></span>
		</a>
	</div>
</section>
