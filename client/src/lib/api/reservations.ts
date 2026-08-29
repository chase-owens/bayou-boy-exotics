import { PUBLIC_API_URL } from '$env/static/public';
import { fetchAuthSession } from 'aws-amplify/auth';

import type { CartItem } from '../../../../shared/types/Cart';
import type { ReservationMeet } from '../../../../shared/types/Reservation';

type SubmitReservationPayload = {
	items: CartItem[];
	total: number;
	meet: ReservationMeet;
};

type SubmitReservationResponse = {
	reservationId: string;
	status: 'submitted';
};

export const submitReservation = async (
	payload: SubmitReservationPayload
): Promise<SubmitReservationResponse> => {
	const session = await fetchAuthSession();
	const token = session.tokens?.idToken?.toString();

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
