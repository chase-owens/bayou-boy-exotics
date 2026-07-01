<script lang="ts">
	import type { Snippet } from 'svelte';
	import Close from '$lib/assets/icons/Close.svelte';
	import Menu from '$lib/assets/icons/Menu.svelte';
	import Arrow from '$lib/assets/icons/Arrow.svelte';
	import type { RootContent } from '../../../../../shared/types/Root';
	import HoursSection from '../ui/HoursSection.svelte';
	import Bag from '../../assets/icons/Bag.svelte';

	import { cart } from '$lib/stores/cart.svelte';
	import SectionHeader from './SectionHeader.svelte';

	const {
		children,
		root
	}: {
		children: Snippet;
		root: RootContent;
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

<div class="bg-sidebar text-foreground min-h-screen">
	<header class="bg-black/65 backdrop-blur-xl border-transparent sticky top-0 z-30 border-b">
		<div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
			<div class="w-12">
				<button
					type="button"
					aria-expanded={isMenuOpen}
					aria-controls="bayou-menu-drawer"
					aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
					onclick={() => (isMenuOpen = !isMenuOpen)}
					class="border-border bg-background text-foreground hover:border-accent hover:bg-accent/15 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border text-xl transition"
				>
					{#if isMenuOpen}
						<Close class="size-6" />
					{:else}
						<Menu class="size-6" />
					{/if}
				</button>
			</div>

			<a href="/" class="text-center leading-none">
				<span class="text-highlight block text-[0.65rem] font-bold tracking-[0.35em] uppercase">
					Bayou Boy
				</span>
				<span class="font-heading text-foreground text-[1.65rem] tracking-[-0.03em]">
					Exotics
				</span>
			</a>

			<div class="hidden w-12 justify-end sm:flex">
				<a href="/cart"
					><Bag class="h-10 text-accent" />
					{#if cart.count > 0}<span
							class="absolute text-xs top-4 right-3 rounded-full bg-white text-black font-bold px-2 py-1"
							>{cart.count}</span
						>{/if}</a
				>
			</div>

			<div class="w-12 sm:hidden relative">
				<a href="/cart"
					><Bag class="h-10 text-accent" />{#if cart.count > 0}<span
							class="absolute text-xs top-0 -right-1 rounded-full bg-white text-black font-bold px-2 py-1"
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
			class="border-border bg-background fixed top-0 left-0 z-50 h-full w-full max-w-md overflow-y-auto border-r shadow-2xl"
			aria-hidden={!isMenuOpen}
		>
			<div class="border-border bg-surface sticky top-0 border-b">
				<div class="flex items-center justify-between px-4 py-4">
					<div>
						<p class="text-highlight text-xs font-bold tracking-[0.3em] uppercase">Menu</p>
						<h2 class="font-heading mt-1 text-2xl">{branding.name ?? 'Bayou Exotics'}</h2>
					</div>

					<button
						type="button"
						class="rounded-vintage border-border bg-background shadow-soft hover:bg-accent/25 inline-flex h-10 w-10 cursor-pointer items-center justify-center border text-xl transition"
						aria-label="Close menu"
						onclick={closeMenu}
					>
						<Close class="size-5" />
					</button>
				</div>
			</div>

			<div class="space-y-6 p-4">
				<section>
					<p class="text-highlight mb-3 text-xs font-bold tracking-[0.3em] uppercase">Explore</p>

					<div class="grid gap-3">
						{#each navigation as item}
							<a
								href={item.href}
								class="rounded-vintage border border-border bg-primary shadow-soft hover:border-accent p-4 transition"
								onclick={closeMenu}
							>
								<div class="flex items-start justify-between gap-4">
									<div>
										<h3 class="font-heading text-xl leading-tight">{item.label}</h3>
										{#if item.description}
											<p class="text-muted mt-1 text-sm leading-6">{item.description}</p>
										{/if}
									</div>

									<span class="text-accent mt-1 text-lg"><Arrow class="size-6" /></span>
								</div>
							</a>
						{/each}
					</div>
				</section>

				{#if socials.length}
					<section class="rounded-vintage border-border bg-black/70 border p-5 shadow-soft">
						<SectionHeader eyebrow="Follow" title="Instagram Pages" variant="instagram" />

						<p class="text-muted mt-2 text-sm leading-6">
							Follow the Bayou pages for menu drops, updates, visuals, and backup announcements.
						</p>

						<div class="mt-4 grid gap-3">
							{#each socials as social}
								<a
									href={social.url}
									target="_blank"
									rel="noreferrer"
									class="rounded-vintage border-border hover:border-accent flex items-center justify-between gap-4 border bg-background p-4 transition"
									onclick={closeMenu}
								>
									<div>
										<p class="font-semibold text-foreground">{social.label}</p>
										<p class="text-muted text-sm">{social.handle}</p>
									</div>

									<span class="text-accent text-sm font-semibold">Open</span>
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

	<main class="mx-auto w-full max-w-7xl pb-6">
		{@render children()}
	</main>

	<footer class="border-border bg-black border-t">
		<div class="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
			<div>
				<p class="font-heading text-foreground text-xl">{branding.name ?? 'Bayou Exotics'}</p>
				<p class="text-muted mt-1 text-sm">
					{branding.tagline ?? 'Exotic finds with Louisiana soul.'}
				</p>
				<HoursSection {hours} />
				<p class="text-muted mt-4 text-sm">© 2026 Bayou Exotics.</p>
			</div>

			{#if socials.length}
				<div>
					<p class="text-highlight mb-3 text-xs font-bold tracking-[0.3em] uppercase">Follow</p>
					<div class="flex flex-wrap gap-2 lg:justify-end">
						{#each socials as social}
							<a
								href={social.url}
								target="_blank"
								rel="noreferrer"
								class="rounded-vintage border-border hover:border-accent bg-background px-3 py-2 text-sm transition"
							>
								<span class="font-semibold">{social.label}</span>
								<span class="text-muted ml-1">{social.handle}</span>
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</footer>
</div>
