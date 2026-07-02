import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { MenuContent } from '../../../../../shared/types/Menu';
import type { Listing } from '../../../../../shared/types/Listing';
import { page } from '$app/state';

export const load: PageLoad = async ({ params, parent }) => {
	const { menu }: { menu: MenuContent } = await parent();

	const listing = menu.listings.find((item) => item.id === params.listingId && item.active);

	if (!listing) {
		throw error(404, 'Listing not found');
	}

	const category = menu.categories.find((item) => item.id === listing.categoryId);

	const relatedListings = menu.listings
		.filter(
			(item) => item.active && item.categoryId === listing.categoryId && item.id !== listing.id
		)
		.slice(0, 4) as Listing[];

	const priceOptionId = page.url.searchParams.get('editOption');

	return {
		listing: listing as Listing,
		categoryLabel: category?.label ?? ('' as string),
		relatedListings,
		priceOptionId,
		primaryImage: listing.images?.[0] ?? ('' as string)
	};
};
