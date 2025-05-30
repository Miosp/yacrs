<script lang="ts">
	import TextField from '$lib/components/base/textInput/TextField.svelte';
	import type { PageProps } from './$types';
	import { addDays, format, subDays } from 'date-fns';
	import { goto } from '$app/navigation';
	import { dateStrOrToday } from './mainPageUtil';
	import { Button } from 'm3-svelte';
	import MovieCard from '$lib/components/MovieCard.svelte';

	let { data }: PageProps = $props();

	let dateInput = $state(format(new Date(), 'yyyy-MM-dd'));
	let dateOrToday = $derived.by(() => dateStrOrToday(dateInput));

	$effect(() => {
		const path = dateOrToday ? `/?date=${dateOrToday}` : '/';
		goto(path);
	});
</script>

<div class="page-container">
	<h1 class="title">Welcome to The Cinema</h1>

	<div class="movie-picker">
		<search class="date-picker">
			<Button
				type="tonal"
				on:click={() => (dateInput = format(subDays(new Date(dateInput), 1), 'yyyy-MM-dd'))}
			>
				←
			</Button>
			<TextField
				label="Date"
				type="date"
				bind:value={dateInput}
				--backgroundColor="rgb(var(--m3-scheme-surface-container-low))"
			/>
			<Button
				type="tonal"
				on:click={() => (dateInput = format(addDays(new Date(dateInput), 1), 'yyyy-MM-dd'))}
			>
				→
			</Button>
		</search>

		<div class="movie-container">
			{#each data.movies as movie}
				<MovieCard
					id={movie.TMDBId}
					title={movie.title}
					posterUrl={movie.posterPath}
					duration={movie.duration}
					description={movie.description}
					screenings={movie.screenings}
				/>
			{/each}
		</div>
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
		display: flex;
		align-items: center;
		gap: 1rem;
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

	@media (max-width: 768px) {
		.movie-container {
			grid-template-columns: 1fr;
		}
	}
</style>
