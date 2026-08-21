import { PUBLIC_API_URL } from '$env/static/public';
import {
	confirmSignUp,
	fetchAuthSession,
	resendSignUpCode,
	signIn,
	signOut,
	signUp
} from 'aws-amplify/auth';

type RegisterUserInput = {
	email: string;
	password: string;
	name: string;
	phone: string;
};

type CreateAccessRequestInput = {
	userId: string;
	email: string;
	name: string;
	phone: string;
};

const normalizePhoneNumber = (phone: string) => {
	const digits = phone.replace(/\D/g, '');

	if (digits.length === 10) {
		return `+1${digits}`;
	}

	if (digits.length === 11 && digits.startsWith('1')) {
		return `+${digits}`;
	}

	return phone;
};

export const getAccessRequest = async (userId: string) => {
	const session = await fetchAuthSession();
	const token = session.tokens?.idToken?.toString();

	const response = await fetch(`${PUBLIC_API_URL}access-requests/${userId}`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	if (!response.ok) {
		throw new Error('Unable to fetch access request');
	}

	return response.json() as Promise<{
		userId: string;
		status: 'pending' | 'approved' | 'denied';
	}>;
};

const createAccessRequest = async ({ userId, email, name, phone }: CreateAccessRequestInput) => {
	const response = await fetch(`${PUBLIC_API_URL}access-requests`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			userId,
			email,
			name,
			phone
		})
	});

	if (!response.ok) {
		throw new Error('Unable to create access request');
	}

	return response.json();
};

export const registerUser = async ({ email, password, name, phone }: RegisterUserInput) => {
	const normalizedEmail = email.trim();
	const normalizedName = name.trim();
	const normalizedPhone = normalizePhoneNumber(phone.trim());

	const result = await signUp({
		username: normalizedEmail,
		password,
		options: {
			userAttributes: {
				email: normalizedEmail,
				name: normalizedName,
				phone_number: normalizedPhone
			}
		}
	});

	if (!result.userId) {
		throw new Error('Unable to create user');
	}

	await createAccessRequest({
		userId: result.userId,
		email: normalizedEmail,
		name: normalizedName,
		phone: normalizedPhone
	});

	return result;
};

export const confirmUserSignUp = async (email: string, confirmationCode: string) =>
	confirmSignUp({
		username: email.trim(),
		confirmationCode: confirmationCode.trim()
	});

export const resendConfirmationCode = async (email: string) => {
	const result = await resendSignUpCode({
		username: email.trim()
	});

	return result;
};

export const logInUser = async (email: string, password: string) =>
	signIn({
		username: email.trim(),
		password
	});

export const logOutUser = async () => signOut();
