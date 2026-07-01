import {
	format,
	parseISO,
	isWithinInterval,
	getDay,
	getDaysInMonth,
	isSameDay,
	set
} from 'date-fns';

export const formatShortDate = (date: string) => format(parseISO(date), 'MMM d');

export const formatMonth = (date: Date) => format(date, 'MMMM yyyy');

export const formatWeekday = (date: Date) => format(date, 'EEEE');

export const isBetweenDates = (date: Date, start: string, end: string) =>
	isWithinInterval(date, {
		start: parseISO(start),
		end: parseISO(end)
	});

const buildDateWithTime = (date: Date, time: string) => {
	const [hours, minutes] = time.split(':').map(Number);

	return set(date, {
		hours,
		minutes,
		seconds: 0,
		milliseconds: 0
	});
};

export { buildDateWithTime, getDay, getDaysInMonth, isSameDay };
