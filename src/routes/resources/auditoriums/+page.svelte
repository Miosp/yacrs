<script lang="ts">
	import { Button, ButtonLink } from 'm3-svelte';
	import type { PageProps } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { invalidate } from '$app/navigation';

	let { data }: PageProps = $props();
	const { form, errors, constraints, message, enhance } = superForm(data.form, {
		onResult: ({ result }) => {
			if (result.type === 'success') {
				invalidate('app:auditoriums');
			}
		}
	});

	function preprocessDelete(id: number) {
		$form.id = id;
	}
</script>

<div class="container">
	<h1 class="page-title">Auditorium List</h1>
	<div class="action-bar">
		<ButtonLink type="elevated" href="/resources/auditoriums/add">Add new</ButtonLink>
	</div>
	<div class="auditorium-grid">
		{#each data.auditoriums as auditorum}
			<div class="auditorium-card">
				<h2 class="auditorium-id">#{auditorum.id}</h2>
				<p class="auditorium-name">{auditorum.displayName}</p>
				<form method="POST" use:enhance onsubmit={() => preprocessDelete(auditorum.id)}>
					{#if $message}<h3>{$message}</h3>{/if}
					<input type="hidden" name="id" value={auditorum.id} {...$constraints.id} />
					<Button type="elevated" extraOptions={{ type: 'submit' }}>Delete</Button>
					{#if $errors.id}<span class="invalid">{$errors.id}</span>{/if}
				</form>
			</div>
		{/each}
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
	}

	.page-title {
		font-size: 2rem;
		margin-bottom: 1.5rem;
		color: rgb(var(--m3-scheme-primary));
	}

	.action-bar {
		margin-bottom: 2rem;
	}

	.auditorium-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.auditorium-card {
		padding: 1.5rem;
		border-radius: 12px;
		background-color: rgb(var(--m3-scheme-surface-container));
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.auditorium-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.auditorium-id {
		font-size: 1.2rem;
		color: rgb(var(--m3-scheme-primary));
		margin-bottom: 0.5rem;
	}

	.auditorium-name {
		font-size: 1.5rem;
		font-weight: 500;
	}
</style>
