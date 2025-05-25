<script lang="ts">
	import TextField from './TextField.svelte';
	import type { InputConstraint } from 'sveltekit-superforms';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface SuperFormTextFieldProps extends HTMLInputAttributes {
		label: string;
		loading?: boolean;
		value: string;
		errors?: string[];
		constraints?: InputConstraint;
	}

	let {
		value = $bindable(''),
		errors,
		constraints,
		loading = false,
		...rest
	}: SuperFormTextFieldProps = $props();
</script>

<TextField {loading} {...constraints} {...rest} bind:value />
{#if errors}<span class="invalid">{errors}</span>{/if}

<style>
	.invalid {
		color: var(--errorColor, rgb(var(--m3-scheme-error)));
		font-size: 0.75rem;
		margin-top: 0.25rem;
	}
</style>
