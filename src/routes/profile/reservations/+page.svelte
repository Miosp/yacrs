<script lang="ts">
	import { formatPaymentStatus } from '$lib/utils/paymentStatus.js';
	import { format } from 'date-fns';
	import { ButtonLink } from 'm3-svelte';

	const { data } = $props();

	$inspect(data.reservations);
</script>

<div class="reservations-container">
	<header class="page-header">
		<h1>Your Reservations</h1>
		<p class="subtitle">Manage your movie ticket reservations</p>
	</header>

	{#if data.reservations.length === 0}
		<div class="empty-state">
			<div class="empty-icon">🎬</div>
			<h2>No Reservations Found</h2>
			<p>You haven't made any movie reservations yet.</p>
			<ButtonLink type="filled" href="/">Browse Movies</ButtonLink>
		</div>
	{:else}
		<div class="table-container">
			<table class="reservations-table">
				<thead>
					<tr>
						<th>Movie</th>
						<th>Date & Time</th>
						<th>Auditorium</th>
						<th>Status</th>
						<th class="actions-column">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.reservations as reservation}
						<tr class="reservation-row">
							<td class="movie-cell">
								<div class="movie-info">
									<span class="movie-title">{reservation.screening.movie.title}</span>
								</div>
							</td>
							<td class="datetime-cell">
								<div class="datetime-info">
									<span class="datetime-main"
										>{format(reservation.screening.startTime, 'PPPPpp')}</span
									>
								</div>
							</td>
							<td class="auditorium-cell">
								<span class="auditorium-name">{reservation.screening.auditorium.displayName}</span>
							</td>
							<td class="payment-status">
								<span class="status-label">{formatPaymentStatus(reservation.status)}</span>
							</td>
							<td class="actions-cell">
								<ButtonLink type="outlined" href={`/profile/reservations/${reservation.id}`}>
									View Details
								</ButtonLink>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	.reservations-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
		min-height: calc(100vh - 120px);
	}

	.page-header {
		margin-bottom: 2rem;
		text-align: center;
	}

	.page-header h1 {
		font-size: 2.5rem;
		font-weight: 600;
		color: rgb(var(--m3-scheme-on-background));
		margin: 0 0 0.5rem 0;
	}

	.subtitle {
		font-size: 1.1rem;
		color: rgb(var(--m3-scheme-on-surface-variant));
		margin: 0;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		text-align: center;
		background-color: rgb(var(--m3-scheme-surface-container-low));
		border-radius: 1.5rem;
		margin-top: 2rem;
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
		opacity: 0.6;
	}

	.empty-state h2 {
		font-size: 1.5rem;
		color: rgb(var(--m3-scheme-on-surface));
		margin: 0 0 0.5rem 0;
	}

	.empty-state p {
		color: rgb(var(--m3-scheme-on-surface-variant));
		margin: 0 0 2rem 0;
		font-size: 1rem;
	}

	.table-container {
		background-color: rgb(var(--m3-scheme-surface-container));
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		margin-top: 1rem;
	}

	.reservations-table {
		width: 100%;
		border-collapse: collapse;
		background-color: rgb(var(--m3-scheme-surface));
	}

	thead {
		background-color: rgb(var(--m3-scheme-surface-container-high));
	}

	th {
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-weight: 600;
		text-align: left;
		padding: 1.25rem 1.5rem;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		border-bottom: 1px solid rgba(var(--m3-scheme-outline), 0.2);
	}

	.actions-column {
		text-align: center;
		width: 150px;
	}

	.reservation-row {
		transition: background-color 0.2s ease;
	}

	.reservation-row:hover {
		background-color: rgba(var(--m3-scheme-primary), 0.04);
	}

	td {
		padding: 1.25rem 1.5rem;
		color: rgb(var(--m3-scheme-on-surface));
		border-bottom: 1px solid rgba(var(--m3-scheme-outline), 0.12);
		vertical-align: middle;
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	.movie-cell {
		min-width: 200px;
	}

	.movie-info {
		display: flex;
		flex-direction: column;
	}

	.movie-title {
		font-weight: 500;
		font-size: 1rem;
		color: rgb(var(--m3-scheme-on-surface));
		line-height: 1.4;
	}

	.datetime-cell {
		min-width: 280px;
	}

	.datetime-info {
		display: flex;
		flex-direction: column;
	}

	.datetime-main {
		font-weight: 400;
		color: rgb(var(--m3-scheme-on-surface));
		font-size: 0.95rem;
	}

	.auditorium-cell {
		min-width: 120px;
	}

	.auditorium-name {
		font-weight: 500;
		color: rgb(var(--m3-scheme-primary));
		background-color: rgba(var(--m3-scheme-primary), 0.08);
		padding: 0.375rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.875rem;
		display: inline-block;
	}

	.actions-cell {
		text-align: center;
		white-space: nowrap;
	}

	.payment-status {
		font-weight: 500;
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-size: 0.875rem;
		padding: 0.25rem 0.5rem;
		border-radius: 0.5rem;
		background-color: rgba(var(--m3-scheme-on-surface-variant), 0.1);
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.reservations-container {
			padding: 1rem 0.5rem;
		}

		.page-header h1 {
			font-size: 2rem;
		}

		.table-container {
			overflow-x: auto;
		}

		.reservations-table {
			min-width: 650px;
		}

		th,
		td {
			padding: 1rem;
		}

		.datetime-cell {
			min-width: 250px;
		}

		.datetime-main {
			font-size: 0.875rem;
		}

		.movie-title {
			font-size: 0.95rem;
		}
	}

	@media (max-width: 480px) {
		.reservations-container {
			padding: 1rem 0.25rem;
		}

		.page-header h1 {
			font-size: 1.75rem;
		}

		.subtitle {
			font-size: 1rem;
		}

		.reservations-table {
			min-width: 600px;
		}

		th,
		td {
			padding: 0.75rem;
		}

		.empty-state {
			padding: 3rem 1rem;
		}

		.empty-state h2 {
			font-size: 1.25rem;
		}
	}
</style>
