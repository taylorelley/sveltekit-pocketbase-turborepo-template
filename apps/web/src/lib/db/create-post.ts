import { pb } from '$lib/pocketbase';
import type { Post, PostRecordModel } from '../../types/db';

export async function createPost(data: Pick<Post, 'user' | 'count'>) {
	try {
		const record: PostRecordModel = await pb.collection('posts').create(data, { expand: 'user' });
		return { data: record };
	} catch (err) {
		return { error: (err as Error).message };
	}
}
