<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface TextInputProps extends HTMLInputAttributes {
		label: string;
		errored?: boolean;
		value?: string;
		loading?: boolean;
	}

	let {
		label,
		errored = false,
		type = 'text',
		loading = false,
		autocomplete = 'off',
		value = $bindable(''),
		...props
	}: TextInputProps = $props();

	const id = Math.random().toString(36).substring(7);
</script>

<div class:errored class:loading class="text-input-container">
	<input
		{id}
		{type}
		placeholder=" "
		class="text-input-input"
		aria-invalid={errored}
		{...props}
		bind:value
	/>
	<label for={id} class="text-input-label">{label}</label>
</div>

<style>
	@import './textInput.css';
</style>
