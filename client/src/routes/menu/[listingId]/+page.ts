import { error } from '@sveltejs/kit';

import menuContent from '$lib/data/menu.json';
import type { MenuContent } from '../../../../../shared/types/Menu';

import type { PageLoad } from './$types';

const fallbackMenu = menuContent as unknown as MenuContent;

export const load: PageLoad = async ({ params, fetch }) => {
	const menu =
		import.meta.env.VITE_IS_MOCK === 'true'
			? fallbackMenu
			: ((await (await fetch('/data/menu.json')).json()) as MenuContent);

	const listing = menu.listings.find((item) => item.id === params.listingId && item.active);

	if (!listing) {
		throw error(404, 'Listing not found');
	}

	const category = menu.categories.find((item) => item.id === listing.categoryId);

	const relatedListings = menu.listings
		.filter(
			(item) => item.active && item.categoryId === listing.categoryId && item.id !== listing.id
		)
		.slice(0, 4);

	return {
		listing,
		category,
		relatedListings
	};
};
