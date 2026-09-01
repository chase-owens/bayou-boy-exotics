<script lang="ts">
	type Props = {
		open: boolean;
		onClose: () => void;
	};

	let { open, onClose }: Props = $props();
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-6"
		role="presentation"
		onclick={onClose}
	>
		<div
			class="w-full rounded-t-vintage border border-border bg-surface p-6 shadow-soft sm:max-w-md sm:rounded-vintage"
			role="dialog"
			aria-modal="true"
			aria-labelledby="reservation-success-title"
			onclick={(event) => event.stopPropagation()}
		>
			<div class="mx-auto mb-5 h-1.5 w-12 rounded-full bg-white/20 sm:hidden"></div>

			<div class="text-center">
				<div
					class="mx-auto flex size-12 items-center justify-center rounded-full bg-success-background text-2xl text-success"
				>
					✓
				</div>

				<p class="mt-5 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
					Request Sent
				</p>

				<h2 id="reservation-success-title" class="mt-2 text-2xl font-bold text-foreground">
					We got it.
				</h2>

				<p class="mt-4 text-sm leading-6 text-muted">
					Your reservation request has been sent to Bayou Boy Exotics. We’ll review it and get back
					to you shortly.
				</p>
			</div>

			<button
				type="button"
				class="btn-base mt-6 w-full bg-accent font-semibold text-primary"
				onclick={onClose}
			>
				Got it
			</button>
		</div>
	</div>
{/if}
