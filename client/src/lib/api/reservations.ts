import { PUBLIC_API_URL } from '$env/static/public';
import { fetchAuthSession } from 'aws-amplify/auth';

import type { CartItem } from '../../../../shared/types/Cart';
import type { Reservation, ReservationMeet } from '../../../../shared/types/Reservation';

type SubmitReservationPayload = {
	items: CartItem[];
	total: number;
	meet: ReservationMeet;
};

type SubmitReservationResponse = {
	reservationId: string;
	status: 'submitted';
};

type MyReservationsResponse = {
	reservations: Reservation[];
};
export const submitReservation = async (
	payload: SubmitReservationPayload
): Promise<SubmitReservationResponse> => {
	const session = await fetchAuthSession();
	const token = session.tokens?.idToken?.toString();

	if (!token) {
		throw new Error('Unable to load session.');
	}

	const response = await fetch(`${PUBLIC_API_URL}reservations`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify(payload)
	});

	if (!response.ok) {
		const data = await response.json().catch(() => null);

		throw new Error(data?.message ?? 'Failed to submit reservation');
	}

	return response.json();
};

export const fetchMyReservations = async (): Promise<Reservation[]> => {
	const session = await fetchAuthSession();
	const token = session.tokens?.idToken?.toString();

	if (!token) {
		throw new Error('Unable to load session.');
	}

	const response = await fetch(`${PUBLIC_API_URL}reservations/mine`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	if (!response.ok) {
		const data = await response.json().catch(() => null);

		throw new Error(data?.message ?? 'Unable to load reservations.');
	}

	const data = (await response.json()) as MyReservationsResponse;

	return data.reservations;
};
