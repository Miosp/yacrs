<script lang="ts">
	import { format } from 'date-fns';
	import { PaymentStatus, type Prisma } from '@prisma/client';
	import { Button, Card } from 'm3-svelte';
	import Auditorium from '$lib/components/Auditorium.svelte';
	import { SeatState, type Seat } from '$lib/data/Seat';
	import { createQrSvgString } from '@svelte-put/qr';

	const { data } = $props();

	const reservedSeats = data.reservation.screening.reservations.flatMap((reservation) =>
		reservation.seats.map((seat) => seat.id)
	);
	const selectedSeats = data.reservation.seats.map((seat) => seat.id);
	const seats: Seat[] = data.reservation.screening.auditorium.seats.map((seat) => ({
		exists: true,
		id: seat.id,
		row: seat.row,
		number: seat.seatNumber,
		state: selectedSeats.includes(seat.id)
			? SeatState.USER_RESERVED
			: reservedSeats.includes(seat.id)
				? SeatState.RESERVED
				: SeatState.AVAILABLE
	}));
	const reservationUrl = `${data.appRoot}/resources/reservations?search=${data.reservation.id}`;
	const qrCodeSvgString = createQrSvgString({
		data: reservationUrl,
		shape: 'circle'
	});

	function formatDateTime(date: Date) {
		return format(date, 'PPPPpp');
	}
	function formatPrice(price: Prisma.Decimal) {
		return new Intl.NumberFormat('pl-PL', {
			style: 'currency',
			currency: 'PLN'
		}).format(Number(price));
	}
</script>

