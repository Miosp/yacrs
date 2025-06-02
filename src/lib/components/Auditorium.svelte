<script lang="ts">
	import type { EmptySeat, Seat } from '$lib/data/Seat';
	interface AuditoriumProps {
		seats: Seat[];
		onSeatClick?: (seat: Seat | EmptySeat) => void;
		interactible?: boolean;
		roomRows?: number;
		roomColumns?: number;
	}

	const {
		seats,
		onSeatClick = () => {},
		interactible = true,
		roomRows,
		roomColumns
	}: AuditoriumProps = $props();

	const roomRowSize = $derived.by(
		() => roomRows ?? seats.reduce((maxRowNum, seat) => Math.max(seat.row, maxRowNum), 0)
	);
	const roomColumnSize = $derived.by(
		() => roomColumns ?? seats.reduce((maxSeatNum, seat) => Math.max(seat.number, maxSeatNum), 0)
	);
	const seatGrid = $derived.by(() => {
		const grid: (Seat | null)[][] = Array(roomRowSize)
			.fill(null)
			.map(() => Array(roomColumnSize).fill(null));

		for (const seat of seats) {
			if (
				seat.row > 0 &&
				seat.number > 0 &&
				seat.row <= roomRowSize &&
				seat.number <= roomColumnSize
			) {
				grid[seat.row - 1][seat.number - 1] = seat;
			}
		}

		return grid;
	});

	function getSeatStatus(seat: Seat | null) {
		if (!seat) return 'empty';
		else return seat.state;
	}

	function handleSeatClick(seat: Seat | null, rowIndex: number, seatIndex: number) {
		if (interactible) {
			let seatValue: Seat | EmptySeat;
			if (!seat) {
				seatValue = {
					exists: false,
					row: rowIndex + 1,
					number: seatIndex + 1
				};
			} else {
				seatValue = seat;
			}

			onSeatClick(seatValue);
		}
	}

	let seatGridElement: HTMLElement;
	let screenWidth = $state('fit-content');

	$effect(() => {
		seats;
		if (seatGridElement) {
			screenWidth = `${seatGridElement.offsetWidth}px`;
		}
	});
</script>

