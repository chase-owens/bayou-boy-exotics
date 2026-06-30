import { format, isAfter, isSunday, isTomorrow, isWithinInterval, set } from 'date-fns';

import type { Hours } from '../../../../shared/types/Root';
import type { ClosurePeriod, MeetCancellation } from '../../../../shared/types/Availability';
import { findNextAvailableMeetDate } from './findNextAvailableMeetDate';

export type AvailableMeetingTime = {
	time: string;
	label: string;
};

export type Args = {
	hours: Hours;
	closures: ClosurePeriod[];
	meetCancellations?: MeetCancellation[];
	now?: Date;
};

export type MeetTimesDisplay = {
	dayLabel: 'today' | 'tomorrow';
	meets: AvailableMeetingTime[];
};

export const buildClosedLabel = ({
	hours,
	closures,
	meetCancellations = [],
	now = new Date()
}: Args) => {
	const dateKey = format(now, 'yyyy-MM-dd');
	const dayName = format(now, 'EEEE');

	const regularDay = hours.schedule.find((day) => day.day === dayName);

	const closeTime = regularDay?.closesAt ? buildDateWithTime(now, regularDay.closesAt) : null;

	const isTodayClosure = closures.some((closure) =>
		isWithinInterval(now, {
			start: new Date(closure.startsAt),
			end: new Date(closure.endsAt)
		})
	);

	const isAfterClose = closeTime ? isAfter(now, closeTime) : false;

	const canceledTimes =
		meetCancellations.find((cancellation) => cancellation.date === dateKey)?.times ?? [];

	const availableMeetingTimes = hours.meetSchedule.defaultTimes
		.filter((time) => !canceledTimes.includes(time))
		.filter((time) => {
			const meetDate = buildDateWithTime(now, time);

			if (isAfter(now, meetDate)) {
				return false;
			}

			return !hours.dailyBreaks.some((breakTime) =>
				isWithinInterval(meetDate, {
					start: buildDateWithTime(now, breakTime.startsAt),
					end: buildDateWithTime(now, breakTime.endsAt)
				})
			);
		})
		.map((time) => ({
			time,
			label: format(buildDateWithTime(now, time), 'h:mm a')
		}));

	const reopensAt = findNextAvailableMeetDate({
		hours,
		closures,
		meetCancellations,
		now
	});

	const reopensAtLabel = reopensAt ? format(reopensAt, "EEE, MMM d 'at' h:mm a") : null;

	const isClosed =
		Boolean(regularDay?.closed) ||
		isSunday(now) ||
		isAfterClose ||
		isTodayClosure ||
		!availableMeetingTimes.length;

	const closedMessage = isClosed
		? reopensAt
			? isTomorrow(reopensAt)
				? `Closed for the evening. First meet time tomorrow is ${format(reopensAt, 'h:mm a')}.`
				: `Closed until: ${reopensAtLabel}`
			: 'Closed until further notice.'
		: '';

	return {
		closedMessage
	};
};

const buildDateWithTime = (date: Date, time: string) => {
	const [hours, minutes] = time.split(':').map(Number);

	return set(date, {
		hours,
		minutes,
		seconds: 0,
		milliseconds: 0
	});
};