<main>
	<Card type="elevated">
		<div class="header">
			<h1>Reservation #{data.reservation.id}</h1>
			<div class="status">
				{data.reservation.status}
			</div>
		</div>

		<div class="reservation-details">
			<div class="movie-section">
				<div class="movie">
					<h2>Movie Details</h2>
					<div class="movie-info">
						{#if data.reservation.screening.movie.posterPath}
							<img
								src="https://image.tmdb.org/t/p/w200{data.reservation.screening.movie.posterPath}"
								alt="{data.reservation.screening.movie.title} poster"
								class="movie-poster"
							/>
						{/if}
						<div class="movie-details">
							<h3>{data.reservation.screening.movie.title}</h3>
							{#if data.reservation.screening.movie.description}
								<p class="description">{data.reservation.screening.movie.description}</p>
							{/if}
							{#if data.reservation.screening.movie.releaseYear}
								<p><strong>Release Year:</strong> {data.reservation.screening.movie.releaseYear}</p>
							{/if}
							{#if data.reservation.screening.movie.duration}
								<p>
									<strong>Duration:</strong>
									{data.reservation.screening.movie.duration} minutes
								</p>
							{/if}
						</div>
					</div>
				</div>
				<div class="qr-code">
					{@html qrCodeSvgString}
				</div>
			</div>

			<div class="screening-section">
				<h2>Screening Information</h2>
				<div class="screening-info">
					<p>
						<strong>Date & Time:</strong>
						{formatDateTime(data.reservation.screening.startTime)}
					</p>
					<p><strong>Auditorium:</strong> {data.reservation.screening.auditorium.displayName}</p>
				</div>
			</div>

			<div class="seats-section">
				<h2>Selected Seats</h2>
				<Auditorium
					{seats}
					interactible={false}
					roomColumns={data.reservation.screening.auditorium.seatsPerRow}
					roomRows={data.reservation.screening.auditorium.rows}
				/>
				<div class="seats-grid">
					{#each data.reservation.seats as seat}
						<div class="seat-item">
							<span class="seat-label">Row {seat.row}, Seat {seat.seatNumber}</span>
						</div>
					{/each}
				</div>
			</div>

			<div class="payment-section">
				<h2>Payment Information</h2>
				<div class="payment-info">
					<p><strong>Total Price:</strong> {formatPrice(data.reservation.totalPrice)}</p>
					<p><strong>Reserved On:</strong> {formatDateTime(data.reservation.createdAt)}</p>
				</div>
				{#if data.reservation.status === PaymentStatus.RESERVED || data.reservation.status === PaymentStatus.COMPLETED}
					<div class="payment-actions">
						{#if data.reservation.status === PaymentStatus.RESERVED}
							<form action="?/pay" method="POST">
								<Button type="tonal" extraOptions={{ type: 'submit' }}>Pay Now</Button>
							</form>
						{:else if data.reservation.status === PaymentStatus.COMPLETED}
							<form action="?/refund" method="POST">
								<Button type="tonal" extraOptions={{ type: 'submit' }}>Request Refund</Button>
							</form>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</Card>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		background-color: rgb(var(--m3-scheme-background));
		color: rgb(var(--m3-scheme-on-background));
	}

	:global(.reservation-card) {
		padding: 2rem;
		max-width: 800px;
		margin: 0 auto;
		background-color: rgb(var(--m3-scheme-surface-container));
		color: rgb(var(--m3-scheme-on-surface));
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid rgb(var(--m3-scheme-outline-variant));
	}

	.header h1 {
		margin: 0;
		color: rgb(var(--m3-scheme-primary));
	}

	.status {
		padding: 0.5rem 1rem;
		border-radius: 20px;
		color: rgb(var(--m3-scheme-on-surface));
		font-weight: bold;
		text-transform: uppercase;
		font-size: 0.875rem;
	}

	.movie-section {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		align-items: center;
	}

	.reservation-details {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.movie-section h2,
	.screening-section h2,
	.seats-section h2,
	.payment-section h2 {
		margin: 0 0 1rem 0;
		color: rgb(var(--m3-scheme-on-surface));
		border-bottom: 2px solid rgb(var(--m3-scheme-primary));
		padding-bottom: 0.5rem;
	}

	.movie-info {
		display: flex;
		gap: 1.5rem;
		align-items: flex-start;
	}

	.movie-poster {
		width: 150px;
		height: auto;
		border-radius: 12px;
		box-shadow: 0 4px 8px rgba(var(--m3-scheme-shadow), 0.2);
	}

	.movie-details h3 {
		margin: 0 0 1rem 0;
		color: rgb(var(--m3-scheme-primary));
		font-size: 1.5rem;
	}

	.movie-details p {
		margin: 0.5rem 0;
		line-height: 1.6;
		color: rgb(var(--m3-scheme-on-surface));
	}

	.description {
		color: rgb(var(--m3-scheme-on-surface-variant));
		font-style: italic;
		max-width: 500px;
	}

	.screening-info,
	.payment-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.screening-info p,
	.payment-info p {
		margin: 0;
		font-size: 1.1rem;
		color: rgb(var(--m3-scheme-on-surface));
	}

	.seats-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.seat-item {
		background: rgb(var(--m3-scheme-surface-container-high));
		border: 2px solid rgb(var(--m3-scheme-primary));
		border-radius: 12px;
		padding: 0.75rem 1rem;
		text-align: center;
		min-width: 120px;
		transition: background-color 0.2s ease;
	}

	.seat-item:hover {
		background: rgb(var(--m3-scheme-surface-container-highest));
	}

	.seat-label {
		font-weight: bold;
		color: rgb(var(--m3-scheme-primary));
	}
	.payment-actions {
		margin: 1.5rem 0;
	}

	.qr-code {
		align-self: stretch;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.qr-code :global(svg) {
		width: 100%;
		height: 100%;
	}

	.movie {
		flex: 1;
	}
	@media (max-width: 768px) {
		:global(.reservation-card) {
			padding: 1rem;
		}

		.header {
			flex-direction: column;
			gap: 1rem;
			text-align: center;
		}

		.movie-section {
			flex-direction: column;
			align-items: center;
		}

		.movie-info {
			flex-direction: column;
			text-align: center;
		}

		.movie-poster {
			align-self: center;
		}

		.qr-code {
			width: 80%;
			height: 80%;
			align-self: center;
		}

		.seats-grid {
			justify-content: center;
		}
	}
</style>
