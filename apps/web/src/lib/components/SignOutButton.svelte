<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';

	async function signOut() {
		pb.authStore.clear();
		await goto('/sign-in');
	}
</script>

<button onclick={signOut}>Sign out</button>