<div class="auditorium">
	<div class="alignment-container">
		<div class="screen" style="width: {screenWidth};">
			<div class="screen-label">SCREEN</div>
		</div>

		<div class="seat-area">
			<div class="row-labels">
				{#each Array(roomRowSize) as _, rowIndex}
					<div class="row-label">
						Row {rowIndex + 1}
					</div>
				{/each}
			</div>
			<div
				class="seat-grid"
				bind:this={seatGridElement}
				style="grid-template-columns: repeat({roomColumnSize}, 1fr); grid-template-rows: repeat({roomRowSize}, 1fr);"
			>
				{#each seatGrid as row, rowIndex}
					{#each row as seat, seatIndex (`${rowIndex}-${seatIndex}-${getSeatStatus(seat)}`)}
						{@const status = getSeatStatus(seat)}
						<button
							class="seat seat--{status}"
							class:seat--clickable={status !== 'reserved' && interactible}
							disabled={status === 'reserved' || !interactible}
							onclick={() => handleSeatClick(seat, rowIndex, seatIndex)}
							aria-label={seat ? `Row ${seat.row}, Seat ${seat.number} - ${status}` : 'Empty space'}
						>
							{#if seat}
								<div class="seat-content">
									<span class="seat-number">{seat.number}</span>
								</div>
							{:else}
								<div class="seat-content seat--empty">
									<span class="seat-number">-</span>
								</div>
							{/if}
						</button>
					{/each}
				{/each}
			</div>
		</div>
	</div>

	<!-- Legend -->
	<div class="legend">
		<div class="legend-item">
			<div class="legend-seat legend-seat--available"></div>
			<span>Available</span>
		</div>
		<div class="legend-item">
			<div class="legend-seat legend-seat--reserved"></div>
			<span>Reserved</span>
		</div>
		<div class="legend-item">
			<div class="legend-seat legend-seat--user-reserved"></div>
			<span>Your Selection</span>
		</div>
	</div>
</div>

<style>
	.auditorium {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding: 2rem;
		background: rgb(var(--m3-scheme-surface-container-low));
		border-radius: 16px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		max-width: 100%;
		overflow-x: auto;
	}

	.alignment-container {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
		gap: 2rem;
	}

	.screen {
		box-sizing: border-box;
		width: fit-content;
		min-width: 200px;
		height: 60px;
		background: linear-gradient(
			135deg,
			rgb(var(--m3-scheme-surface-container-highest)),
			rgb(var(--m3-scheme-outline-variant))
		);
		border-radius: 8px 8px 40px 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		position: relative;
		overflow: hidden;
		padding: 0 2rem;
	}

	.screen::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(255, 255, 255, 0.1) 50%,
			transparent 100%
		);
		animation: shimmer 3s infinite;
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	.screen-label {
		color: rgb(var(--m3-scheme-on-surface));
		font-weight: 600;
		font-size: 0.875rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.seat-area {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.row-labels {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding-top: 1rem;
	}

	.row-label {
		box-sizing: border-box;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		padding: 0 0.5rem;
		font-size: 0.875rem;
		color: rgb(var(--m3-scheme-on-surface-variant));
		background: rgb(var(--m3-scheme-surface-variant));
		border-radius: 6px;
		border: 1px solid rgb(var(--m3-scheme-outline-variant));
	}

	.seat-grid {
		display: grid;
		gap: 6px;
		padding: 1rem;
		background: rgb(var(--m3-scheme-surface-container));
		border-radius: 12px;
		max-width: 100%;
		overflow-x: auto;
	}

	.seat {
		width: 40px;
		height: 40px;
		border: none;
		border-radius: 8px;
		cursor: default;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		font-weight: 500;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.seat--empty {
		background: transparent;
		box-shadow: none;
	}

	.seat--available {
		background: rgb(var(--m3-scheme-primary-container));
		color: rgb(var(--m3-scheme-on-primary-container));
		border: 2px solid transparent;
	}

	.seat--reserved {
		background: rgb(var(--m3-scheme-error-container));
		color: rgb(var(--m3-scheme-on-error-container));
		cursor: not-allowed;
		border: 2px solid transparent;
	}

	.seat--user-reserved {
		background: rgb(var(--m3-scheme-tertiary-container));
		color: rgb(var(--m3-scheme-on-tertiary-container));
		border: 2px solid rgb(var(--m3-scheme-tertiary));
		box-shadow: 0 0 0 2px rgba(var(--m3-scheme-tertiary), 0.2);
	}

	.seat--clickable {
		cursor: pointer;
	}

	.seat--clickable:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.seat--available.seat--clickable:hover {
		background: rgb(var(--m3-scheme-primary));
		color: rgb(var(--m3-scheme-on-primary));
		border-color: rgb(var(--m3-scheme-primary));
	}

	.seat--user-reserved.seat--clickable:hover {
		background: rgb(var(--m3-scheme-tertiary));
		color: rgb(var(--m3-scheme-on-tertiary));
	}

	.seat-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.seat-number {
		font-size: 0.75rem;
		font-weight: 600;
		line-height: 1;
	}

	.legend {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 1rem;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: rgb(var(--m3-scheme-on-surface));
		font-size: 0.875rem;
	}

	.legend-seat {
		box-sizing: border-box;
		width: 20px;
		height: 20px;
		border-radius: 4px;
		border: 1px solid rgb(var(--m3-scheme-outline-variant));
	}

	.legend-seat--available {
		background: rgb(var(--m3-scheme-primary-container));
	}

	.legend-seat--reserved {
		background: rgb(var(--m3-scheme-error-container));
	}

	.legend-seat--user-reserved {
		background: rgb(var(--m3-scheme-tertiary-container));
		border-color: rgb(var(--m3-scheme-tertiary));
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.auditorium {
			padding: 1rem;
			gap: 1.5rem;
		}

		.seat {
			width: 32px;
			height: 32px;
			font-size: 0.625rem;
		}

		.seat-grid {
			gap: 4px;
			padding: 0.75rem;
		}

		.row-labels {
			gap: 4px;
			padding-top: 0.75rem;
		}

		.row-label {
			width: 28px;
			height: 32px;
			font-size: 0.75rem;
		}

		.legend {
			gap: 1rem;
		}

		.legend-item {
			font-size: 0.75rem;
		}

		.legend-seat {
			width: 16px;
			height: 16px;
		}
	}

	@media (max-width: 480px) {
		.seat {
			width: 28px;
			height: 28px;
		}

		.seat-grid {
			gap: 3px;
		}

		.row-labels {
			gap: 3px;
		}

		.row-label {
			width: 24px;
			height: 28px;
			font-size: 0.625rem;
		}
	}
</style>
