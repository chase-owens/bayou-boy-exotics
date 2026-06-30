import { addDays, format, isBefore, isSameDay, startOfDay } from 'date-fns';
import type { Args } from './buildMeetTimesCard';
import { buildDateWithTime } from './buildDateWithTime';

export const findNextAvailableMeetDate = ({
	hours,
	closures,
	meetCancellations = [],
	now = new Date()
}: Args): Date | null => {
	for (let offset = 0; offset < 30; offset++) {
		const date = addDays(startOfDay(now), offset);
		const dateKey = format(date, 'yyyy-MM-dd');
		const dayName = format(date, 'EEEE');

		const regularDay = hours.schedule.find((day) => day.day === dayName);

		if (!regularDay || regularDay.closed) continue;

		const isClosedByClosure = closures.some((closure) => {
			const startDateKey = closure.startsAt.slice(0, 10);
			const endDateKey = closure.endsAt.slice(0, 10);

			return dateKey >= startDateKey && dateKey <= endDateKey;
		});

		if (isClosedByClosure) continue;

		const canceledTimes = meetCancellations.find((cancel) => cancel.date === dateKey)?.times ?? [];

		const nextTime = hours.meetSchedule.defaultTimes.find((time) => {
			if (canceledTimes.includes(time)) return false;

			const meetDate = buildDateWithTime(date, time);

			if (isSameDay(meetDate, now) && isBefore(meetDate, now)) {
				return false;
			}

			return true;
		});

		if (nextTime) {
			return buildDateWithTime(date, nextTime);
		}
	}

	return null;
};
