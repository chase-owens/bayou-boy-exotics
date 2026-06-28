import rootContent from '$lib/data/root.json';
import type { RootContent } from '../../../shared/types/Root';

import type { LayoutLoad } from './$types';

export const ssr = false;
export const prerender = 'auto';

const fallbackContent = rootContent as unknown as RootContent;

export const load: LayoutLoad = async ({ fetch }) => {
	if (import.meta.env.VITE_IS_MOCK === 'true') {
		return { root: fallbackContent };
	}

	const root = await fetch('/data/root.json').then((r) => r.json());

	return {
		root
	};
};
