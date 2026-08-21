import { getContent } from '$lib/api/content';
import { buildAvailabilityCalendar } from '$lib/utils/buildAvailabilityCalendar';
import { buildMeetTimesCard } from '$lib/utils/buildMeetTimesCard';
import type { LayoutLoad } from './$types';

export const ssr = false;
export const prerender = 'auto';

export const load: LayoutLoad = async ({ fetch }) => {
	const { root, home, menu, availability } = await getContent(fetch);

	const { closedMessage, meetTimesDisplay } = buildMeetTimesCard({
		hours: root.business.hours,
		...availability
	});

	const calendarProps = buildAvailabilityCalendar({
		hours: root.business.hours,
		...availability
	});

	return {
		availability,
		home,
		calendarProps,
		root,
		closedMessage,
		meetTimesDisplay,
		menu
	};
};
