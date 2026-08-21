import { getAvailabilityContent } from './availability';
import type { Fetcher } from './getJson';
import { getHomeContent } from './home';
import { getMenuContent } from './menu';
import { getRootContent } from './root';

export const getContent = async (fetcher: Fetcher) => {
	const [root, home, menu, availability] = await Promise.all([
		getRootContent(fetcher),
		getHomeContent(fetcher),
		getMenuContent(fetcher),
		getAvailabilityContent(fetcher)
	]);

	return {
		root,
		home,
		menu,
		availability
	};
};
