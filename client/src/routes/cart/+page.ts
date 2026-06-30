import { buildMeetTimesCard } from '$lib/utils/buildMeetTimesCard';
import { error } from '@sveltejs/kit';
import type { AvailabilityContent } from '../../../../shared/types/Availability';
import type { RootContent } from '../../../../shared/types/Root';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { root, availability }: { root: RootContent; availability: AvailabilityContent } =
		await parent();

	const now = new Date();

	const { meetTimesDisplay } = buildMeetTimesCard({
		hours: root.business.hours,
		...availability,
		now
	});

	if (!meetTimesDisplay) {
		error(500, 'No upcomming meeting times');
	}

	return {
		meetTimesDisplay
	};
};
