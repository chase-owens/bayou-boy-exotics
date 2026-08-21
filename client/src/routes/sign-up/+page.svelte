<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	import { registerUser } from '$lib/api/auth';
	import Arrow from '$lib/assets/icons/Arrow.svelte';
	import AuthPage from '$lib/components/layout/AuthPage.svelte';
	import { auth } from '$lib/stores/auth.svelte';
	import { onMount } from 'svelte';

	let email = $state('');
	let name = $state('');
	let password = $state('');
	let phone = $state('');
	let confirmPassword = $state('');

	let isSubmitting = $state(false);
	let error = $state('');

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();

		error = '';

		if (password !== confirmPassword) {
			error = 'Passwords do not match.';
			return;
		}

		isSubmitting = true;

		try {
			await registerUser({
				email,
				password,
				name,
				phone
			});

			await goto(resolve(`/confirm-sign-up?email=${encodeURIComponent(email.trim())}`));
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unable to create your account.';
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
	<title>Sign Up | Bayou Boy Exotics</title>
	<meta name="description" content="Create your Bayou Boy Exotics account and request access." />
</svelte:head>

<AuthPage
	image="/images/sign-up.png"
	imageAlt="Bayou Boy raccoon relaxing beside the bayou"
	titleLead="Join the"
	titleAccent="Bayou."
	description="Create your account to request access to Bayou Boy Exotics."
>
	<form class="space-y-5" onsubmit={handleSubmit}>
		<label class="block">
			<span class="mb-2 block text-xs font-bold tracking-[0.14em] text-accent uppercase">
				Name
			</span>

			<input
				type="text"
				name="name"
				autocomplete="name"
				required
				bind:value={name}
				placeholder="Your name"
				class="w-full rounded-vintage border border-border bg-background/30 px-4 py-3.5 text-foreground placeholder:text-muted/50 focus:border-accent focus:ring-accent"
			/>
		</label>

		<label class="block">
			<span class="mb-2 block text-xs font-bold tracking-[0.14em] text-accent uppercase">
				Phone Number
			</span>

			<input
				type="tel"
				name="phone"
				autocomplete="tel"
				required
				bind:value={phone}
				placeholder="(214) 304-8888"
				class="w-full rounded-vintage border border-border bg-background/30 px-4 py-3.5 text-foreground placeholder:text-muted/50 focus:border-accent focus:ring-accent"
			/>
		</label>

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
				autocomplete="new-password"
				required
				bind:value={password}
				class="w-full rounded-vintage border border-border bg-background/30 px-4 py-3.5 text-foreground focus:border-accent focus:ring-accent"
			/>
		</label>

		<label class="block">
			<span class="mb-2 block text-xs font-bold tracking-[0.14em] text-accent uppercase">
				Confirm Password
			</span>

			<input
				type="password"
				name="confirmPassword"
				autocomplete="new-password"
				required
				bind:value={confirmPassword}
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
			<span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>

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
			Already one of the regulars?
			<a
				href={resolve('/login')}
				class="ml-1 inline-flex items-center gap-1.5 font-semibold text-accent"
			>
				Log In
				<Arrow class="size-3.5" />
			</a>
		</p>
	</form>
</AuthPage>
