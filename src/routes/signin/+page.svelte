<script lang="ts">
	import { Button, TextFieldOutlined, ButtonLink } from 'm3-svelte';
	import { schema } from './schema';
	import { signIn } from '$lib/services/authClient';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let error = $state('');

	async function handleSubmit() {
		const validated = schema.safeParse({
			email: email,
			password: password
		});

		if (!validated.success) {
			error = validated.error.errors[0].message;
			return;
		}
		error = '';

		const { data: _, error: signInError } = await signIn.email({
			email: validated.data.email,
			password: validated.data.password
		});

		if (signInError) {
			error = signInError.message || 'Unknown error happened';
		} else {
			goto('/', { invalidate: ['app:auth'] });
		}
	}
</script>

<section>
	<main>
		<form onsubmit={() => handleSubmit()}>
			<h1>Login to Your Account</h1>
			{#if error}
				<div class="error">{error}</div>
			{/if}
			<TextFieldOutlined name="E-mail" bind:value={email} />
			<TextFieldOutlined
				name="Password"
				extraOptions={{ type: 'password' }}
				bind:value={password}
			/>
			<Button type="filled" extraOptions={{ type: 'submit' }}>Log in</Button>
		</form>
		<div class="divider"></div>
		<h2>Or</h2>
		<div class="buttonGroup">
			<ButtonLink type="filled" href="/register">Register</ButtonLink>
		</div>
	</main>
</section>

<style>
	h1,
	h2 {
		margin: 0;
	}

	section {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	main {
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
	}

	form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		gap: 1.5rem;
	}

	.divider {
		width: 100%;
		height: 1px;
		background-color: rgb(var(--m3-scheme-outline));
		margin: 1rem 0;
	}

	.buttonGroup {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 1rem 0;
		gap: 1rem;
	}
</style>
