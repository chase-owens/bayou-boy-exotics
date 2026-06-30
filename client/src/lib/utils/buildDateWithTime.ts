import { set } from 'date-fns';

export const buildDateWithTime = (date: Date, time: string): Date => {
	const [hours, minutes] = time.split(':').map(Number);

	return set(date, {
		hours,
		minutes,
		seconds: 0,
		milliseconds: 0
	});
};
