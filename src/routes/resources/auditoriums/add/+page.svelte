<script lang="ts">
	import { intProxy, superForm } from 'sveltekit-superforms';
	import type { PageProps } from './$types';
	import { Button } from 'm3-svelte';
	import SuperFormTextField from '$lib/components/textInput/SuperFormTextField.svelte';

	let { data }: PageProps = $props();
	const { form, errors, constraints, message, enhance } = superForm(data.form);

	const rowProxy = intProxy(form, 'rows');
	const columnProxy = intProxy(form, 'columns');
</script>

<h1>Add a new Auditorium</h1>
<form method="POST" use:enhance>
	{#if message}
		<h3>{$message}</h3>
	{/if}

	<SuperFormTextField
		label="Auditorium Name"
		name="name"
		errors={$errors.name}
		constraints={$constraints.name}
		bind:value={$form.name}
	/>

	<SuperFormTextField
		label="Rows"
		name="rows"
		errors={$errors.rows}
		constraints={$constraints.rows}
		bind:value={$rowProxy}
	/>

	<SuperFormTextField
		label="Columns"
		name="columns"
		errors={$errors.columns}
		constraints={$constraints.columns}
		bind:value={$columnProxy}
	/>

	<Button type="elevated" extraOptions={{ type: 'submit' }}>Add</Button>
</form>
