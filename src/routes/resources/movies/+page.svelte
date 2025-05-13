<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { Button, ButtonLink } from 'm3-svelte';
	import { superForm } from 'sveltekit-superforms';

	const { data } = $props();
	const { form, errors, constraints, message, enhance } = superForm(data.deleteForm, {
		onResult: ({ result }) => {
			if (result.type === 'success') {
				invalidate('app:movies');
			}
		}
	});

	function preprocessDelete(id: number) {
		$form.id = id;
	}
</script>

<svelte:head>
	<title>Movie List</title>
</svelte:head>

<div class="page-container">
	<header>
		<h1>Movie List</h1>
		<ButtonLink type="elevated" href="/resources/movies/add">Add New Movie</ButtonLink>
	</header>

	<div class="movieGrid">
		{#each data.movies as movie}
			<div class="movieCard">
				<div class="poster-container">
					<img src={movie.posterPath} alt={movie.title} />
				</div>
				<div class="movie-details">
					<h3>{movie.title}</h3>
					<p class="description">{movie.description}</p>
				</div>
				<div class="movie-actions">
					<ButtonLink type="elevated" href={`/resources/movies/edit/${movie.id}`}>Edit</ButtonLink>
					<form method="POST" use:enhance onsubmit={() => preprocessDelete(movie.id)}>
						{#if $message}<h3>{$message}</h3>{/if}
						<input type="hidden" name="id" value={movie.id} {...constraints} />
						<Button type="elevated" extraOptions={{ type: 'submit' }}>Delete</Button>
						{#if $errors.id}<span class="invalid">{$errors.id}</span>{/if}
					</form>
					<ButtonLink type="outlined" href={`/resources/screenings/add?movieId=${movie.id}`}
						>Add Screening</ButtonLink
					>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.page-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32px;
	}

	h1 {
		font-size: 2rem;
		font-weight: 500;
		margin: 0;
		color: rgb(var(--m3-scheme-on-surface));
	}

	.movieGrid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 24px;
	}

	.movieCard {
		box-sizing: border-box;
		background-color: rgb(var(--m3-scheme-surface-container-high));
		padding: 1rem;
		border-radius: 16px;
		overflow: hidden;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.movieCard:hover {
		transform: translateY(-4px);
		box-shadow: var(--m3-util-elevation-3);
	}

	.poster-container {
		overflow: hidden;
		height: 300px;
		display: flex;
		justify-content: center;
		align-items: center;

		img {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}
	}

	.movie-details {
		padding: 16px;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}
	h3 {
		font-size: 1.2rem;
		font-weight: 500;
		margin: 0 0 8px 0;
		color: rgb(var(--m3-scheme-on-surface));
	}
	.description {
		font-size: 0.9rem;
		margin: 0;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
	}

	.movie-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1rem;
		justify-content: center;
	}

	@media (max-width: 768px) {
		.movieGrid {
			grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
			gap: 16px;
		}

		header {
			flex-direction: column;
			align-items: flex-start;
			gap: 16px;
		}

		.page-container {
			padding: 16px;
		}
	}
</style>
