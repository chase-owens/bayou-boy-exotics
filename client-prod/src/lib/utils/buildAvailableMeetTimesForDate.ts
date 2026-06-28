import { format, isBefore, isSameDay } from 'date-fns';
import type { ClosurePeriod, MeetCancellation } from '../../../../shared/types/Availability';
import type { Hours } from '../../../../shared/types/Root';
import { buildDateWithTime } from './buildDateWithTime';

export const buildAvailableMeetingTimesForDate = ({
	date,
	hours,
	closures,
	meetCancellations,
	now
}: {
	date: Date;
	hours: Hours;
	closures: ClosurePeriod[];
	meetCancellations: MeetCancellation[];
	now: Date;
}) => {
	const dateKey = format(date, 'yyyy-MM-dd');
	const dayName = format(date, 'EEEE');

	const regularDay = hours.schedule.find((day) => day.day === dayName);

	if (!regularDay || regularDay.closed) return [];

	const isClosedByClosure = closures.some((closure) => {
		const startDateKey = closure.startsAt.slice(0, 10);
		const endDateKey = closure.endsAt.slice(0, 10);

		return dateKey >= startDateKey && dateKey <= endDateKey;
	});

	if (isClosedByClosure) return [];

	const canceledTimes = meetCancellations.find((cancel) => cancel.date === dateKey)?.times ?? [];

	return hours.meetSchedule.defaultTimes
		.filter((time) => !canceledTimes.includes(time))
		.filter((time) => {
			const meetDate = buildDateWithTime(date, time);

			if (isSameDay(meetDate, now) && isBefore(meetDate, now)) {
				return false;
			}

			return true;
		})
		.map((time) => ({
			time,
			label: format(buildDateWithTime(date, time), 'h:mm a')
		}));
};
