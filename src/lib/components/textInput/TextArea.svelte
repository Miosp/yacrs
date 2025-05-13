<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import './textInput.css';

	interface TextareaProps extends HTMLTextareaAttributes {
		label: string;
		errored?: boolean;
		value?: string;
		loading?: boolean;
	}

	let {
		label,
		errored = false,
		loading = false,
		autocomplete = 'off',
		value = $bindable(''),
		...props
	}: TextareaProps = $props();

	const id = Math.random().toString(36).substring(7);
</script>

<div class:errored class:loading class="text-input-container">
	<textarea
		{id}
		placeholder=" "
		class="text-input-input"
		aria-invalid={errored}
		{...props}
		bind:value
	></textarea>
	<label for={id} class="text-input-label">{label}</label>
</div>

<style>
	textarea {
		resize: none;
	}
</style>
