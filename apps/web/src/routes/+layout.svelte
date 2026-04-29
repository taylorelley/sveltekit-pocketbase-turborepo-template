<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { setContext } from 'svelte';
	import '../app.css';

	let { children } = $props();

	const auth = $state({ token: pb.authStore.token, user: pb.authStore.model });
	setContext('auth', auth);

	$effect(() => {
		return pb.authStore.onChange((newToken, model) => {
			auth.token = newToken;
			auth.user = model;
			if (model) localStorage.setItem('hasSignedIn', 'true');
		}, true);
	});
</script>

{@render children()}
