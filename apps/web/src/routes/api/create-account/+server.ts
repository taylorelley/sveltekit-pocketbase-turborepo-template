import { env } from '$env/dynamic/private';
import { newPocketBase } from '$lib/server/pocketbase';
import { json } from '@sveltejs/kit';
import type { ApiCreateAccountParams } from '../../../types/api';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body: ApiCreateAccountParams = await request.json();
		const { email, password, passwordConfirm } = body;

		const pb = newPocketBase();
		await pb.collection('_superusers').authWithPassword(env.POCKETBASE_ADMIN_EMAIL!, env.POCKETBASE_ADMIN_PASSWORD!);
		const createUserRecordModel = await pb
			.collection('users')
			.create({ email, password, passwordConfirm });
		pb.authStore.clear();

		return json({ data: { createUserRecordModel } });
	} catch (err) {
		return json({ error: (err as Error).message });
	}
};
