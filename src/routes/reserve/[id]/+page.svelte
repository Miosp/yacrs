<script lang="ts">
	import { format } from 'date-fns';
	import { ButtonLink } from 'm3-svelte';
	import { encodeReserveList } from './reservationUtils';
	import Auditorium from '$lib/components/Auditorium.svelte';
	import type { PageData } from './$types';
	import { source } from 'sveltekit-sse';
	import { SeatState, type Seat, type EmptySeat } from '$lib/data/Seat';

	const { data }: { data: PageData } = $props();

	let reservedSeats = $state(data.reservedSeatIds);
	let selectedSeats = $state<number[]>([]);

	const seatData: Seat[] = $derived.by(() =>
		data.auditoriumSeats.map((seat) => ({
			exists: true,
			id: seat.id,
			row: seat.row,
			number: seat.seatNumber,
			state: getSeatStatus(seat)
		}))
	);

	source(`/reserve/${data.screeningId}/api`)
		.select('changed')
		.subscribe((event) => {
			if (!event) return;
			const changedSeats: number[] = JSON.parse(event);
			reservedSeats = changedSeats;

			selectedSeats = selectedSeats.filter((s) => !changedSeats.includes(s));
		});

	function toggleSeat(seat: Seat | EmptySeat) {
		if (!seat.exists) {
			return;
		} else {
			const castSeat = seat as Seat;
			if (castSeat.state === SeatState.AVAILABLE) {
				if (selectedSeats.includes(castSeat.id)) {
					selectedSeats = selectedSeats.filter((s) => s !== castSeat.id);
				} else {
					selectedSeats = [...selectedSeats, castSeat.id];
				}
			} else if (castSeat.state === SeatState.USER_RESERVED) {
				selectedSeats = selectedSeats.filter((s) => s !== castSeat.id);
			} else {
				return;
			}
		}
	}

	function getSeatStatus(seat: { id: number }) {
		if (reservedSeats.includes(seat.id)) {
			return SeatState.RESERVED;
		} else if (selectedSeats.includes(seat.id)) {
			return SeatState.USER_RESERVED;
		} else {
			return SeatState.AVAILABLE;
		}
	}
</script>

<main>
	<h1>
		Reserve a ticket for {data.movie.title} at {format(data.startTime, 'yyyy-MM-dd HH:mm')}
	</h1>
	<h2>Room: {data.roomName}</h2>

	<div class="cinema-container">
		<Auditorium seats={seatData} onSeatClick={toggleSeat} interactible={true} roomColumns={data.roomWidth} roomRows={data.roomHeight} />

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
		padding: 1rem;
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
		gap: 2rem;
	}

	.selected-seats {
		text-align: center;
	}
</style>
