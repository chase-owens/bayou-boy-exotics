<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	import { logInUser } from '$lib/api/auth';
	import Arrow from '$lib/assets/icons/Arrow.svelte';
	import AuthPage from '$lib/components/layout/AuthPage.svelte';
	import { auth } from '$lib/stores/auth.svelte';
	import { onMount } from 'svelte';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let isSubmitting = $state(false);

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();

		error = '';
		isSubmitting = true;

		try {
			await logInUser(email, password);

			await auth.load();

			if (auth.isApproved) {
				await goto(resolve('/'));
				return;
			}

			await goto(resolve('/waiting-room'));
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unable to log in.';
		} finally {
			isSubmitting = false;
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
</script>

<svelte:head>
	<title>Log In | Bayou Boy Exotics</title>
	<meta name="description" content="Log in to your Bayou Boy Exotics account." />
</svelte:head>

<AuthPage
	image="/images/login.png"
	imageAlt="Bayou Boy white ibis relaxing in the bayou at sunset"
	titleLead="Welcome"
	titleAccent="back."
	description="Log in to access your account."
>
	<form class="space-y-5" onsubmit={handleSubmit}>
		<label class="block">
			<span class="mb-2 block text-xs font-bold tracking-[0.14em] text-accent uppercase">
				Email
			</span>

			<input
				type="email"
				name="email"
				autocomplete="email"
				required
				bind:value={email}
				placeholder="you@email.com"
				class="w-full rounded-vintage border border-border bg-background/30 px-4 py-3.5 text-foreground placeholder:text-muted/50 focus:border-accent focus:ring-accent"
			/>
		</label>

		<label class="block">
			<span class="mb-2 block text-xs font-bold tracking-[0.14em] text-accent uppercase">
				Password
			</span>

			<input
				type="password"
				name="password"
				autocomplete="current-password"
				required
				bind:value={password}
				class="w-full rounded-vintage border border-border bg-background/30 px-4 py-3.5 text-foreground focus:border-accent focus:ring-accent"
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
			<span>{isSubmitting ? 'Logging In...' : 'Log In'}</span>

			{#if !isSubmitting}
				<Arrow class="size-4 transition-transform group-hover:translate-x-1" />
			{/if}
		</button>

		<div class="flex items-center gap-4 py-1">
			<div class="h-px flex-1 bg-border"></div>
			<span class="text-xs font-semibold text-muted">OR</span>
			<div class="h-px flex-1 bg-border"></div>
		</div>

		<p class="text-center text-sm text-muted">
			Don't have an account?
			<a
				href={resolve('/sign-up')}
				class="ml-1 inline-flex items-center gap-1.5 font-semibold text-accent"
			>
				Sign Up
				<Arrow class="size-3.5" />
			</a>
		</p>

		<button
			type="button"
			class="mx-auto block text-sm text-highlight transition hover:text-foreground"
		>
			Forgot your password?
		</button>
	</form>
</AuthPage>
