<script lang="ts">
	import { formatPaymentStatus } from '$lib/utils/paymentStatus';
	import { format } from 'date-fns';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { updateUsedSchema } from './updateUsedSchema';
	import { Dialog, Button } from 'm3-svelte';
	import { invalidate } from '$app/navigation';

	const { data } = $props();

	let reservations = $state(data.reservations);
	let searchTerm = $state(data.search);
	let pendingReservation = $state<{ id: number; used: boolean; title: string } | null>(null);
	let confirmDialogOpen = $state<boolean>(false);

	const { form, enhance } = superForm(data.form, {
		id: 'updateUsed',
		validators: zod(updateUsedSchema),
		resetForm: false,
		onUpdated: ({ form }) => {
			if (form.valid) {
				invalidate('app:reservations');
			}
		}
	});

	const tableData = $derived.by(() =>
		reservations.map((reservation) => ({
			id: reservation.id,
			userEmail: reservation.user.email,
			userDisplayName: reservation.user.name,
			movieTitle: reservation.screening.movie.title,
			screeningDate: format(new Date(reservation.screening.startTime), 'yyyy-MM-dd HH:mm'),
			auditorium: reservation.screening.auditorium.displayName,
			seatCount: reservation.seats.length,
			totalPrice: reservation.totalPrice.toString(),
			status: formatPaymentStatus(reservation.status),
			used: reservation.used,
			createdAt: format(new Date(reservation.createdAt), 'yyyy-MM-dd HH:mm')
		}))
	);

	const filteredData = $derived(
		searchTerm.trim() === ''
			? tableData
			: tableData.filter((reservation) =>
					reservation.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
				)
	);

	function handleUsedChange(event: Event, id: number, used: boolean, title: string) {
		event.preventDefault();

		pendingReservation = { id, used: !used, title };
		confirmDialogOpen = true;
	}

	function cancelUpdate() {
		pendingReservation = null;
		confirmDialogOpen = false;
	}
</script>

<svelte:head>
	<title>All Reservations - Admin</title>
</svelte:head>

