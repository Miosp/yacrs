<script lang="ts">
	import { format } from 'date-fns';

	const { data } = $props();

	const seatsByRow = data.screening.seats.reduce(
		(acc, seat) => {
			if (!acc[seat.row]) {
				acc[seat.row] = [];
			}
			acc[seat.row].push(seat);
			return acc;
		},
		{} as Record<number, typeof data.screening.seats>
	);

	const sortedRows = Object.keys(seatsByRow)
		.map(Number)
		.sort((a, b) => a - b);

	sortedRows.forEach((row) => {
		seatsByRow[row].sort((a, b) => a.number - b.number);
	});

	const reservedSeatIds = new Set(data.screening.reserved.map((seat) => seat.id));

	function isSeatReserved(seatId: number): boolean {
		return reservedSeatIds.has(seatId);
	}

	let selectedSeats = $state<number[]>([]);

	function toggleSeatSelection(seat: (typeof data.screening.seats)[0]) {
		if (isSeatReserved(seat.id)) {
			return;
		}

		const index = selectedSeats.indexOf(seat.id);
		if (index === -1) {
			selectedSeats = [...selectedSeats, seat.id];
		} else {
			selectedSeats = selectedSeats.filter((id) => id !== seat.id);
		}
	}

	function getSeatStatus(
		seat: (typeof data.screening.seats)[0]
	): 'reserved' | 'selected' | 'available' {
		if (isSeatReserved(seat.id)) {
			return 'reserved';
		}
		if (selectedSeats.includes(seat.id)) {
			return 'selected';
		}
		return 'available';
	}
</script>

<main>
	<h1>
		Reserve a ticket for {data.screening.movie.title} at {format(
			data.screening.startTime,
			'yyyy-MM-dd HH:mm'
		)}
	</h1>
	<p>Room: {data.screening.audtoriumName}</p>

	<div class="cinema-container">
		<!-- <div class="screen">
			<div class="screen-label">SCREEN</div>
		</div> -->

		<div class="seating-area">
			{#each sortedRows as row}
				<div class="row">
					<div class="row-label">Row {row}</div>
					<div class="seats">
						{#each seatsByRow[row] as seat}
							<button
								class="seat {getSeatStatus(seat)}"
								onclick={() => toggleSeatSelection(seat)}
								disabled={isSeatReserved(seat.id)}
								title="Row {seat.row}, Seat {seat.number}"
							>
								{seat.number}
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		<div class="legend">
			<div class="legend-item">
				<div class="seat-example available"></div>
				<span>Available</span>
			</div>
			<div class="legend-item">
				<div class="seat-example selected"></div>
				<span>Selected</span>
			</div>
			<div class="legend-item">
				<div class="seat-example reserved"></div>
				<span>Reserved</span>
			</div>
		</div>

		{#if selectedSeats.length > 0}
			<div class="selected-seats">
				<p>Selected seats: {selectedSeats.length}</p>
				<button class="reserve-button">Reserve Selected Seats</button>
			</div>
		{/if}
	</div>
</main>

<style>
	main {
		max-width: 1200px;
	}

	.cinema-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 2rem;
		width: 100%;
	}

	.screen {
		width: 80%;
		height: 3rem;
		background-color: #d1d1d1;
		margin-bottom: 2rem;
		border-radius: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		transform: perspective(200px) rotateX(-10deg);
		box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
	}

	.screen-label {
		font-weight: bold;
		color: #555;
	}

	.seating-area {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 2rem;
		width: 90%;
	}

	.row {
		display: flex;
		align-items: center;
	}

	.row-label {
		width: 4rem;
		text-align: right;
		margin-right: 1rem;
		font-weight: bold;
	}

	.seats {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.seat {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 4px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		font-weight: bold;
		transition: all 0.2s ease;
		border: none;
	}

	.seat.available {
		background-color: #64b5f6;
		color: white;
	}

	.seat.available:hover {
		background-color: #2196f3;
		transform: scale(1.05);
	}

	.seat.selected {
		background-color: #4caf50;
		color: white;
		transform: scale(1.05);
	}

	.seat.reserved {
		background-color: #e0e0e0;
		color: #9e9e9e;
		cursor: not-allowed;
	}

	.legend {
		display: flex;
		gap: 1.5rem;
		margin: 1rem 0;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.seat-example {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 4px;
	}

	.seat-example.available {
		background-color: #64b5f6;
	}

	.seat-example.selected {
		background-color: #4caf50;
	}

	.seat-example.reserved {
		background-color: #e0e0e0;
	}

	.selected-seats {
		margin-top: 1.5rem;
		text-align: center;
	}

	.reserve-button {
		margin-top: 0.5rem;
		padding: 0.75rem 1.5rem;
		background-color: #ff5722;
		color: white;
		border: none;
		border-radius: 4px;
		font-weight: bold;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.reserve-button:hover {
		background-color: #e64a19;
	}
</style>
