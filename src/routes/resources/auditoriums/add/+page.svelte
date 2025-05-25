<script lang="ts">
	import { intProxy, numberProxy, superForm } from 'sveltekit-superforms';
	import type { PageProps } from './$types';
	import { Button } from 'm3-svelte';
	import SuperFormTextField from '$lib/components/base/textInput/SuperFormTextField.svelte';

	let { data }: PageProps = $props();
	const { form, errors, constraints, message, enhance } = superForm(data.form);

	const rowProxy = intProxy(form, 'rows');
	const columnProxy = intProxy(form, 'columns');
	const seatPriceProxy = numberProxy(form, 'seatPrice');
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
		type="number"
		errors={$errors.rows}
		constraints={$constraints.rows}
		bind:value={$rowProxy}
	/>

	<SuperFormTextField
		label="Columns"
		name="columns"
		type="number"
		errors={$errors.columns}
		constraints={$constraints.columns}
		bind:value={$columnProxy}
	/>

	<SuperFormTextField
		label="Seat Price"
		name="seatPrice"
		type="number"
		errors={$errors.seatPrice}
		constraints={$constraints.seatPrice}
		bind:value={$seatPriceProxy}
	/>

	<Button type="elevated" extraOptions={{ type: 'submit' }}>Add</Button>
</form>