<div class="reservations-container">
	<h1>All User Reservations</h1>
	<p class="subtitle">View and manage all reservations in the system</p>

	{#if data.reservations.length === 0}
		<div class="empty-state">
			<div class="empty-icon">🎫</div>
			<h2>No Reservations Found</h2>
			<p>No reservations have been made yet.</p>
		</div>
	{:else}
		<div class="search-container">
			<input
				type="text"
				placeholder="Search by reservation ID..."
				bind:value={searchTerm}
				class="search-input"
			/>
		</div>

		<div class="stats">
			<div class="stat-card">
				<h3>Total Reservations</h3>
				<span class="stat-number">{data.reservations.length}</span>
			</div>
			{#if searchTerm.trim() !== ''}
				<div class="stat-card">
					<h3>Filtered Results</h3>
					<span class="stat-number">{filteredData.length}</span>
				</div>
			{/if}
		</div>
		<div class="table-container">
			{#if filteredData.length === 0}
				<div class="no-results">
					<h3>No matching reservations found</h3>
				</div>
			{:else}
				<table class="reservations-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>User</th>
							<th>Movie</th>
							<th>Screening Date</th>
							<th>Auditorium</th>
							<th>Seats</th>
							<th>Total Price</th>
							<th>Status</th>
							<th>Used</th>
							<th>Created</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredData as reservation}
							<tr class="reservation-row">
								<td class="id-cell">{reservation.id}</td>
								<td class="user-cell">
									<div class="user-info">
										<span class="user-name">{reservation.userDisplayName}</span>
										<span class="user-email">{reservation.userEmail}</span>
									</div>
								</td>
								<td class="movie-cell">{reservation.movieTitle}</td>
								<td class="date-cell">{reservation.screeningDate}</td>
								<td class="auditorium-cell">{reservation.auditorium}</td>
								<td class="seats-cell">{reservation.seatCount}</td>
								<td class="price-cell">{reservation.totalPrice} PLN</td>
								<td class="status-cell">
									<span class="status-badge status-{reservation.status.toLowerCase()}"
										>{reservation.status}</span
									>
								</td>
								<td class="used-cell">
									<input
										type="checkbox"
										checked={reservation.used}
										onclick={(event) =>
											handleUsedChange(
												event,
												reservation.id,
												reservation.used,
												reservation.movieTitle
											)}
										class="used-checkbox"
									/>
									<span class="used-status {reservation.used ? 'used-true' : 'used-false'}">
										{reservation.used ? 'Used' : 'Not Used'}
									</span>
								</td>
								<td class="created-cell">{reservation.createdAt}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	{/if}
</div>

<Dialog headline="Confirm Update" bind:open={confirmDialogOpen}>
	<p>Are you sure you want to update the used status for {pendingReservation?.title}?</p>
	<div class="dialog-actions">
		<form action="?/updateUsed" method="POST">
			<input type="hidden" name="id" value={pendingReservation?.id} />
			<input type="hidden" name="used" value={pendingReservation?.used} />
			<Button type="tonal" extraOptions={{ type: 'submit' }}>Confirm Update</Button>
		</form>
		<Button type="outlined" on:click={cancelUpdate}>Cancel</Button>
	</div>
</Dialog>

<form id="updateUsedForm" use:enhance method="POST" action="?/updateUsed">
	<input type="hidden" name="id" bind:value={$form.id} />
	<input type="hidden" name="used" bind:value={$form.used} />
</form>

<style>
	.reservations-container {
		padding: 1rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	h1 {
		color: rgb(var(--m3-scheme-on-surface));
		margin-bottom: 0.5rem;
		font-size: 2rem;
	}
	.subtitle {
		color: rgb(var(--m3-scheme-on-surface-variant));
		margin-bottom: 2rem;
	}

	.search-container {
		margin-bottom: 1.5rem;
	}

	.search-input {
		box-sizing: border-box;
		width: 100%;
		max-width: 400px;
		padding: 0.75rem 1rem;
		border: 2px solid rgb(var(--m3-scheme-outline-variant));
		border-radius: 0.5rem;
		font-size: 1rem;
		background-color: rgb(var(--m3-scheme-surface-container));
		color: rgb(var(--m3-scheme-on-surface));
		transition: border-color 0.2s ease;
	}

	.search-input:focus {
		outline: none;
		border-color: rgb(var(--m3-scheme-primary));
	}

	.search-input::placeholder {
		color: rgb(var(--m3-scheme-on-surface-variant));
	}

	.empty-state {
		text-align: center;
		padding: 3rem;
		background-color: rgb(var(--m3-scheme-surface-variant));
		border-radius: 1rem;
		margin-top: 2rem;
	}

	.empty-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.empty-state h2 {
		color: rgb(var(--m3-scheme-on-surface-variant));
		margin-bottom: 0.5rem;
	}
	.empty-state p {
		color: rgb(var(--m3-scheme-on-surface-variant));
	}

	.no-results {
		text-align: center;
		padding: 3rem;
		background-color: rgb(var(--m3-scheme-surface-container-low));
		border-radius: 0.75rem;
	}

	.no-results-icon {
		font-size: 2.5rem;
		margin-bottom: 1rem;
		opacity: 0.6;
	}

	.no-results h3 {
		color: rgb(var(--m3-scheme-on-surface));
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
	}

	.stats {
		display: flex;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background-color: rgb(var(--m3-scheme-surface-container));
		padding: 1.5rem;
		border-radius: 0.75rem;
		min-width: 150px;
	}

	.stat-card h3 {
		color: rgb(var(--m3-scheme-on-surface-variant));
		margin: 0 0 0.5rem 0;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.stat-number {
		color: rgb(var(--m3-scheme-primary));
		font-size: 2rem;
		font-weight: bold;
	}

	.table-container {
		overflow-x: auto;
		background-color: rgb(var(--m3-scheme-surface));
		border-radius: 0.75rem;
		box-shadow: var(--m3-elevation-level1);
	}
	.reservations-table {
		width: 100%;
		border-collapse: collapse;
		min-width: 1100px;
	}

	thead {
		background-color: rgb(var(--m3-scheme-surface-variant));
	}

	th {
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-weight: 500;
		text-align: left;
		padding: 1rem;
		font-size: 0.875rem;
	}

	td {
		padding: 1rem;
		color: rgb(var(--m3-scheme-on-surface));
		border-bottom: 1px solid rgb(var(--m3-scheme-outline-variant));
	}

	.reservation-row:hover {
		background-color: rgb(var(--m3-scheme-surface-container-low));
	}

	.id-cell {
		font-weight: 500;
		color: rgb(var(--m3-scheme-primary));
	}

	.user-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.user-name {
		font-weight: 500;
	}

	.user-email {
		font-size: 0.875rem;
		color: rgb(var(--m3-scheme-on-surface-variant));
	}

	.movie-cell {
		font-weight: 500;
	}

	.status-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: uppercase;
	}

	.status-reserved {
		background-color: rgb(var(--m3-scheme-tertiary-container));
		color: rgb(var(--m3-scheme-on-tertiary-container));
	}

	.status-paid {
		background-color: rgb(var(--m3-scheme-primary-container));
		color: rgb(var(--m3-scheme-on-primary-container));
	}
	.status-refunded {
		background-color: rgb(var(--m3-scheme-error-container));
		color: rgb(var(--m3-scheme-on-error-container));
	}
	.used-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: uppercase;
		cursor: pointer;
	}
	.used-cell {
		white-space: nowrap;
	}

	.used-checkbox {
		width: 1.25rem;
		height: 1.25rem;
		accent-color: rgb(var(--m3-scheme-primary));
		cursor: pointer;
		vertical-align: middle;
		margin-right: 0.5rem;
	}

	.used-status {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: uppercase;
		vertical-align: middle;
	}

	.used-true {
		background-color: rgb(var(--m3-scheme-primary-container));
		color: rgb(var(--m3-scheme-on-primary-container));
	}

	.used-false {
		background-color: rgb(var(--m3-scheme-surface-container-high));
		color: rgb(var(--m3-scheme-on-surface-variant));
	}

	.price-cell {
		font-weight: 500;
		color: rgb(var(--m3-scheme-primary));
	}

	.seats-cell {
		text-align: center;
		font-weight: 500;
	}

	.date-cell,
	.created-cell {
		font-family: monospace;
		font-size: 0.875rem;
	}

	.dialog-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 1rem;
	}
</style>
