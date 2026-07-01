<script lang="ts">
	import Arrow from '$lib/assets/icons/Arrow.svelte';
	type CartMeetSummaryProps = {
		selectedMeetTime: string | null;
		total: number;
		onSubmit: () => void;
	};

	const { selectedMeetTime, total, onSubmit }: CartMeetSummaryProps = $props();
</script>

<section
	class="relative overflow-hidden rounded-[1.35rem] border border-yellow-400/70 bg-black p-5 shadow-[0_22px_55px_rgba(0,0,0,.5)]"
>
	<img
		src="/images/zebra-print.png"
		alt=""
		aria-hidden="true"
		class="absolute inset-0 h-full w-full object-cover opacity-90"
	/>

	<!-- <div class="absolute inset-0 bg-linear-to-r from-black/75 via-purple-950/55 to-black/20"></div> -->
	<div class="absolute -left-16 -top-16 h-44 w-34 rounded-full bg-yellow-400/15 blur-3xl"></div>

	<div class="relative grid gap-5">
		<div class="grid grid-cols-[auto_1fr] items-center gap-5">
			<div
				class="overflow-hidden flex h-20 w-20 items-center justify-center rounded-full border border-accent bg-black/45 text-4xl text-accent shadow-[0_0_30px_rgba(234,179,8,.18)]"
			>
				<img class="object-cover" src="/images/logo_light.jpg" alt="bayou-logo" />
			</div>

			<div class="grid grid-cols-2 items-center divide-x divide-white/20">
				<div class="pr-4 text-center">
					<p class="text-sm font-medium text-white/65">Total</p>
					<p class="font-serif text-5xl font-bold leading-none text-white">${total}</p>
				</div>

				<div class="pl-4 text-center">
					<p class="text-sm font-medium text-white/65">Selected Meet Time</p>
					<p class="font-serif text-4xl font-bold leading-none text-yellow-400">
						{selectedMeetTime ?? '—'}
					</p>
				</div>
			</div>
		</div>

		<button
			class="inline-flex items-center gap-3 rounded-xl border border-highlight bg-black/70 px-6 py-3 font-semibold text-accent backdrop-blur transition hover:border-accent/80 hover:bg-black/85 hover:text-white w-fit"
			onclick={onSubmit}
		>
			<span>{!selectedMeetTime ? 'Select Meet Time' : 'Continue to Checkout'}</span>
			<Arrow class="size-6" />
		</button>
	</div>
</section>
