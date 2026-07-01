<script lang="ts">
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import '../app.css';

	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	const { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<AppShell root={data.root}>
	{@render children()}
</AppShell>
