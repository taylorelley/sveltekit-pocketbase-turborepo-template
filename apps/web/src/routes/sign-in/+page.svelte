<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';

	let error = $state('');
	let loading = $state(false);
	let email = $state('');
	let password = $state('');

	async function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (loading) return;
		if (!email || !password) {
			error = 'Please fill out all fields.';
			return;
		}
		loading = true;
		try {
			await pb.collection('users').authWithPassword(email, password);
			goto('/home');
		} catch (err) {
			error = (err as Error).message;
		} finally {
			loading = false;
		}
	}
</script>

<a href="/" class="absolute w-full p-2 text-center text-lg font-bold"
	>SvelteKit, Pocketbase, Turborepo Template</a
>
<div class="flex min-h-screen w-full items-center justify-center">
	<div class="flex w-full flex-col items-center gap-8 p-4 lg:max-w-screen-md lg:flex-row">
		<div class="card bg-base-300 w-full max-w-sm shadow-2xl">
			<form onsubmit={onSubmit} class="card-body">
				<h1 class="card-title">Sign in to your account</h1>
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Email</legend>
					<input
						bind:value={email}
						id="email"
						type="email"
						placeholder="email"
						class="input w-full"
						required
					/>
				</fieldset>
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Password</legend>
					<input
						bind:value={password}
						id="password"
						type="password"
						placeholder="password"
						class="input w-full"
						required
					/>
					<div class="fieldset-label">
						<a class="link link-hover" href="/reset-password">Forgot password?</a>
					</div>
				</fieldset>
				<div class="mt-6 flex flex-col gap-4">
					<button class="btn btn-primary" disabled={loading}>
						{#if loading}
							<span class="loading loading-spinner"></span>
						{:else}
							Sign in
						{/if}
					</button>
					{#if error}
						<p class="text-error pt-4 text-center">{error}</p>
					{/if}
				</div>
			</form>
		</div>
		<div class="text-center font-semibold sm:text-lg lg:text-right">
			<p>Don't have an account yet?</p>
			<a href="/create-account" class="link-hover link link-secondary">Click here to create one.</a>
		</div>
	</div>
</div>
