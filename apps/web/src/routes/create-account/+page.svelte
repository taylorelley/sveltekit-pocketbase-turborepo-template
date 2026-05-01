<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';

	let error = $state('');
	let loading = $state(false);
	let email = $state('');
	let password = $state('');
	let passwordConfirm = $state('');

	async function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (loading) return;
		error = '';
		if (!email || !password || !passwordConfirm) {
			error = 'Please fill out all fields.';
			return;
		}
		if (password.length < 8 || password.length > 72) {
			error = 'Password must be between 8 and 72 characters.';
			return;
		}
		if (password !== passwordConfirm) {
			error = 'Passwords do not match.';
			return;
		}
		loading = true;
		try {
			const res = await fetch(`/api/create-account`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password, passwordConfirm })
			});
			const resJson = await res.json();
			if (!res.ok) {
				throw new Error(resJson.error);
			}
			pb.authStore.save(resJson.data.token, resJson.data.record);
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
	<div
		class="flex w-full flex-col items-center justify-center gap-8 p-4 lg:max-w-screen-md lg:flex-row-reverse"
	>
		<div class="card bg-base-300 w-full max-w-sm shadow-2xl">
			<form onsubmit={onSubmit} class="card-body">
				<h1 class="card-title">Create your account</h1>
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
				</fieldset>
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Confirm password</legend>
					<input
						bind:value={passwordConfirm}
						id="confirm-password"
						type="password"
						placeholder="confirm password"
						class="input w-full"
						required
					/>
				</fieldset>
				<div class="mt-6 flex flex-col gap-4">
					<button class="btn btn-primary" disabled={loading}>
						{#if loading}
							<span class="loading loading-spinner"></span>
						{:else}
							Create account
						{/if}
					</button>
					{#if error}
						<p class="text-error pt-4 text-center">{error}</p>
					{/if}
				</div>
			</form>
		</div>
		<div class="text-center font-semibold sm:text-lg lg:text-right">
			<p>Already have an account?</p>
			<a href="/sign-in" class="link-hover link link-secondary">Click here to sign in.</a>
		</div>
	</div>
</div>
