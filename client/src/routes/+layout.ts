import rootContent from '$lib/data/root.json';
import availabilityContent from '$lib/data/availability.json';
import type { AvailabilityContent } from '../../../shared/types/Availability';
import type { RootContent } from '../../../shared/types/Root';

import type { LayoutLoad } from './$types';

export const ssr = false;
export const prerender = 'auto';

const fallbackContent = rootContent as unknown as RootContent;
const availabilityFallback = availabilityContent as unknown as AvailabilityContent;

export const load: LayoutLoad = async ({ fetch }) => {
	if (import.meta.env.VITE_IS_MOCK === 'true') {
		return { root: fallbackContent, availability: availabilityFallback };
	}

	const root = await fetch('/data/root.json').then((r) => r.json());

	return {
		availability: availabilityFallback,
		root
	};
};
