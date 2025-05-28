<script lang="ts">
    import { TMDB } from "$lib/services/tmdb";
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  export let movie: { id: number; title: string; posterPath?: string; duration?: number; description?: string };
  export let onClose: () => void;

  type ExtraInfo = {
    director?: string;
    genre?: string;
    rating?: string;
    [key: string]: any;
  };

  const extraInfo = writable<ExtraInfo | null>(null);
  const loading = writable(false);
  const error = writable<string | null>(null);

  function handleClickOutside(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

async function extractGenre(movieInfo: any): Promise<string> {
  try {
    const genres = movieInfo.genres?.map((g: any) => g.name);
    return genres?.length ? genres.join(', ') : 'Unknown';
  } catch (error) {
    console.error(`Failed to fetch genre:`, error);
    return 'Unknown';
  }
}

  // Utility to extract rating (vote_average)
  function extractRating(data: any): string {
    return data?.vote_average;
  }

async function extractDirector(credits: any): Promise<string> {
  try {
    const director = credits.crew?.find((member: any) => member.job === 'Director');
    return director?.name ?? 'Unknown';
  } catch (error) {
    console.error('Failed to fetch director:', error);
    return 'Unknown';
  }
}

onMount(async () => {
  if (!movie?.id) {
    error.set('Movie ID not provided');
    return;
  }

  loading.set(true);
  error.set(null);
  extraInfo.set(null);

  try {
    const query = encodeURIComponent(movie.title);

			const response = await fetch(
				`/resources/movies/api/search/${encodeURIComponent(query)}`
			);

    const data = await response.json();
    const movieData = data.results?.[0];
    console.log('Movie search results:', data);

    if (!movieData) {
      throw new Error('Movie not found in search results');
    }

    const credits = await TMDB.movieCredits({ id: movieData.id });
    const director = await extractDirector(credits);
    //const genres = await extractGenre(credits)
    const info = await TMDB.movieInfo({ id: movieData.id });
    const genre = await extractGenre(info);
    console.log(credits)
    movie.duration = info.runtime;

    extraInfo.set({
      director,
      genre,
      rating: extractRating(movieData),
    });

  } catch (err) {
    error.set(err instanceof Error ? err.message : String(err));
  } finally {
    loading.set(false);
  }
});
</script>

<div
  class="modal-backdrop"
  on:click={handleClickOutside}
  on:keydown={(e) => { if (e.key === 'Escape') onClose(); }}
  tabindex="0"
  role="dialog"
  aria-modal="true"
>
  <div class="modal-content">
    <button class="close-button" on:click={onClose}>×</button>

    <div class="modal-grid">
      <div class="poster-container">
        <img src={movie.posterPath} alt="{movie.title} poster" class="poster" />
      </div>

      <div class="details">
        <h2>{movie.title}</h2>
        <p class="duration">{movie.duration} minutes</p>
        <p class="description">{movie.description}</p>

        {#if $loading}
          <p>Loading additional info...</p>
        {:else if $error}
          <p class="error">Error: {$error}</p>
        {:else if $extraInfo}
          <div class="extra-info">
            <h3>Additional Info</h3>
            <p><strong>Director:</strong> {$extraInfo.director}</p>
            <p><strong>Genre:</strong> {$extraInfo.genre}</p>
            <p><strong>Rating:</strong> {$extraInfo.rating}</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		padding: 1rem;
	}

	.modal-content {
		background-color: rgb(var(--m3-scheme-surface));
		border-radius: 1rem;
		padding: 2rem;
		max-width: 800px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
		position: relative;
	}

	.close-button {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: rgb(var(--m3-scheme-on-surface));
	}

	.modal-grid {
		display: grid;
		grid-template-columns: 300px 1fr;
		gap: 2rem;
	}

	.poster-container {
		display: flex;
		justify-content: center;
	}

	.poster {
		max-width: 100%;
		border-radius: 0.5rem;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.details {
		color: rgb(var(--m3-scheme-on-surface));
	}

	h2 {
		margin-top: 0;
		font-size: 2rem;
	}

	.duration {
		color: rgb(var(--m3-scheme-on-surface-variant));
		margin-bottom: 1.5rem;
	}

	.description {
		line-height: 1.6;
		margin-bottom: 2rem;
	}

	.screening-times {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.screening {
		background-color: rgb(var(--m3-scheme-primary-container));
		color: rgb(var(--m3-scheme-on-primary-container));
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	@media (max-width: 768px) {
		.modal-grid {
			grid-template-columns: 1fr;
		}

		.poster-container {
			margin-bottom: 1.5rem;
		}
	}
</style>