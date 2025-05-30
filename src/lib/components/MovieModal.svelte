<script lang="ts">
	import { TMDB } from '$lib/services/tmdb';
	import { Dialog } from 'm3-svelte';
	import type { CreditsResponse, MovieResponse } from 'moviedb-promise';

	interface MovieModalProps {
		open: boolean;
		id: number | null;
		title: string;
		posterUrl: string | null;
		duration: number | null;
		description: string | null;
	}

	let {
		open = $bindable(),
		id,
		title,
		posterUrl,
		duration,
		description
	}: MovieModalProps = $props();

	$inspect(open);

	function extractGenres(movieInfo: MovieResponse): string {
		if (!movieInfo?.genres?.length) return 'Unknown';
		return movieInfo.genres.map((genre) => genre.name).join(', ');
	}

	function extractDirector(credits: CreditsResponse): string {
		const director = credits?.crew?.find((member) => member.job === 'Director');
		return director?.name || 'Unknown';
	}

	function extractRating(movieInfo: MovieResponse): number | null {
		const rating = movieInfo?.vote_average;
		return typeof rating === 'number' ? Math.round(rating * 10) / 10 : null;
	}
	async function fetchMovieDetails() {
		if (!id) {
			throw new Error('Movie ID is required to fetch details.');
		}

		const [movieInfo, credits] = await Promise.all([
			TMDB.movieInfo({ id }),
			TMDB.movieCredits({ id })
		]);

		return {
			director: extractDirector(credits),
			genre: extractGenres(movieInfo),
			rating: extractRating(movieInfo),
			runtime: movieInfo?.runtime || null
		};
	}
</script>

<Dialog bind:open headline={title}>
	<button class="close-button" onclick={() => (open = false)} aria-label="Close modal">×</button>
	<div class="modal-grid">
		<div class="poster-container">
			{#if posterUrl}
				<img src={posterUrl} alt="{title} poster" class="poster" />
			{:else}
				<div class="poster-placeholder">
					<span>No Image</span>
				</div>
			{/if}
		</div>

		<div class="details">
			<h2>{title}</h2>

			{#if duration}
				<p class="duration">{duration} minutes</p>
			{/if}

			{#if description}
				<p class="description">{description}</p>
			{/if}

			{#await fetchMovieDetails()}
				<div class="loading-state">
					<p>Loading additional information...</p>
				</div>
			{:then movieDetails}
				<div class="additional-info">
					<h3>Additional Information</h3>
					<dl class="info-list">
						<dt>Director:</dt>
						<dd>{movieDetails.director}</dd>

						<dt>Genre:</dt>
						<dd>{movieDetails.genre}</dd>

						{#if movieDetails.rating !== null}
							<dt>Rating:</dt>
							<dd>{movieDetails.rating}/10</dd>
						{/if}

						{#if movieDetails.runtime}
							<dt>Runtime:</dt>
							<dd>{movieDetails.runtime} minutes</dd>
						{/if}
					</dl>
				</div>
			{:catch error}
				<div class="error-state">
					<p class="error">Failed to load details: {error.message}</p>
				</div>
			{/await}
		</div>
	</div>
</Dialog>

<style>
	.close-button {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: rgb(var(--m3-scheme-on-surface));
		padding: 0.5rem;
		border-radius: 50%;
		transition: background-color 0.2s ease;
		z-index: 1;
	}

	.close-button:hover {
		background-color: rgb(var(--m3-scheme-surface-variant));
	}

	.modal-grid {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		align-items: start;
	}

	.poster-container {
		display: flex;
		justify-content: center;
	}

	.poster {
		height: auto;
		width: 200px;
		border-radius: 0.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.poster-placeholder {
		width: 300px;
		height: 450px;
		background-color: rgb(var(--m3-scheme-surface-variant));
		border-radius: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-size: 1.1rem;
	}

	.details {
		color: rgb(var(--m3-scheme-on-surface));
		min-height: 0;
	}

	h2 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 2rem;
		line-height: 1.2;
	}

	h3 {
		margin-top: 2rem;
		margin-bottom: 1rem;
		font-size: 1.3rem;
		color: rgb(var(--m3-scheme-primary));
	}

	.duration {
		color: rgb(var(--m3-scheme-on-surface-variant));
		margin-bottom: 1.5rem;
		font-size: 1.1rem;
	}

	.description {
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.loading-state,
	.error-state {
		padding: 1rem;
		border-radius: 0.5rem;
		margin-top: 1rem;
	}

	.loading-state {
		background-color: rgb(var(--m3-scheme-surface-variant));
		color: rgb(var(--m3-scheme-on-surface-variant));
	}

	.error-state {
		background-color: rgb(var(--m3-scheme-error-container));
		color: rgb(var(--m3-scheme-on-error-container));
	}

	.additional-info {
		margin-top: 1.5rem;
	}

	.info-list {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.5rem 1rem;
		margin: 0;
	}

	.info-list dt {
		font-weight: 600;
		color: rgb(var(--m3-scheme-on-surface-variant));
	}

	.info-list dd {
		margin: 0;
		color: rgb(var(--m3-scheme-on-surface));
	}

	@media (max-width: 768px) {
		.modal-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.poster-container {
			order: -1;
		}

		.poster-placeholder {
			width: 200px;
			height: 300px;
		}

		h2 {
			font-size: 1.5rem;
		}
	}
</style>
