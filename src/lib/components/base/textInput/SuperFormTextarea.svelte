<script lang="ts">
	import TextArea from './TextArea.svelte';
	import type { InputConstraint } from 'sveltekit-superforms';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	interface SuperFormTextFieldProps extends HTMLTextareaAttributes {
		label: string;
		value: string | undefined;
		loading?: boolean;
		errors?: string[];
		constraints?: InputConstraint;
	}

	let {
		label,
		value = $bindable(''),
		errors,
		constraints,
		loading = false,
		...rest
	}: SuperFormTextFieldProps = $props();
</script>

<TextArea {label} {loading} {...constraints} {...rest} bind:value />
{#if errors}<span class="invalid">{errors}</span>{/if}

<style>
	.invalid {
		color: var(--errorColor, rgb(var(--m3-scheme-error)));
		font-size: 0.75rem;
		margin-top: 0.25rem;
	}
</style>
