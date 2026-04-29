import { newPocketBase } from '$lib/server/pocketbase';
import { json } from '@sveltejs/kit';
import type { UserAuthRefresh } from '../../../types/db';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const authHeader = request.headers.get('x-auth-token');
		if (!authHeader) {
			throw new Error('Unauthorized.');
		}

		const body = await request.json();

		const pb = newPocketBase();
		pb.authStore.save(authHeader);

		const user: UserAuthRefresh = await pb.collection('users').authRefresh();

		// Do stuff...

		pb.authStore.clear();

		return json({ data: { body, user } });
	} catch (err) {
		return json({ error: (err as Error).message });
	}
};
