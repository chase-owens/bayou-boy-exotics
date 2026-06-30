import { format, parseISO, isWithinInterval, getDay, getDaysInMonth, isSameDay } from 'date-fns';

export const formatShortDate = (date: string) => format(parseISO(date), 'MMM d');

export const formatMonth = (date: Date) => format(date, 'MMMM yyyy');

export const formatWeekday = (date: Date) => format(date, 'EEEE');

export const isBetweenDates = (date: Date, start: string, end: string) =>
	isWithinInterval(date, {
		start: parseISO(start),
		end: parseISO(end)
	});

export { getDay, getDaysInMonth, isSameDay };
