import { pb } from '$lib/pocketbase';
import type { Post, PostRecordModel } from '../../types/db';

export async function updatePost(id: string, data: Partial<Omit<Post, 'id' | 'created' | 'updated' | 'user'>>) {
	try {
		const record: PostRecordModel = await pb.collection('posts').update(id, data, { expand: 'user' });
		return { data: record };
	} catch (err) {
		return { error: (err as Error).message };
	}
}
