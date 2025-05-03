<script lang="ts">
	import { Button, TextFieldOutlined } from 'm3-svelte';
	import { schema } from './schema';
	import { signUp } from '$lib/services/clientAuth';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let displayName = $state('');
	let error = $state('');

	async function handleSubmit() {
		const validated = schema.safeParse({
			email: email,
			password: password,
			displayName: displayName
		});

		if (!validated.success) {
			error = validated.error.errors[0].message;
			return;
		}
		error = '';

		const { data: _, error: signUpError } = await signUp.email({
			email: validated.data.email,
			password: validated.data.password,
			name: validated.data.displayName
		});
		if (signUpError) {
			error = signUpError.message || 'Unknown error happened';
		} else {
			goto('/', { invalidate: ['app:auth'] });
		}
	}
</script>

<section>
	<form onsubmit={() => handleSubmit()}>
		<h1>Register a new account</h1>
		{#if error}
			<div class="error">{error}</div>
		{/if}
		<TextFieldOutlined name="E-mail" bind:value={email} />
		<TextFieldOutlined name="Display Name" bind:value={displayName} />
		<TextFieldOutlined name="Password" extraOptions={{ type: 'password' }} bind:value={password} />
		<Button type="filled" extraOptions={{ type: 'submit' }}>Sign Up</Button>
	</form>
</section>

<style>
	h1 {
		margin: 0;
	}

	section {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	form {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		max-width: 400px;
		padding: 3rem;
		margin: 3rem 0;
		background-color: rgb(var(--m3-scheme-surface-container));
		border-radius: var(--m3-util-rounding-large);
		gap: 1.5rem;
	}
</style>
