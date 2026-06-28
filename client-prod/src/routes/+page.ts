import type { HomeContent } from '../../../shared/types/Home.ts';
import type { AvailabilityContent } from '../../../shared/types/Availability.ts';
import type { Raffle } from '../../../shared/types/Raffle.ts';
import homeContent from '$lib/data/home.json';
import raffle from '$lib/data/raffle.json';
import availabilityContent from '$lib/data/availability.json';
import type { PageLoad } from './$types';
const fallbackContent = homeContent as unknown as HomeContent;
const availabilityFallback = availabilityContent as unknown as AvailabilityContent;
const raffleFallback = raffle as unknown as Raffle;

export const load: PageLoad = async ({ fetch }) => {
	if (import.meta.env.VITE_IS_MOCK === 'true') {
		return { availability: availabilityFallback, home: fallbackContent, raffle: raffleFallback };
	}

	const response = await fetch('/data/home.json');

	if (!response.ok) {
		throw new Error('Unable to load home content.');
	}

	const home = (await response.json()) as HomeContent;

	return {
		availability: availabilityFallback,
		home,
		raffle: raffleFallback
	};
};
