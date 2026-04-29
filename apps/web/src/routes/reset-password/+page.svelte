<script lang="ts">
	import { goto } from '$app/navigation';
	import Check from '$lib/icons/Check.svelte';
	import { pb } from '$lib/pocketbase';

	let error = $state('');
	let loading = $state(false);
	let email = $state('');
	let success = $state(false);

	async function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!email) {
			error = 'Please fill out all fields.';
			return;
		}
		loading = true;
		try {
			success = await pb.collection('users').requestPasswordReset(email);
			if (!success) {
				error = 'Failed to send password reset email.';
			}
		} catch (err) {
			error = (err as Error).message;
		}
		loading = false;
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
				<h1 class="card-title">
					{#if success}Reset password email sent!{:else}Reset your password{/if}
				</h1>
				{#if !success}
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
				{/if}
				<div class="mt-6 flex flex-col gap-4">
					<button
						onclick={success ? () => goto('/sign-in') : undefined}
						class="btn btn-primary"
					>
						{#if loading}
							<span class="loading loading-spinner"></span>
						{:else if success}
							<Check />
						{:else}
							Request password reset
						{/if}
					</button>
					{#if error}
						<p class="text-error text-center">{error}</p>
					{/if}
				</div>
			</form>
		</div>
		<div class="text-center font-semibold sm:text-lg lg:text-right">
			<p>Remember your password?</p>
			<a href="/sign-in" class="link-hover link link-secondary">Click here to sign in.</a>
		</div>
	</div>
</div>
