import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { meetTimesDisplay, home } = await parent();

	if (!meetTimesDisplay) {
		error(500, 'No upcomming meeting times');
	}

	return { features: home.features, meetTimesDisplay };
};
