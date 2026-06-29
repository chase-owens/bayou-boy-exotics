<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Hours } from '../../../../../shared/types/Root';
	import HoursSection from '../ui/HoursSection.svelte';

	type NavigationItem = {
		label: string;
		href: string;
		description?: string;
	};

	type SocialLink = {
		label: string;
		platform?: string;
		handle: string;
		url: string;
	};

	type Branding = {
		name?: string;
		tagline?: string;
	};

	const {
		children,
		branding = {
			name: 'Bayou Exotics',
			tagline: 'Exotic finds with Louisiana soul.'
		},
		hours,
		navigation = [],
		socials = []
	}: {
		children: Snippet;
		branding?: Branding;
		hours: Hours;
		navigation?: NavigationItem[];
		socials?: SocialLink[];
	} = $props();

	let isMenuOpen = $state(false);

	const fallbackNavItems: NavigationItem[] = [
		{
			label: 'Home',
			href: '/',
			description: 'Featured drops, updates, and the Bayou story.'
		},
		{
			label: 'Flower',
			href: '/flower',
			description: 'Explore exotic flower selections and availability.'
		},
		{
			label: 'Other',
			href: '/other',
			description: 'Accessories, add-ons, limited finds, and future categories.'
		}
	];

	const navItems = $derived(navigation.length ? navigation : fallbackNavItems);

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
	<header class="bg-surface/95 border-border sticky top-0 z-30 border-b backdrop-blur">
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
					{isMenuOpen ? '×' : '☰'}
				</button>
			</div>

			<a href="/" class="text-center leading-none">
				<span class="text-highlight block text-[0.65rem] font-bold tracking-[0.35em] uppercase">
					Bayou
				</span>
				<span class="font-heading text-foreground text-[1.65rem] tracking-[-0.03em]">
					Exotics
				</span>
			</a>

			<div class="hidden w-12 justify-end sm:flex"></div>

			<div class="w-12 sm:hidden"></div>
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
						×
					</button>
				</div>
			</div>

			<div class="space-y-6 p-4">
				<section>
					<p class="text-highlight mb-3 text-xs font-bold tracking-[0.3em] uppercase">Explore</p>

					<div class="grid gap-3">
						{#each navItems as item}
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

									<span class="text-accent mt-1 text-lg">→</span>
								</div>
							</a>
						{/each}
					</div>
				</section>

				{#if socials.length}
					<section class="rounded-vintage border-border bg-surface border p-5 shadow-soft">
						<p class="text-highlight mb-3 text-xs font-bold tracking-[0.3em] uppercase">Follow</p>
						<h3 class="font-heading text-2xl">Instagram Pages</h3>
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
					</section>
				{/if}

				<section
					class="mt-6 border hover:border-accent rounded-vintage bg-surface p-5 text-primary-foreground shadow-soft"
				>
					<p class="text-xs font-bold tracking-[0.3em] uppercase text-primary-foreground/75">
						Coming Next
					</p>
					<h3 class="font-heading mt-2 text-2xl text-primary-foreground">Built to grow</h3>
					<p class="mt-2 text-sm leading-6 text-primary-foreground/80">
						Start with three routes now. Add categories, product detail pages, account flows,
						orders, approvals, or admin links later without reworking the shell.
					</p>
				</section>
			</div>
		</aside>
	{/if}

	<main class="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
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
				<p class="text-muted mt-4 text-sm text-secondary">© 2026 Bayou Exotics.</p>
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
