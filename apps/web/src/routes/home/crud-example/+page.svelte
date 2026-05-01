<script lang="ts">
	import Post from '$lib/components/Post.svelte';
	import { createPost } from '$lib/db/create-post';
	import { deletePost } from '$lib/db/delete-post';
	import { getPosts } from '$lib/db/get-posts';
	import { updatePost } from '$lib/db/update-post';
	import { getContext } from 'svelte';
	import type { AuthContext } from '$lib/auth';
	import type { PostRecordModel } from '../../../types/db';

	const auth = getContext<AuthContext>('auth');

	let data = $state<PostRecordModel[] | null>(null);
	let error = $state('');
	let loading = $state(false);

	async function onClickNewPost() {
		if (!auth.user) {
			alert('You must sign in to create a post');
			return;
		}

		error = '';
		loading = true;

		const createPostRes = await createPost({ count: 0 });

		if (createPostRes.error) {
			error = createPostRes.error;
			alert(`Error creating new post: ${error}`);
		} else if (createPostRes.data) {
			data = [createPostRes.data, ...(data ?? [])];
		}

		loading = false;
	}

	async function onClickIncrementCount(index: number) {
		if (!data) return;

		error = '';
		const post = data[index];
		const updatePostRes = await updatePost(post.id, { count: post.count + 1 });

		if (updatePostRes.error) {
			error = updatePostRes.error;
			alert(`Error incrementing count: ${error}`);
		} else if (updatePostRes.data) {
			data = data.map((p, i) => (i === index ? updatePostRes.data! : p));
		}
	}

	async function onClickDeletePost(index: number) {
		if (!data) return;

		error = '';
		const post = data[index];
		const deletePostRes = await deletePost(post.id);

		if (deletePostRes.error) {
			error = deletePostRes.error;
			alert(`Error deleting post: ${error}`);
		} else {
			data = data.filter((_, i) => i !== index);
		}
	}

	$effect(() => {
		getPosts().then((getPostsRes) => {
			if (getPostsRes.error) {
				error = getPostsRes.error;
				data = [];
				alert(`Error getting posts: ${error}`);
			} else if (getPostsRes.data) {
				data = getPostsRes.data;
			}
		});
	});
</script>

<main class="flex flex-col items-center gap-4 h-full p-4">
	<h1 class="text-xl">CRUD example</h1>
	{#if error}
		<p class="text-error">{error}</p>
	{/if}
	<button onclick={onClickNewPost} class="btn btn-primary" disabled={loading}>New post</button>
	{#if data === null}
		<span class="loading loading-spinner"></span>
	{:else}
		<ul class="flex flex-col gap-4">
			{#each data as post, index (post.id)}
				<li>
					<Post
						{post}
						deletePost={() => onClickDeletePost(index)}
						incrementCount={() => onClickIncrementCount(index)}
					/>
				</li>
			{/each}
		</ul>
	{/if}
</main>
