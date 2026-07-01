import type { ClosurePeriod, MeetCancellation } from '../../../../shared/types/Availability';
import type { Hours } from '../../../../shared/types/Root';
import type { CalendarDayStatus } from './buildAvailabilityCalendar';
import { formatWeekday, isBetweenDates } from './date';

function toDateKey(date: Date) {
	return date.toISOString().split('T')[0];
}
export const getDateStatus = ({
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
