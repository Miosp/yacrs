<script lang="ts">
	import { intProxy, superForm } from 'sveltekit-superforms';
	import type { PageProps } from './$types';
	import { Button, TextFieldOutlined, TextFieldOutlinedMultiline } from 'm3-svelte';

	let { data }: PageProps = $props();
	const {
		form: movieForm,
		errors: movieFormErrors,
		constraints: movieFormConstraints,
		enhance: movieFormEnhance
	} = superForm(data.movieForm);
	const runtimeProxy = intProxy(movieForm, 'runtime');
	const tmdb_idProxy = intProxy(movieForm, 'tmdb_id');
	const releaseYearProxy = intProxy(movieForm, 'release_year');

	// Search functionality
	let searchQuery = '';
	let searchResults: any[] = [];
	let isSearching = false;

	async function searchMovies() {
		if (!searchQuery.trim()) return;

		isSearching = true;
		try {
			const response = await fetch(
				`/resources/movies/api/search/${encodeURIComponent(searchQuery)}`
			);
			if (!response.ok) throw new Error('Search failed');
			searchResults = await response.json();
		} catch (error) {
			console.error('Error searching movies:', error);
			searchResults = [];
		} finally {
			isSearching = false;
		}
	}

	function fillFormWithMovie(movie: any) {
		// Populate form with movie data
		$movieForm.title = movie.title || '';
		$movieForm.description = movie.overview || '';
		$releaseYearProxy = movie.release_date ? parseInt(movie.release_date.substring(0, 4)) : null;
		$runtimeProxy = movie.runtime || null;
		$movieForm.poster_path = movie.poster_path || '';
		$movieForm.backdrop_path = movie.backdrop_path || '';
		$tmdb_idProxy = movie.id || null;

		// Clear search results after selection
		searchResults = [];
	}
</script>

<h1>Add a New Movie</h1>

<!-- Search section -->
<div class="search-section">
	<h2>Search for a movie</h2>
	<div class="search-container">
		<TextFieldOutlined
			name="Search for a movie"
			bind:value={searchQuery}
			extraOptions={{
				placeholder: 'Enter movie title to search'
			}}
		/>
		<Button type="filled" on:click={searchMovies} disabled={isSearching}>
			{isSearching ? 'Searching...' : 'Search'}
		</Button>
	</div>

	{#if searchResults.length > 0}
		<div class="search-results">
			<h3>Search Results</h3>
			<ul>
				{#each searchResults as movie}
					<li>
						<div class="movie-result">
							{#if movie.poster_path}
								<img
									src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
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
										? movie.overview.substring(0, 100) + (movie.overview.length > 100 ? '...' : '')
										: 'No overview available'}
								</p>
							</div>
							<Button type="tonal" on:click={() => fillFormWithMovie(movie)}>Select</Button>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	{:else if isSearching}
		<p>Searching...</p>
	{/if}
</div>

<form method="POST" use:movieFormEnhance>
	<div class="form-group">
		<TextFieldOutlined
			name="Title"
			required
			extraOptions={{
				'aria-invalid': $movieFormErrors.title ? 'true' : undefined,
				...$movieFormConstraints.title
			}}
			bind:value={$movieForm.title}
		/>
		{#if $movieFormErrors.title}<span class="invalid">{$movieFormErrors.title}</span>{/if}
	</div>

	<div class="form-group">
		<TextFieldOutlinedMultiline
			name="Description"
			extraOptions={{
				'aria-invalid': $movieFormErrors.description ? 'true' : undefined,
				...$movieFormConstraints.description,
				rows: 4,
				cols: 50
			}}
			bind:value={$movieForm.description}
		/>
		{#if $movieFormErrors.description}<span class="invalid">{$movieFormErrors.description}</span
			>{/if}
	</div>

	<div class="form-group">
		<TextFieldOutlined
			name="Release Year"
			extraOptions={{
				type: 'number',
				'aria-invalid': $movieFormErrors.release_year ? 'true' : undefined,
				...$movieFormConstraints.release_year
			}}
			bind:value={$releaseYearProxy}
		/>
		{#if $movieFormErrors.release_year}<span class="invalid">{$movieFormErrors.release_year}</span
			>{/if}
	</div>

	<div class="form-group">
		<TextFieldOutlined
			name="Runtime (minutes)"
			extraOptions={{
				type: 'number',
				'aria-invalid': $movieFormErrors.runtime ? 'true' : undefined,
				...$movieFormConstraints.runtime
			}}
			bind:value={$runtimeProxy}
		/>
		{#if $movieFormErrors.runtime}<span class="invalid">{$movieFormErrors.runtime}</span>{/if}
	</div>

	<div class="form-group">
		<TextFieldOutlined
			name="Poster Path"
			extraOptions={{
				'aria-invalid': $movieFormErrors.poster_path ? 'true' : undefined,
				...$movieFormConstraints.poster_path
			}}
			bind:value={$movieForm.poster_path}
		/>
		{#if $movieFormErrors.poster_path}<span class="invalid">{$movieFormErrors.poster_path}</span
			>{/if}
	</div>

	<div class="form-group">
		<TextFieldOutlined
			name="Backdrop Path"
			extraOptions={{
				'aria-invalid': $movieFormErrors.backdrop_path ? 'true' : undefined,
				...$movieFormConstraints.backdrop_path
			}}
			bind:value={$movieForm.backdrop_path}
		/>
		{#if $movieFormErrors.backdrop_path}<span class="invalid">{$movieFormErrors.backdrop_path}</span
			>{/if}
	</div>

	<div class="form-group">
		<TextFieldOutlined
			name="TMDB ID"
			extraOptions={{
				type: 'number',
				'aria-invalid': $movieFormErrors.tmdb_id ? 'true' : undefined,
				...$movieFormConstraints.tmdb_id
			}}
			bind:value={$tmdb_idProxy}
		/>
		{#if $movieFormErrors.tmdb_id}<span class="invalid">{$movieFormErrors.tmdb_id}</span>{/if}
	</div>

	<div class="form-actions">
		<Button type="filled" extraOptions={{ type: 'submit' }}>Add Movie</Button>
	</div>
</form>

<style>
	.form-group {
		margin-bottom: 1rem;
	}

	.form-actions {
		margin-top: 2rem;
	}

	.invalid {
		color: rgb(var(--m3-scheme-error));
		font-size: 0.8rem;
		margin-top: 0.25rem;
		display: block;
	}

	/* Search styles */
	.search-section {
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
		padding: 0.5rem;
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
