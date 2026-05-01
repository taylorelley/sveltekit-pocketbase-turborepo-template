import { env } from '$env/dynamic/private';
import { newPocketBase } from '$lib/server/pocketbase';
import { json } from '@sveltejs/kit';
import type { ApiCreateAccountParams } from '../../../types/api';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = (await request.json()) as Partial<ApiCreateAccountParams>;
		const { email, password, passwordConfirm } = body;

		if (
			typeof email !== 'string' ||
			typeof password !== 'string' ||
			typeof passwordConfirm !== 'string' ||
			password !== passwordConfirm ||
			password.length < 8 ||
			password.length > 72
		) {
			return json({ error: 'Invalid account payload.' }, { status: 400 });
		}

		const pbAdmin = newPocketBase();
		await pbAdmin.collection('_superusers').authWithPassword(env.POCKETBASE_ADMIN_EMAIL!, env.POCKETBASE_ADMIN_PASSWORD!);
		await pbAdmin.collection('users').create({ email, password, passwordConfirm });

		// Authenticate as the new user server-side so the client gets a token
		// without needing a second round-trip authWithPassword call.
		const pbUser = newPocketBase();
		const authData = await pbUser.collection('users').authWithPassword(email, password);

		return json({ data: { token: authData.token, record: authData.record } }, { status: 201 });
	} catch (err) {
		console.error('create-account failed:', err);
		return json({ error: 'Unable to create account.' }, { status: 500 });
	}
};
