import rootContent from '$lib/data/root.json';
import availabilityContent from '$lib/data/availability.json';
import type { AvailabilityContent } from '../../../shared/types/Availability';
import type { RootContent } from '../../../shared/types/Root';

import type { LayoutLoad } from './$types';
import { buildMeetTimesCard } from '$lib/utils/buildMeetTimesCard';
import { buildAvailabilityCalendar } from '$lib/utils/buildAvailabilityCalendar';

import homeData from '$lib/data/home.json';

import menuData from '$lib/data/menu.json';
import type { MenuContent } from '../../../shared/types/Menu';
import type { HomeContent } from '../../../shared/types/Home';
const menu = menuData as unknown as MenuContent;
const home = homeData as unknown as HomeContent;
// const features = homeData.features as unknown as SuperSteal[];

export const ssr = false;
export const prerender = 'auto';

const fallbackContent = rootContent as unknown as RootContent;
const availabilityFallback = availabilityContent as unknown as AvailabilityContent;

export const load: LayoutLoad = async () => {
	const { closedMessage, meetTimesDisplay } = buildMeetTimesCard({
		hours: fallbackContent.business.hours,
		...availabilityFallback
	});

	const calendarProps = buildAvailabilityCalendar({
		hours: fallbackContent.business.hours,
		...availabilityFallback
	});

	if (import.meta.env.VITE_IS_MOCK === 'true') {
		return {
			root: fallbackContent,
			availability: availabilityFallback,
			home,
			calendarProps,
			closedMessage,
			meetTimesDisplay,
			menu
		};
	}

	return {
		availability: availabilityFallback,
		home,
		calendarProps,
		root: fallbackContent,
		closedMessage,
		meetTimesDisplay,
		menu
	};
};
