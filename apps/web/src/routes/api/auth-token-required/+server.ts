import { newPocketBase } from '$lib/server/pocketbase';
import { json } from '@sveltejs/kit';
import type { UserAuthRefresh } from '../../../types/db';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get('x-auth-token');
	if (!authHeader) {
		return json({ error: 'Unauthorized.' }, { status: 401 });
	}

	const pb = newPocketBase();
	try {
		const body = await request.json();
		pb.authStore.save(authHeader);

		const user: UserAuthRefresh = await pb.collection('users').authRefresh();

		// Do stuff...

		return json({ data: { body, user } });
	} catch (err) {
		return json({ error: (err as Error).message }, { status: 500 });
	} finally {
		pb.authStore.clear();
	}
};
