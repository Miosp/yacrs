<script lang="ts">
	import { format } from 'date-fns';
	import { ButtonLink } from 'm3-svelte';
	import { encodeReserveList } from './reservationUtils';

	const { data } = $props();

	let selectedSeats = $state<number[]>([]);

	function toggleSeat(seatNumber: number) {
		if (selectedSeats.includes(seatNumber)) {
			selectedSeats = selectedSeats.filter((s) => s !== seatNumber);
		} else {
			selectedSeats = [...selectedSeats, seatNumber];
		}
	}
</script>

<main>
	<h1>
		Reserve a ticket for {data.movie.title} at {format(data.startTime, 'yyyy-MM-dd HH:mm')}
	</h1>
	<h2>Room: {data.roomName}</h2>

	<div class="cinema-container">
		<div class="screen">
			<div class="screen-label">SCREEN</div>
		</div>

		<div class="seating-area">
			{#each data.seats as row, rowNumber}
				<div class="row">
					<div class="row-label">Row {rowNumber}</div>
					<div class="seats">
						{#each row as seat, seatNumber}
							<div class="seatContainer">
								{#if seat !== undefined}
									<button
										class="seat"
										class:reserved={seat.reserved}
										class:selected={selectedSeats.includes(seat.id)}
										class:available={!seat.reserved && !selectedSeats.includes(seat.id)}
										onclick={() => toggleSeat(seat.id)}
									>
										{seatNumber}
									</button>
								{/if}
							</div>
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
				<ButtonLink
					type="filled"
					href="/reserve/{data.screeningId}/finalize?seats={encodeReserveList(selectedSeats)}"
					>Reserve {selectedSeats.length} Selected Seats</ButtonLink
				>
			</div>
		{/if}
	</div>
</main>

<style>
	main {
		max-width: 1200px;
		margin: 0 auto;
	}

	h1,
	h2 {
		text-align: center;
		margin-top: 1rem;
	}

	.cinema-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 2rem;
		width: 100%;
	}
	.screen {
		width: calc(100% - 5rem);
		height: 2rem;
		background-color: #d1d1d1;
		margin-bottom: 2rem;
		border-radius: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		transform: perspective(200px) rotateX(-10deg);
		box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
		margin-left: 5rem;
		margin-right: 0;
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
		width: 100%;
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
		flex-grow: 1;
		justify-content: space-evenly;
	}

	.seatContainer {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 2.5rem;
		height: 2.5rem;
	}

	.seat {
		width: 100%;
		height: 100%;
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
		background-color: #5eb7ff;
		color: black;
	}

	.seat.available:hover {
		background-color: #39a6ff;
		transform: scale(1.05);
	}

	.seat.selected {
		background-color: #6dc970;
		color: black;
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
		background-color: #5eb7ff;
	}

	.seat-example.selected {
		background-color: #6dc970;
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
