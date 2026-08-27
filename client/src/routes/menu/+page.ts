import type { HomeContent } from '../../../../shared/types/Home';
import type { MenuContent } from '../../../../shared/types/Menu';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { menu, home }: { menu: MenuContent; home: HomeContent } = await parent();

	const activeCategories = menu.categories.filter((category) => category.active);

	const activeListings = menu.listings.filter((listing) => listing.active);

	return { activeCategories, activeListings, menu, features: home.features };
};
