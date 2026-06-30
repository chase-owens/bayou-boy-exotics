<script lang="ts">
	type Variant = 'info' | 'success' | 'warning' | 'error';

	type Props = {
		title: string;
		message: string;
		variant?: Variant;
	};

	let { title, message, variant = 'info' }: Props = $props();

	const styles = {
		info: {
			border: 'border-border',
			icon: 'ℹ'
		},
		success: {
			border: 'border-green-500/40',
			icon: '✓'
		},
		warning: {
			border: 'border-accent/40',
			icon: '⏰'
		},
		error: {
			border: 'border-red-500/40',
			icon: '!'
		}
	};

	const style = $derived(styles[variant]);
</script>

<section class={`rounded-vintage border bg-surface p-4 shadow-soft ${style.border}`}>
	<div class="flex items-start gap-3">
		<div class="flex h-10 w-10 items-center justify-center rounded-full bg-background text-lg">
			{style.icon}
		</div>

		<div class="min-w-0 flex-1">
			<p class="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
				{title}
			</p>

			<p class="mt-2 text-base font-semibold text-foreground">
				{message}
			</p>
		</div>
	</div>
</section>
