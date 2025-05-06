<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageProps } from './$types';
	import { Button, TextFieldOutlined } from 'm3-svelte';

	let { data }: PageProps = $props();
	const { form, errors, constraints, message, enhance } = superForm(data.form);
</script>

<h1>Add a new Auditorium</h1>
<form method="POST" use:enhance>
	{#if $message}<h3>{$message}</h3>{/if}
	<TextFieldOutlined
		name="name"
		required
		extraOptions={{
			name: 'name',
			'aria-invalid': $errors.name ? 'true' : undefined,
			...$constraints.name
		}}
		bind:value={$form.name}
	/>
	{#if $errors.name}<span class="invalid">{$errors.name}</span>{/if}

	<label for="rows">Rows:</label>
	<input
		type="number"
		name="rows"
		required
		aria-invalid={$errors.rows ? 'true' : undefined}
		{...$constraints.rows}
		bind:value={$form.rows}
	/>
	{#if $errors.rows}<span class="invalid">{$errors.rows}</span>{/if}

	<label for="columns">Columns:</label>
	<input
		type="number"
		name="columns"
		required
		aria-invalid={$errors.columns ? 'true' : undefined}
		{...$constraints.columns}
		bind:value={$form.columns}
	/>
	{#if $errors.columns}<span class="invalid">{$errors.columns}</span>{/if}

	<Button type="elevated" extraOptions={{ type: 'submit' }}>Add</Button>
</form>
