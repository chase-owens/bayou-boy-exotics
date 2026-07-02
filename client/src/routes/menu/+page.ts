import type { PageLoad } from '../$types';
import type { HomeContent } from '../../../../shared/types/Home';
import type { MenuContent } from '../../../../shared/types/Menu';

export const load: PageLoad = async ({ parent }) => {
	const { menu, home }: { menu: MenuContent; home: HomeContent } = await parent();

	const activeCategories = menu.categories
		.filter((category) => category.active)
		.sort((a, b) => a.sortOrder - b.sortOrder);

	const activeListings = menu.listings
		.filter((listing) => listing.active)
		.sort((a, b) => a.sortOrder - b.sortOrder);

	if (import.meta.env.VITE_IS_MOCK === 'true') {
		return { activeCategories, activeListings, menu };
	}

	return { activeCategories, activeListings, menu, features: home.features };
};
