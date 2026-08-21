<script lang="ts">
	import '../app.css';

	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { configureAmplify } from '$lib/config/amplify';
	import { auth } from '$lib/stores/auth.svelte';

	import type { LayoutData } from './$types';
	import { onMount, type Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	const anonymousOnlyRoutes = ['/sign-up', '/confirm-sign-up', '/login'];
	const protectedRoutes = ['/', '/cart', '/menu'];

	const isProtectedRoute = (pathname: string) =>
		protectedRoutes.some(
			(route) => pathname === route || (route !== '/' && pathname.startsWith(`${route}/`))
		);

	const { children, data }: { children: Snippet; data: LayoutData } = $props();

	configureAmplify();

	onMount(async () => {
		await auth.load();
	});

	$effect(() => {
		if (auth.isLoading) return;

		const pathname = page.url.pathname;

		if (pathname === '/waiting-room') return;

		if (auth.isAuthenticated && anonymousOnlyRoutes.includes(pathname)) {
			goto(resolve('/waiting-room'));
			return;
		}

		if ((!auth.isAuthenticated || !auth.isApproved) && isProtectedRoute(pathname)) {
			goto(resolve('/waiting-room'));
		}
	});
</script>

<AppShell root={data.root} showHeader={isProtectedRoute(page.url.pathname)}>
	{@render children()}
</AppShell>
