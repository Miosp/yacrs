<script lang="ts">
	import { format } from 'date-fns';
	import { Button, ButtonLink } from 'm3-svelte';

	interface MovieCardProps {
		title: string;
		posterUrl: string | null;
		duration: number | null;
		description: string | null;
		screenings: Screening[];
	}

	interface Screening {
		id: number;
		startTime: Date;
	}

	const { title, posterUrl, duration, description, screenings }: MovieCardProps = $props();
</script>

<article aria-label={`Movie: ${title}`}>
	<div class="poster-container">
		<img class="poster" src={posterUrl} alt={`Poster of ${title}`} />
	</div>
	<div class="movie-details">
		<h3 class="movie-title">{title}</h3>
		{#if duration !== null}
			<p>{duration}min</p>
		{/if}
		<p class="movie-description">{description}</p>
		<div class="screenings">
			{#each screenings as screening}
				{#if screening.startTime < new Date()}
					<Button type="outlined" disabled>
						{format(screening.startTime, 'H:mm')}
					</Button>
				{:else}
					<ButtonLink type="outlined" href={`/reserve/${screening.id}`}>
						{format(screening.startTime, 'H:mm')}
					</ButtonLink>
				{/if}
			{/each}
		</div>
	</div>
</article>

<style>
	article {
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

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
		}
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

	@media (max-width: 768px) {
		article {
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
