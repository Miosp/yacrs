<script lang="ts">
	import { ButtonLink } from 'm3-svelte';
	import { format } from 'date-fns';

	const { data } = $props();

	const tableData = $derived(
		data.screenings.map((screening) => ({
			id: screening.id,
			movieTitle: screening.movie.title,
			date: format(new Date(screening.startTime), 'yyyy-MM-dd HH:mm'),
			room: screening.auditorium.displayName
		}))
	);
</script>

<div class="screenings-container">
	<h1>Movie Screenings</h1>
	<div class="actions">
		<ButtonLink type="tonal" href="/resources/screenings/add">Add Screening</ButtonLink>
	</div>

	<table>
		<thead>
			<tr>
				<th>ID</th>
				<th>Movie Title</th>
				<th>Date</th>
				<th>Room</th>
			</tr>
		</thead>
		<tbody>
			{#each tableData as screening}
				<tr>
					<td>{screening.id}</td>
					<td>{screening.movieTitle}</td>
					<td>{screening.date}</td>
					<td>{screening.room}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.screenings-container {
		padding: 1rem;
	}

	h1 {
		color: rgb(var(--m3-scheme-on-surface));
		margin-bottom: 1rem;
	}

	.actions {
		margin-bottom: 1.5rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		background-color: rgb(var(--m3-scheme-surface));
		border-radius: 0.5rem;
		overflow: hidden;
		box-shadow: var(--m3-elevation-level1);
	}

	thead {
		background-color: rgb(var(--m3-scheme-surface-variant));
	}

	th {
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-weight: 500;
		text-align: left;
		padding: 1rem;
	}

	td {
		padding: 1rem;
		color: rgb(var(--m3-scheme-on-surface));
		border-top: 1px solid rgba(var(--m3-scheme-outline), 0.12);
	}

	tr:hover {
		background-color: rgba(var(--m3-scheme-primary), 0.04);
	}

	tbody tr:last-child td {
		border-bottom: none;
	}
</style>
