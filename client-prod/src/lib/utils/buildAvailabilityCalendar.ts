// src/lib/features/availability/buildAvailabilityCalendar.ts
import { getDay, getDaysInMonth, isSameDay } from 'date-fns';

import type { Hours } from '../../../../shared/types/Root';

const buildUpcomingLabel = (startsAt: string, endsAt: string) =>
	`${formatShortDate(startsAt)} – ${formatShortDate(endsAt)}`;

function toDateKey(date: Date) {
	return date.toISOString().split('T')[0];
}

import { formatMonth, formatShortDate, formatWeekday, isBetweenDates } from '$lib/utils/date';

import type { ClosurePeriod, MeetCancellation } from '../../../../shared/types/Availability';

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
}: Args) => {
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
			label: buildUpcomingLabel(startsAt, endsAt),
			value: title
		}));

	return {
		monthName: formatMonth(today),
		leadingBlanks,
		days,
		upcoming
	};
};

const getDateStatus = ({
	date,
	hours,
	closures,
	meetCancellations
}: {
	date: Date;
	hours: Hours;
	closures: ClosurePeriod[];
	meetCancellations: MeetCancellation[];
}): CalendarDayStatus => {
	const dateKey = toDateKey(date);
	const dayName = formatWeekday(date);

	const regularDay = hours.schedule.find((day) => day.day === dayName);

	if (regularDay?.closed) {
		return 'closed';
	}

	const isClosedOverride = closures.some((closure) =>
		isBetweenDates(date, closure.startsAt, closure.endsAt)
	);

	if (isClosedOverride) {
		return 'closed';
	}

	const hasCancelledMeetTimes = meetCancellations.some(
		(cancel) => cancel.date === dateKey && cancel.times.length > 0
	);

	if (hasCancelledMeetTimes) {
		return 'partial';
	}

	return 'open';
};
