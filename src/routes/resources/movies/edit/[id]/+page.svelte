<script lang="ts">
	import { intProxy, stringProxy, superForm } from 'sveltekit-superforms';
	import type { PageProps } from './$types';
	import { Button } from 'm3-svelte';
	import TextField from '$lib/components/textInput/TextField.svelte';
	import type { MovieResult, MovieResultsResponse } from 'moviedb-promise';
	import SuperFormTextField from '$lib/components/textInput/SuperFormTextField.svelte';
	import SuperFormTextarea from '$lib/components/textInput/SuperFormTextarea.svelte';

	let { data }: PageProps = $props();
	const { form, errors, constraints, enhance } = superForm(data.form);

	const descriptionProxy = stringProxy(form, 'description', { empty: 'undefined' });
	const runtimeProxy = intProxy(form, 'runtime');
	const tmdb_idProxy = intProxy(form, 'tmdb_id');
	const releaseYearProxy = intProxy(form, 'release_year');
	const formPosterPath = stringProxy(form, 'poster_path', {
		empty: 'undefined'
	});
	const formBackdropPath = stringProxy(form, 'backdrop_path', {
		empty: 'undefined'
	});

	let searchQuery: string = $state('');
	let searchResults: MovieResult[] = $state([]);

	async function searchMovies() {
		if (!searchQuery.trim()) return;

		try {
			const response = await fetch(
				`/resources/movies/api/search/${encodeURIComponent(searchQuery)}`
			);
			if (!response.ok) throw new Error('Search failed');
			searchResults = ((await response.json()) as MovieResultsResponse).results ?? [];
		} catch (error) {
			console.error('Error searching movies:', error);
			searchResults = [];
		}
	}

	function fillFormWithMovie(movie: MovieResult) {
		$form.title = movie.title || '';
		$form.description = movie.overview || '';
		$releaseYearProxy = movie.release_date
			? new Date(movie.release_date).getFullYear().toString()
			: '';
		$form.poster_path = `https://image.tmdb.org/t/p/w300${movie.poster_path || ''}`;
		$form.backdrop_path = `https://image.tmdb.org/t/p/w300${movie.backdrop_path || ''}`;
		$tmdb_idProxy = movie.id?.toString() || '';

		searchResults = [];
	}
</script>

<svelte:head>
	<title>Edit Movie</title>
</svelte:head>

<main>
	<h1>Edit Movie</h1>

	<div class="search-section">
		<h2>Search for a movie</h2>
		<div class="search-container">
			<form onsubmit={() => searchMovies()}>
				<TextField
					label="Search TMDB"
					bind:value={searchQuery}
					--backgroundColor="rgb(var(--m3-scheme-surface-container))"
				/>
			</form>
		</div>

		{#if searchResults.length > 0}
			<h3>Search Results</h3>
			<div class="search-results">
				<ul>
					{#each searchResults as movie}
						<li>
							<div class="movie-result">
								{#if movie.poster_path}
									<img
										src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
										alt={movie.title}
										class="movie-poster"
									/>
								{:else}
									<div class="no-poster">No Poster</div>
								{/if}
								<div class="movie-info">
									<h4>
										{movie.title}
										{movie.release_date ? `(${movie.release_date.substring(0, 4)})` : ''}
									</h4>
									<p class="overview">
										{movie.overview
											? movie.overview.substring(0, 100) +
												(movie.overview.length > 100 ? '...' : '')
											: 'No overview available'}
									</p>
								</div>
								<Button type="tonal" on:click={() => fillFormWithMovie(movie)}>Select</Button>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>

	<form method="POST" class="movie-creation" use:enhance>
		<input type="hidden" name="id" value={$form.id} />

		<SuperFormTextField
			label="Title"
			name="title"
			errors={$errors.title}
			constraints={$constraints.title}
			bind:value={$form.title}
			--backgroundColor="rgb(var(--m3-scheme-surface-container))"
		/>

		<SuperFormTextarea
			label="Description"
			name="description"
			errors={$errors.description}
			constraints={$constraints.description}
			bind:value={$descriptionProxy}
			--backgroundColor="rgb(var(--m3-scheme-surface-container))"
		/>

		<SuperFormTextField
			label="Release Year"
			name="release_year"
			errors={$errors.release_year}
			constraints={$constraints.release_year}
			bind:value={$releaseYearProxy}
			--backgroundColor="rgb(var(--m3-scheme-surface-container))"
		/>

		<SuperFormTextField
			label="Runtime (minutes)"
			name="runtime"
			errors={$errors.runtime}
			constraints={$constraints.runtime}
			bind:value={$runtimeProxy}
			--backgroundColor="rgb(var(--m3-scheme-surface-container))"
		/>

		<SuperFormTextField
			label="Poster Path"
			name="poster_path"
			errors={$errors.poster_path}
			constraints={$constraints.poster_path}
			bind:value={$formPosterPath}
			--backgroundColor="rgb(var(--m3-scheme-surface-container))"
		/>

		<SuperFormTextField
			label="Backdrop Path"
			name="backdrop_path"
			errors={$errors.backdrop_path}
			constraints={$constraints.backdrop_path}
			bind:value={$formBackdropPath}
			--backgroundColor="rgb(var(--m3-scheme-surface-container))"
		/>

		<SuperFormTextField
			label="TMDB ID"
			name="tmdb_id"
			errors={$errors.tmdb_id}
			constraints={$constraints.tmdb_id}
			bind:value={$tmdb_idProxy}
			--backgroundColor="rgb(var(--m3-scheme-surface-container))"
		/>

		<div class="form-actions">
			<Button type="filled" extraOptions={{ type: 'submit' }}>Update Movie</Button>
		</div>
	</form>
</main>

<style>
	main {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 800px;
		margin: 1rem auto;
		padding: 3rem;
		background-color: rgb(var(--m3-scheme-surface-container));
		border-radius: var(--m3-util-rounding-large);
	}

	.movie-creation {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		gap: 1rem;
	}

	.form-actions {
		margin-top: 2rem;
	}

	.search-section {
		box-sizing: border-box;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin-bottom: 2rem;
		background-color: rgba(var(--m3-scheme-surface-container), 0.8);
		padding: 1rem;
		border-radius: 8px;
	}

	.search-container {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
		align-items: flex-start;
	}

	.search-container :global(.m3-text-field) {
		flex-grow: 1;
	}

	.search-results {
		max-height: 400px;
		overflow-y: auto;
		padding: 1rem;
		border-radius: var(--m3-util-rounding-large);
		background-color: rgb(var(--m3-scheme-surface-container-high));
	}

	.search-results ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.search-results li {
		margin-bottom: 1rem;
	}

	.movie-result {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		background-color: rgba(var(--m3-scheme-surface-container-high), 0.8);
		padding: 0.75rem;
		border-radius: 4px;
	}

	.movie-poster {
		width: 92px;
		border-radius: 4px;
	}

	.no-poster {
		width: 92px;
		height: 138px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(var(--m3-scheme-surface-variant), 0.5);
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-size: 0.8rem;
		border-radius: 4px;
	}

	.movie-info {
		flex-grow: 1;
	}

	.movie-info h4 {
		margin-top: 0;
		margin-bottom: 0.5rem;
	}

	.overview {
		font-size: 0.9rem;
		margin-top: 0;
		color: rgb(var(--m3-scheme-on-surface-variant));
	}
</style>
