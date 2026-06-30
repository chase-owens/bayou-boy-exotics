<script lang="ts">
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import '../app.css';

	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	const { root } = data;
</script>

<svelte:head>
	<title>{root.branding.name}</title>
	<meta
		name="description"
		content={root.branding.tagline ??
			'Bayou Exotics — curated exotic flower and specialty finds with Louisiana soul.'}
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<AppShell
	branding={root.branding}
	navigation={root.navigation}
	socials={root.socials}
	hours={root.business.hours}
>
	{@render children()}
</AppShell>
