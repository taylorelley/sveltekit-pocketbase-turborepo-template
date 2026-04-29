import { pb } from '$lib/pocketbase';
import type { PostRecordModel } from '../../types/db';

export async function getPosts() {
	try {
		const fullList: PostRecordModel[] = await pb
			.collection('posts')
			.getFullList({ expand: 'user', sort: '-created' });
		return { data: fullList };
	} catch (err) {
		return { error: (err as Error).message };
	}
}
