import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { meetTimesDisplay, home } = await parent();

	return { features: home.features, meetTimesDisplay };
};
