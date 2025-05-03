<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import { Button, TextFieldOutlined, ButtonLink } from 'm3-svelte';

	let username = $state('');
	let password = $state('');
</script>

<section>
	<main>
		<h1>Login to Your Account</h1>
		<form onsubmit={() => signIn('credentials', { username, password })}>
			<div class="inputGroup">
				<label for="username">Username</label>
				<TextFieldOutlined name="username" bind:value={username} />
			</div>

			<div class="inputGroup">
				<label for="password">Password</label>
				<TextFieldOutlined name="password" bind:value={password} />
			</div>

			<Button type="filled" extraOptions={{ type: 'submit' }}>Log in</Button>
		</form>
		<div class="divider"></div>
		<p>Don't have an account?</p>
		<ButtonLink type="filled" href="/auth/register">Register</ButtonLink>
		<div class="divider"></div>
		<h2>Use SSO</h2>
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

	label {
		display: block;
		margin: 0.5rem 0;
		font-size: 1.2rem;
		font-weight: 500;
	}

	form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	.inputGroup {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 1rem 0;
		align-items: center;
	}

	.divider {
		width: 100%;
		height: 1px;
		background-color: rgb(var(--m3-scheme-outline));
		margin: 1rem 0;
	}
</style>
