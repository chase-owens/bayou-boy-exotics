import { format, set } from 'date-fns';

export const formatTime = (time?: string) => {
	if (!time) return '';

	const [hours, minutes] = time.split(':').map(Number);

	const date = set(new Date(0), {
		hours,
		minutes,
		seconds: 0,
		milliseconds: 0
	});

	return format(date, 'h:mm a');
};

export const buildDateWithTime = (date: Date, time: string): Date => {
	const [hours, minutes] = time.split(':').map(Number);

	return set(date, {
		hours,
		minutes,
		seconds: 0,
		milliseconds: 0
	});
};
