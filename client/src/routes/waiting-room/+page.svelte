<script lang="ts">
	import { resolve } from '$app/paths';
	import Arrow from '$lib/assets/icons/Arrow.svelte';
	import { auth } from '$lib/stores/auth.svelte';
	import { goto } from '$app/navigation';
	import { logOutUser } from '$lib/api/auth';
	const heroButton =
		'group flex items-center justify-center gap-3 rounded-vintage px-4 py-3 text-sm font-bold backdrop-blur transition sm:px-5 sm:py-3.5';

	let isSigningOut = $state(false);

	const handleSignOut = async () => {
		isSigningOut = true;

		try {
			await logOutUser();
			auth.clear();
			await goto(resolve('/'));
		} finally {
			isSigningOut = false;
		}
	};

	$effect(() => {
		console.log('auth:', auth.isAuthenticated, auth.isApproved, auth.isPending);
	});
</script>

<svelte:head>
	<title>Welcome to the Bayou | Bayou Boy Exotics</title>
	<meta
		name="description"
		content="Premium Products. Premium Service. Request access to Bayou Boy Exotics."
	/>
</svelte:head>

<section class=" relative bg-background text-foreground">
	<div class="relative">
		<img src="/images/bayou-crew.png" alt="" class="block h-auto w-full" />

		<div
			class="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,3,13,0.94)_0%,rgba(8,3,13,0.72)_30%,rgba(8,3,13,0.22)_58%,transparent_82%)]"
		></div>

		<div class="absolute inset-0 z-20 flex items-center px-5 sm:px-8 md:px-10 lg:px-[5%]">
			<div class="w-full max-w-sm sm:w-[58%] sm:max-w-md md:w-[48%] lg:w-[42%] lg:max-w-xl">
				{#if auth.isPending}
					<p class="text-xs font-semibold tracking-[0.3em] text-accent uppercase">
						Access Requested
					</p>

					<h1
						class="mt-3 font-heading text-3xl leading-[1.02] font-bold tracking-[-0.035em] text-foreground sm:text-4xl md:text-5xl lg:text-6xl"
					>
						Welcome to
						<br />

						<span class="relative inline-block w-fit text-accent">
							<span class="relative z-10 whitespace-nowrap">the Bayou, {auth.user?.name}.</span>
							<span
								class="absolute bottom-0 left-0 z-0 h-1 w-full -rotate-1 rounded-full bg-highlight"
							></span>
						</span>
					</h1>

					<p class="mt-5 max-w-lg text-sm leading-6 text-muted md:mt-6 md:text-base lg:text-lg">
						Your access request is in. Bayou Boy will let you know when you're approved.
					</p>
				{:else}<p class="text-xs font-semibold tracking-[0.3em] text-accent uppercase">
						Bayou Boy Exotics
					</p>

					<h1
						class="mt-3 font-heading text-3xl leading-[1.02] font-bold tracking-[-0.035em] text-foreground sm:text-4xl md:text-5xl lg:text-6xl"
					>
						Welcome to
						<br />

						<span class="relative inline-block w-fit text-accent">
							<span class="relative z-10 whitespace-nowrap">the Bayou.</span>

							<span
								class="absolute bottom-0 left-0 z-0 h-1 w-full -rotate-1 rounded-full bg-highlight"
							></span>
						</span>
					</h1>

					<p class="mt-5 text-sm leading-6 text-muted md:mt-6 md:text-base lg:text-lg">
						Premium Products. Premium Service.
					</p>{/if}

				<div class="mt-5 hidden gap-3 sm:flex md:mt-6">
					{#if !auth.isAuthenticated}
						<a
							href={resolve('/sign-up')}
							class={`${heroButton} border border-highlight bg-black/70 text-accent hover:border-accent/80 hover:bg-black/85 hover:text-white`}
						>
							<span>Sign Up</span>
							<Arrow class="size-4 transition-transform group-hover:translate-x-1" />
						</a>

						<a
							href={resolve('/login')}
							class={`${heroButton} border border-highlight bg-primary/80 text-foreground hover:border-accent/80 hover:bg-highlight`}
						>
							<span>Log In</span>
							<Arrow class="size-4 transition-transform group-hover:translate-x-1" />
						</a>
					{:else}
						{#if !auth.isPending}
							<a
								href={resolve('/')}
								class={`${heroButton} border border-highlight bg-primary/80 text-foreground hover:border-accent/80 hover:bg-highlight`}
							>
								<span>Go Home</span>
								<Arrow class="size-4 transition-transform group-hover:translate-x-1" />
							</a>
						{/if}

						<button
							type="button"
							onclick={handleSignOut}
							disabled={isSigningOut}
							class={`${heroButton} border border-highlight bg-black/70 text-accent hover:border-accent/80 hover:bg-black/85 hover:text-white disabled:cursor-not-allowed disabled:opacity-50`}
						>
							<span>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
	<div class="flex flex-col gap-3 bg-black px-5 py-5 sm:hidden">
		{#if !auth.isAuthenticated}
			<a
				href={resolve('/sign-up')}
				class={`${heroButton} border border-highlight bg-black/70 text-accent hover:border-accent/80 hover:bg-black/85 hover:text-white`}
			>
				<span>Sign Up</span>
				<Arrow class="size-4 transition-transform group-hover:translate-x-1" />
			</a>

			<a
				href={resolve('/login')}
				class={`${heroButton} border border-highlight bg-primary/80 text-foreground hover:border-accent/80 hover:bg-highlight`}
			>
				<span>Log In</span>
				<Arrow class="size-4 transition-transform group-hover:translate-x-1" />
			</a>
		{:else}
			{#if !auth.isPending}
				<a
					href={resolve('/')}
					class={`${heroButton} border border-highlight bg-primary/80 text-foreground hover:border-accent/80 hover:bg-highlight`}
				>
					<span>Go Home</span>
					<Arrow class="size-4 transition-transform group-hover:translate-x-1" />
				</a>
			{/if}

			<button
				type="button"
				onclick={handleSignOut}
				disabled={isSigningOut}
				class={`${heroButton} border border-highlight bg-black/70 text-accent hover:border-accent/80 hover:bg-black/85 hover:text-white disabled:cursor-not-allowed disabled:opacity-50`}
			>
				<span>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>
			</button>
		{/if}
	</div>
</section>
