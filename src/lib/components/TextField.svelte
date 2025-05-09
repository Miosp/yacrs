<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface TextInputProps extends HTMLInputAttributes {
		label: string;
		errored?: boolean;
		value?: string;
		loading?: boolean;
		type?: string;
	}

	let {
		label,
		errored = false,
		type = 'text',
		value = $bindable(''),
		loading = false,
		autocomplete = 'off',
		...props
	}: TextInputProps = $props();

	const id = Math.random().toString(36).substring(7);
</script>

<div class:errored class:loading class="text-input-container">
	<input {id} {type} placeholder=" " class="text-input-input" {...props} bind:value />
	<label for={id} class="text-input-label">{label}</label>
</div>

<style>
	.text-input-container {
		position: relative;
		border-radius: 5px;
		gap: var(--gap);
		height: 3.5rem;
		min-width: 15rem;
		margin: 0.5rem;
		outline-offset: -0.0625rem;
	}

	.text-input-container:not(.loading) {
		outline-color: rgb(var(--m3-scheme-primary));
	}

	input {
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		position: absolute;
		inset: 0;
		padding: 0 0.75rem;
		min-width: 15ch;
		color: var(--textColor, rgb(var(--m3-scheme-on-surface)));
		display: inline-block;
		border: none;
		vertical-align: middle;
		outline: none;
		background-color: transparent;

		&:hover ~ label,
		&:focus ~ label {
			color: rgb(var(--error, var(--m3-scheme-primary)));
		}

		&:focus ~ label,
		&:not(:placeholder-shown) ~ label {
			transform: translateY(-1.6rem);
			font-size: var(--m3-font-body-small-size, 0.75rem);
			line-height: var(--m3-font-body-small-height, 1rem);
			letter-spacing: var(--m3-font-body-small-tracking, 0.4);
			background-color: rgb(var(--m3-scheme-background));
		}
	}

	label {
		font-weight: 500;
		position: absolute;
		left: 0.75rem;
		top: 1rem;
		color: var(--textColor, rgb(var(--m3-scheme-on-surface)));
		background-color: transparent;
		outline: none;
		padding: 0 0.25rem;
		transition:
			all 0.2s,
			font-size 0.3s,
			line-height 0.3s,
			letter-spacing 0.3s;
	}

	/* .container :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
		color: rgb(var(--m3-scheme-on-surface));
	} */

	.errored {
		border-color: rgb(var(--error));
	}

	@property --gap {
		syntax: '<percentage>';
		initial-value: 0%;
		inherits: false;
	}
	/* .container:not(.loading) {
		outline: 0.0625rem solid;
	} */

	.text-input-container:has(input:focus),
	.text-input-container:has(input:not(:placeholder-shown)) {
		outline-color: rgb(var(--m3-scheme-primary));
	}

	.text-input-container.loading {
		background:
			linear-gradient(
					90deg,
					transparent 0% var(--gap),
					rgb(var(--m3-scheme-primary)) var(--gap) calc(100% - var(--gap)),
					transparent calc(100% - var(--gap)) 100%
				)
				repeat-x,
			linear-gradient(
					90deg,
					transparent 0% var(--gap),
					rgb(var(--m3-scheme-primary)) var(--gap) calc(100% - var(--gap)),
					transparent calc(100% - var(--gap)) 100%
				)
				repeat-x,
			linear-gradient(
					0deg,
					transparent 0% var(--gap),
					rgb(var(--m3-scheme-primary)) var(--gap) calc(100% - var(--gap)),
					transparent calc(100% - var(--gap)) 100%
				)
				repeat-y,
			linear-gradient(
					0deg,
					transparent 0% var(--gap),
					rgb(var(--m3-scheme-primary)) var(--gap) calc(100% - var(--gap)),
					transparent calc(100% - var(--gap)) 100%
				)
				repeat-y;
		background-size:
			10px 0.0625rem,
			10px 0.0625rem,
			0.0625rem 10px,
			0.0625rem 10px;
		background-position:
			0 0,
			0 100%,
			0 0,
			100% 0;
		animation:
			moveGradient 0.3s infinite linear,
			increaseGap 0.3s forwards;
	}

	@keyframes moveGradient {
		100% {
			background-position:
				10px 0,
				-10px 100%,
				0 -10px,
				100% 10px;
		}
	}

	@keyframes increaseGap {
		from {
			--gap: 0%;
		}
		to {
			--gap: 20%;
		}
	}
</style>
