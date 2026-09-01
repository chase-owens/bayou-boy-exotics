import { getAccessRequest } from '$lib/api/auth';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';

type AuthUser = {
	userId: string;
	username: string;
	email?: string;
	name?: string;
	phone?: string;
};

type AccessStatus = 'pending' | 'approved' | 'denied';

const createAuth = () => {
	let user = $state<AuthUser | null>(null);
	let isAuthenticated = $state(false);
	let accessStatus = $state<AccessStatus | null>(null);
	let isLoading = $state(true);

	const load = async () => {
		isLoading = true;

		try {
			const currentUser = await getCurrentUser();
			const attributes = await fetchUserAttributes();

			user = {
				userId: currentUser.userId,
				username: currentUser.username,
				email: attributes.email,
				name: attributes.name,
				phone: attributes.phone_number
			};

			isAuthenticated = true;

			try {
				const accessRequest = await getAccessRequest(currentUser.userId);
				accessStatus = accessRequest.status;
			} catch {
				accessStatus = null;
			}
		} catch {
			user = null;
			isAuthenticated = false;
			accessStatus = null;
		} finally {
			isLoading = false;
		}
	};

	const clear = () => {
		user = null;
		isAuthenticated = false;
		accessStatus = null;
	};

	return {
		get user() {
			return user;
		},

		get isAuthenticated() {
			return isAuthenticated;
		},

		get accessStatus() {
			return accessStatus;
		},

		get isApproved() {
			return accessStatus === 'approved';
		},

		get isPending() {
			return accessStatus === 'pending';
		},

		get isDenied() {
			return accessStatus === 'denied';
		},

		get isLoading() {
			return isLoading;
		},

		load,
		clear
	};
};

export const auth = createAuth();
