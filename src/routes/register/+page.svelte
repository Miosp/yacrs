<script lang="ts">
	import { Button, TextFieldOutlined } from 'm3-svelte';
	import type { PageProps } from './$types';
	import { superForm } from 'sveltekit-superforms';

	let { data }: PageProps = $props();

	const { form, errors, constraints, message, enhance } = superForm(data.form);

	$inspect($form);
</script>

<section>
	<main>
		<h1>Register a new account</h1>
		{#if $message}
			<h3>{$message}</h3>
		{/if}
		<form method="POST" use:enhance>
			<div class="inputGroup">
				<label for="username">Username</label>
				<TextFieldOutlined
					name="username"
					error={$errors.username !== undefined}
					extraOptions={{ name: 'username', ...$constraints.username }}
					bind:value={$form.username}
				/>
				{#if $errors.username}
					<span class="error">{$errors.username}</span>
				{/if}
			</div>

			<div class="inputGroup">
				<label for="password">Password</label>
				<TextFieldOutlined
					name="password"
					error={$errors.password !== undefined}
					extraOptions={{ name: 'password', ...$constraints.password }}
					bind:value={$form.password}
				/>
				{#if $errors.password}
					<span class="error">{$errors.password}</span>
				{/if}
			</div>

			<Button type="filled" extraOptions={{ type: 'submit' }}>Log in</Button>
		</form>
	</main>
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
</style>
