<script lang="ts">
	import SuperFormTextField from '$lib/components/base/textInput/SuperFormTextField.svelte';
	import { Button } from 'm3-svelte';
	import { intProxy, superForm } from 'sveltekit-superforms';

	const { data } = $props();

	const { form, errors, constraints, message, enhance } = superForm(data.form);

	const movieIdProxy = intProxy(form, 'movieId');
	const auditoriumIdProxy = intProxy(form, 'auditoriumId');
</script>

<main>
	<h1>Add a Movie Screening</h1>
	<form method="POST" use:enhance>
		{#if $message}
			<h3>{$message}</h3>
		{/if}

		<SuperFormTextField
			label="Movie ID"
			name="movieId"
			type="number"
			errors={$errors.movieId}
			constraints={$constraints.movieId}
			bind:value={$movieIdProxy}
		/>

		<SuperFormTextField
			label="Auditorium ID"
			name="auditoriumId"
			type="number"
			errors={$errors.auditoriumId}
			constraints={$constraints.auditoriumId}
			bind:value={$auditoriumIdProxy}
		/>

		<SuperFormTextField
			label="Start Time"
			name="dateTime"
			type="datetime-local"
			errors={$errors.dateTime}
			constraints={$constraints.dateTime}
			bind:value={$form.dateTime}
		/>

		<Button type="elevated" extraOptions={{ type: 'submit' }}>Add Screening</Button>
	</form>
</main>
