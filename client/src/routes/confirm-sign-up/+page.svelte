<!-- src/routes/confirm-sign-up/+page.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	import Arrow from '$lib/assets/icons/Arrow.svelte';
	import AuthPage from '$lib/components/layout/AuthPage.svelte';
	import { goto } from '$app/navigation';
	import { confirmUserSignUp, resendConfirmationCode } from '$lib/api/auth';
	import { auth } from '$lib/stores/auth.svelte';
	import { onMount } from 'svelte';

	const email = $derived(page.url.searchParams.get('email') ?? '');
	let error = $state('');

	const handleConfirm = async (event: SubmitEvent) => {
		event.preventDefault();
		error = '';
		isSubmitting = true;

		try {
			await confirmUserSignUp(email, confirmationCode);
			await goto(resolve('/login'));
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unable to confirm your account.';
		} finally {
			isSubmitting = false;
		}
	};

	const handleResend = async () => {
		error = '';
		isResending = true;

		try {
			await resendConfirmationCode(email);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unable to resend confirmation code.';
		} finally {
			isResending = false;
		}
	};

	onMount(async () => {
		if (!auth.isAuthenticated) {
			await auth.load();
		}

		if (auth.isAuthenticated) {
			await goto(resolve('/waiting-room'));
		}
	});

	let confirmationCode = $state('');
	let isSubmitting = $state(false);
	let isResending = $state(false);
</script>

<svelte:head>
	<title>Confirm Your Account | Bayou Boy Exotics</title>
	<meta
		name="description"
		content="Confirm your email address to finish creating your Bayou Boy Exotics account."
	/>
</svelte:head>

<AuthPage
	image="/images/confirmation.png"
	imageAlt="Bayou Boy otter fishing beside the bayou"
	titleLead="Almost"
	titleAccent="there."
	description="We sent a confirmation code to your email. Enter it below to finish creating your account."
>
	<form class="space-y-5" onsubmit={handleConfirm}>
		{#if email}
			<div class="rounded-vintage border border-border bg-background/20 px-4 py-3">
				<p class="text-xs font-bold tracking-[0.14em] text-accent uppercase">
					Confirmation sent to
				</p>

				<p class="mt-1 truncate text-sm text-foreground">
					{email}
				</p>
			</div>
		{/if}

		<label class="block">
			<span class="mb-2 block text-xs font-bold tracking-[0.14em] text-accent uppercase">
				Confirmation Code
			</span>

			<input
				type="text"
				name="confirmationCode"
				inputmode="numeric"
				autocomplete="one-time-code"
				required
				bind:value={confirmationCode}
				placeholder="Enter your code"
				class="w-full rounded-vintage border border-border bg-background/30 px-4 py-3.5 text-center text-lg tracking-[0.35em] text-foreground placeholder:text-sm placeholder:tracking-normal placeholder:text-muted/50 focus:border-accent focus:ring-accent"
			/>
		</label>

		{#if error}
			<p
				role="alert"
				class="rounded-vintage border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-200"
			>
				{error}
			</p>
		{/if}

		<button
			type="submit"
			disabled={isSubmitting}
			class="group flex w-full items-center justify-center gap-3 rounded-vintage border border-highlight bg-black/70 px-5 py-3.5 font-bold text-accent transition hover:border-accent/80 hover:bg-black/85 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
		>
			<span>{isSubmitting ? 'Confirming...' : 'Confirm Account'}</span>

			{#if !isSubmitting}
				<Arrow class="size-4 transition-transform group-hover:translate-x-1" />
			{/if}
		</button>

		<div class="flex items-center gap-4 py-1">
			<div class="h-px flex-1 bg-border"></div>
			<span class="text-xs font-semibold text-muted">DIDN'T GET IT?</span>
			<div class="h-px flex-1 bg-border"></div>
		</div>

		<button
			type="button"
			disabled={isResending}
			onclick={handleResend}
			class="mx-auto block text-sm font-semibold text-accent transition hover:text-white disabled:opacity-50"
		>
			{isResending ? 'Sending...' : 'Resend confirmation code'}
		</button>

		<p class="text-center text-sm text-muted">
			Wrong email?
			<a
				href={resolve('/sign-up')}
				class="ml-1 inline-flex items-center gap-1.5 font-semibold text-highlight"
			>
				Go Back
				<Arrow class="size-3.5" />
			</a>
		</p>
	</form>
</AuthPage>
