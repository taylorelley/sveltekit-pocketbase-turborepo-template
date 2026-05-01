import { pb } from '$lib/pocketbase';

export async function deletePost(id: string) {
	try {
		await pb.collection('posts').delete(id);
		return {};
	} catch (err) {
		return { error: (err as Error).message };
	}
}
