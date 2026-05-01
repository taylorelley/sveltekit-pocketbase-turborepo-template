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

		const pb = newPocketBase();
		await pb.collection('_superusers').authWithPassword(env.POCKETBASE_ADMIN_EMAIL!, env.POCKETBASE_ADMIN_PASSWORD!);
		const createUserRecordModel = await pb
			.collection('users')
			.create({ email, password, passwordConfirm });
		pb.authStore.clear();

		return json({ data: { createUserRecordModel } }, { status: 201 });
	} catch (err) {
		console.error('create-account failed:', err);
		return json({ error: 'Unable to create account.' }, { status: 500 });
	}
};
