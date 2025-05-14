<script lang="ts">
	import TextField from '$lib/components/textInput/TextField.svelte';
	import { Button, ButtonLink } from 'm3-svelte';
	import type { PageProps } from './$types';
	import { format } from 'date-fns';
	import { goto } from '$app/navigation';

	let { data }: PageProps = $props();

	let dateInput = $state(format(new Date(), 'yyyy-MM-dd'));
	let dateOrToday = $derived.by(() => {
		if (dateInput === '' || dateInput === format(new Date(), 'yyyy-MM-dd')) {
			return undefined;
		} else {
			return dateInput;
		}
	});

	let niec = $state('nice');
	let errored = $state(false);
	let loading = $state(false);

	$inspect(dateOrToday);

	$effect(() => {
		if (dateOrToday !== undefined) {
			goto(`/?date=${dateOrToday}`);
		} else {
			goto('/');
		}
	});
</script>

<div class="page-container">
	<h1 class="title">Welcome to The Cinema</h1>

	<div class="movie-picker">
		<search class="date-picker">
			<TextField
				label="Date"
				type="date"
				bind:value={dateInput}
				--backgroundColor="rgb(var(--m3-scheme-surface-container-low))"
			/>
		</search>

		<div class="movie-container">
			{#each data.movies as movie}
				<article class="movie-card" aria-label={`Movie: ${movie.title}`}>
					<div class="poster-container">
						<img class="poster" src={movie.posterPath} alt={`Poster of ${movie.title}`} />
					</div>
					<div class="movie-details">
						<h3 class="movie-title">{movie.title}</h3>
						<p>{movie.duration}min</p>
						<p class="movie-description">{movie.description}</p>
						<div class="screenings">
							{#each movie.screenings as screening}
								<ButtonLink type="outlined" href="/">
									{format(screening.startTime, 'H:mm')}
								</ButtonLink>
							{/each}
						</div>
					</div>
				</article>
			{/each}
		</div>
	</div>

	<div class="debug-controls">
		<TextField label="Nice" {loading} {errored} bind:value={niec} />
		<Button
			type="tonal"
			on:click={() => {
				loading = !loading;
			}}>Loading</Button
		>
		<Button
			type="filled"
			on:click={() => {
				errored = !errored;
			}}>Error</Button
		>
	</div>
</div>

<style>
	.page-container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 1rem;
	}

	.title {
		text-align: center;
		margin-bottom: 2rem;
		color: rgb(var(--m3-scheme-on-background));
		font-size: 2.5rem;
		font-weight: 600;
	}

	.movie-picker {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: rgb(var(--m3-scheme-surface-container-low));
		border-radius: 1.5rem;
		padding: 1.5rem;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.date-picker {
		margin-bottom: 1.5rem;
		width: 100%;
		max-width: 300px;
	}

	.movie-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
		width: 100%;
		gap: 1.5rem;
	}

	.movie-card {
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		padding: 1.5rem;
		border-radius: 1rem;
		background-color: rgb(var(--m3-scheme-surface-container));
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
	}

	.movie-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
	}

	.poster-container {
		flex-shrink: 0;
		margin-right: 1.5rem;
	}

	.poster {
		width: 180px;
		border-radius: 0.75rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.movie-details {
		flex-grow: 1;
		text-align: left;
		display: flex;
		flex-direction: column;
	}

	.movie-title {
		margin-top: 0;
		margin-bottom: 0.75rem;
		color: rgb(var(--m3-scheme-on-surface));
		font-size: 1.5rem;
		font-weight: 600;
	}

	.movie-description {
		margin-bottom: 1rem;
		width: 100%;
		color: rgb(var(--m3-scheme-on-surface-variant));
		line-height: 1.5;
	}
	.screenings {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.debug-controls {
		margin-top: 2rem;
		padding: 1rem;
		background-color: rgb(var(--m3-scheme-surface-container-lowest));
		border-radius: 1rem;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
	}

	@media (max-width: 768px) {
		.movie-container {
			grid-template-columns: 1fr;
		}

		.movie-card {
			flex-direction: column;
			align-items: center;
		}

		.poster-container {
			margin-right: 0;
			margin-bottom: 1rem;
		}

		.movie-details {
			text-align: center;
		}
	}
</style>
