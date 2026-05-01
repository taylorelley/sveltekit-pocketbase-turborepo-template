import { pb } from '$lib/pocketbase';
import type { Post, PostRecordModel } from '../../types/db';

export async function createPost(data: Pick<Post, 'count'>) {
	const user = pb.authStore.record?.id;
	if (!user) {
		return { error: 'You must be signed in to create a post.' };
	}
	try {
		const record: PostRecordModel = await pb.collection('posts').create(
			{ ...data, user },
			{ expand: 'user' }
		);
		return { data: record };
	} catch (err) {
		console.error('createPost failed:', err);
		return { error: 'Failed to create post. Please try again.' };
	}
}
