<script lang="ts" generics="T extends { [key: string]: any }">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { formFieldProxy, type SuperForm, type FormPathLeaves } from 'sveltekit-superforms';
	import TextField from './TextField.svelte';

	type Props = HTMLInputAttributes & {
		superform: SuperForm<T>;
		field: FormPathLeaves<T>;
	};

	let { superform, field, ...rest }: Props = $props();

	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<TextField
	label={field}
	errored={$errors !== undefined}
	bind:value={$value}
	{...$constraints}
	{...rest}
/>
{#if $errors}<span class="invalid">{$errors}</span>{/if}
