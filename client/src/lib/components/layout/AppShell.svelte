<script lang="ts">
	import type { Snippet } from 'svelte';
	import Close from '$lib/assets/icons/Close.svelte';
	import Menu from '$lib/assets/icons/Menu.svelte';
	import Arrow from '$lib/assets/icons/Arrow.svelte';
	import type { RootContent } from '../../../../../shared/types/Root';
	import HoursSection from '../ui/HoursSection.svelte';

	import { cart } from '$lib/stores/cart.svelte';
	import SectionHeader from './SectionHeader.svelte';
	import Briefcase from '$lib/assets/icons/Briefcase.svelte';

	const {
		children,
		root,
		showHeader = false
	}: {
		children: Snippet;
		root: RootContent;
		showHeader?: boolean;
	} = $props();

	const {
		branding,
		navigation,
		socials,
		business: { hours }
	} = $derived(root);

	let isMenuOpen = $state(false);

	function closeMenu() {
		isMenuOpen = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeMenu();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex min-h-screen flex-col bg-sidebar text-foreground">
	{#if showHeader}
		<header class="sticky top-0 z-30 border-b border-transparent bg-black/65 backdrop-blur-xl">
			<div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<div class="w-12">
					<button
						type="button"
						aria-expanded={isMenuOpen}
						aria-controls="bayou-menu-drawer"
						aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
						onclick={() => (isMenuOpen = !isMenuOpen)}
						class="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-accent bg-background text-xl text-foreground transition hover:border-accent hover:bg-accent/15"
					>
						{#if isMenuOpen}
							<Close class="size-6" />
						{:else}
							<Menu class="size-6 " />
						{/if}
					</button>
				</div>

				<a href="/" class="text-center leading-none">
					<span class="block text-[0.65rem] font-bold tracking-[0.35em] text-highlight uppercase">
						Bayou Boy
					</span>
					<span class="font-heading text-[1.65rem] tracking-[-0.03em] text-foreground">
						Exotics
					</span>
				</a>

				<div class="relative hidden w-12 justify-end sm:flex">
					<a href="/cart"
						><Briefcase class="h-10 text-accent opacity-80" />
						{#if cart.count > 0}<span
								class="absolute -top-1 -right-3 rounded-full bg-white px-2 py-1 text-xs font-bold text-black"
								>{cart.count}</span
							>{/if}</a
					>
				</div>

				<div class="relative w-12 sm:hidden">
					<a href="/cart"
						><Briefcase class="h-10 text-accent opacity-80" />{#if cart.count > 0}<span
								class="absolute top-0 -right-1 rounded-full bg-white px-2 py-1 text-xs font-bold text-black"
								>{cart.count}</span
							>{/if}</a
					>
				</div>
			</div>
		</header>

		{#if isMenuOpen}
			<button
				type="button"
				class="fixed inset-0 z-40 bg-black/45 backdrop-blur-[1px]"
				aria-label="Close menu overlay"
				onclick={closeMenu}
			></button>

			<aside
				id="bayou-menu-drawer"
				class="fixed top-0 left-0 z-50 h-full w-full max-w-md overflow-y-auto border-r border-border bg-background shadow-2xl"
				aria-hidden={!isMenuOpen}
			>
				<div class="sticky top-0 border-b border-border bg-surface">
					<div class="flex items-center justify-between px-4 py-4">
						<div>
							<p class="text-xs font-bold tracking-[0.3em] text-highlight uppercase">Menu</p>
							<h2 class="mt-1 font-heading text-2xl">{branding.name ?? 'Bayou Exotics'}</h2>
						</div>

						<button
							type="button"
							class="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-vintage border border-border bg-background text-xl shadow-soft transition hover:bg-accent/25"
							aria-label="Close menu"
							onclick={closeMenu}
						>
							<Close class="size-5" />
						</button>
					</div>
				</div>

				<div class="space-y-6 p-4">
					<section>
						<p class="mb-3 text-xs font-bold tracking-[0.3em] text-highlight uppercase">Explore</p>

						<div class="grid gap-3">
							{#each navigation as item (`root-${item.href}`)}
								<a
									href={item.href}
									class="rounded-vintage border border-border bg-primary p-4 shadow-soft transition hover:border-accent"
									onclick={closeMenu}
								>
									<div class="flex items-start justify-between gap-4">
										<div>
											<h3 class="font-heading text-xl leading-tight">{item.label}</h3>
											{#if item.description}
												<p class="mt-1 text-sm leading-6 text-muted">{item.description}</p>
											{/if}
										</div>

										<span class="mt-1 text-lg text-accent"><Arrow class="size-6" /></span>
									</div>
								</a>
							{/each}
						</div>
					</section>

					{#if socials.length}
						<section class="rounded-vintage border border-border bg-black/70 p-5 shadow-soft">
							<SectionHeader eyebrow="Follow" title="Instagram Pages" variant="instagram" />

							<p class="mt-2 text-sm leading-6 text-muted">
								Follow the Bayou pages for menu drops, updates, visuals, and backup announcements.
							</p>

							<div class="mt-4 grid gap-3">
								{#each socials as social (`root-social-${social.label}`)}
									<a
										href={social.url}
										target="_blank"
										rel="noreferrer"
										class="flex items-center justify-between gap-4 rounded-vintage border border-border bg-background p-4 transition hover:border-accent"
										onclick={closeMenu}
									>
										<div>
											<p class="font-semibold text-foreground">{social.label}</p>
											<p class="text-sm text-muted">{social.handle}</p>
										</div>

										<span class="text-sm font-semibold text-accent">Open</span>
									</a>
								{/each}
							</div>

							<div class="mt-4 grid gap-3">
								<img class="h-full w-full opacity-50" src="/images/logo_coon.png" alt="" />
							</div>
						</section>
					{/if}
				</div>
			</aside>
		{/if}
	{/if}
	<main class="mx-auto w-full max-w-7xl flex-1 pb-6">
		{@render children()}
	</main>

	<footer class="border-t border-border bg-black">
		<div class="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
			<div>
				<p class="font-heading text-xl text-foreground">{branding.name ?? 'Bayou Exotics'}</p>
				<p class="mt-1 text-sm text-muted">
					{branding.tagline ?? 'Exotic finds with Louisiana soul.'}
				</p>
				<HoursSection {hours} />
				<p class="mt-4 text-sm text-muted">© 2026 Bayou Exotics.</p>
			</div>

			{#if socials.length}
				<div>
					<p class="mb-3 text-xs font-bold tracking-[0.3em] text-highlight uppercase">Follow</p>
					<div class="flex flex-wrap gap-2 lg:justify-end">
						{#each socials as social (`root-footer-social-${social.label}`)}
							<a
								href={social.url}
								target="_blank"
								rel="noreferrer"
								class="rounded-vintage border-border bg-background px-3 py-2 text-sm transition hover:border-accent"
							>
								<span class="font-semibold">{social.label}</span>
								<span class="ml-1 text-muted">{social.handle}</span>
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</footer>
</div>
