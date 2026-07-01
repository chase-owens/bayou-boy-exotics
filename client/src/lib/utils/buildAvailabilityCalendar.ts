import { getDay, getDaysInMonth, isSameDay } from 'date-fns';

import type { Hours } from '../../../../shared/types/Root';

import { formatMonth, formatShortDate } from '$lib/utils/date';

import type { ClosurePeriod, MeetCancellation } from '../../../../shared/types/Availability';
import type { CalendarProps } from '$lib/components/home/AvailabilityCalendar.svelte';
import { getDateStatus } from './getDateStatus';

export type CalendarDayStatus = 'closed' | 'partial' | 'open';

export type AvailabilityCalendarDay = {
	date: Date;
	dayNumber: number;
	isToday: boolean;
	status: CalendarDayStatus;
};

type Args = {
	hours: Hours;
	closures: ClosurePeriod[];
	meetCancellations?: MeetCancellation[];
	today?: Date;
};

export const buildAvailabilityCalendar = ({
	hours,
	closures,
	meetCancellations = [],
	today = new Date()
}: Args): CalendarProps => {
	const year = today.getFullYear();
	const month = today.getMonth();

	const firstDay = new Date(year, month, 1);
	const leadingBlanks = getDay(firstDay);
	const numberOfDays = getDaysInMonth(firstDay);

	const days: AvailabilityCalendarDay[] = Array.from({ length: numberOfDays }, (_, index) => {
		const date = new Date(year, month, index + 1);

		return {
			date,
			dayNumber: index + 1,
			isToday: isSameDay(date, today),
			status: getDateStatus({
				date,
				hours,
				closures,
				meetCancellations
			})
		};
	});

	const upcoming = closures
		.filter((closure) => new Date(closure.endsAt) >= today)
		.map(({ endsAt, startsAt, title }) => ({
			label: `${formatShortDate(startsAt)} – ${formatShortDate(endsAt)}`,
			value: title
		}));

	return {
		monthName: formatMonth(today),
		leadingBlanks,
		days,
		upcoming
	};
};
