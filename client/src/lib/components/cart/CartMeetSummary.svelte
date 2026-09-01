<script lang="ts">
	import Arrow from '../../assets/icons/Arrow.svelte';
	import ReservationSuccess from '../ui/ReservationSuccess.svelte';

	type CartMeetSummaryProps = {
		error: string;
		isSuccess: boolean | null;
		selectedMeetTime: string | null;
		total: number;
		onSubmit: () => void;
	};

	const { error, isSuccess, onSubmit, selectedMeetTime, total }: CartMeetSummaryProps = $props();
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
	<div class="absolute -top-16 -left-16 h-44 w-34 rounded-full bg-yellow-400/15 blur-3xl"></div>

	<div class="relative grid gap-5">
		<div class="grid grid-cols-[auto_1fr] items-center gap-5">
			<div
				class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-accent bg-black/45 text-4xl text-accent shadow-[0_0_30px_rgba(234,179,8,.18)]"
			>
				<img class="object-cover" src="/images/logo_light.jpg" alt="bayou-logo" />
			</div>

			<div class="grid grid-cols-2 items-center divide-x divide-white/20">
				<div class="pr-4 text-center">
					<p class="text-sm font-medium text-white/65">Total</p>
					<p class="font-serif text-5xl leading-none font-bold text-white">${total}</p>
				</div>

				<div class="pl-4 text-center">
					<p class="text-sm font-medium text-white/65">Selected Meet Time</p>
					<p class="font-serif text-4xl leading-none font-bold text-yellow-400">
						{selectedMeetTime ?? '—'}
					</p>
				</div>
			</div>
		</div>

		<div class="flex items-center gap-3">
			<button
				class={[
					'inline-flex w-fit items-center gap-3 rounded-xl border px-6 py-3 font-semibold backdrop-blur transition disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-black/40 disabled:text-white/30 disabled:opacity-60',
					isSuccess
						? 'border-success bg-success-background text-success'
						: 'border-highlight bg-black/70 text-accent hover:border-accent/80 hover:bg-black/85 hover:text-white disabled:hover:border-white/10 disabled:hover:bg-black/40 disabled:hover:text-white/30'
				]}
				disabled={!selectedMeetTime}
				onclick={onSubmit}
			>
				<span>
					{isSuccess
						? 'Submitted'
						: !selectedMeetTime
							? 'Select Meet Time'
							: 'Continue to Checkout'}
				</span>

				{#if !isSuccess}
					<Arrow class="size-6" />
				{/if}
			</button>

			{#if error}
				<span
					class="rounded-lg border border-error/40 bg-error-background px-3 py-2 text-xs font-semibold text-error"
				>
					{error}
				</span>
			{/if}
		</div>
	</div>

	<ReservationSuccess open={!!isSuccess} onClose={() => {}} />
</section>
