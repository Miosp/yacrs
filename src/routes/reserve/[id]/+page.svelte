<script lang="ts">
	import { format } from 'date-fns';
	import { ButtonLink } from 'm3-svelte';
	import { encodeReserveList } from './reservationUtils';
	import Auditorium from '$lib/components/Auditorium.svelte';
	import type { PageData } from './$types';
	import { source } from 'sveltekit-sse';

	const { data }: { data: PageData } = $props();

	let reservedSeats = $state(data.reservedSeatIds);
	let selectedSeats = $state<number[]>([]);

	source(`/reserve/${data.screeningId}/api`)
		.select('changed')
		.subscribe((event) => {
			if (!event) return;
			const changedSeats: number[] = JSON.parse(event);
			reservedSeats = changedSeats;

			selectedSeats = selectedSeats.filter((s) => !changedSeats.includes(s));
		});

	function toggleSeat(seatId: number) {
		if (selectedSeats.includes(seatId)) {
			selectedSeats = selectedSeats.filter((s) => s !== seatId);
		} else {
			selectedSeats = [...selectedSeats, seatId];
		}
	}
</script>

<main>
	<h1>
		Reserve a ticket for {data.movie.title} at {format(data.startTime, 'yyyy-MM-dd HH:mm')}
	</h1>
	<h2>Room: {data.roomName}</h2>

	<div class="cinema-container">
		<Auditorium
			seats={data.auditoriumSeats}
			reserved={reservedSeats}
			userReserved={selectedSeats}
			onSeatClick={toggleSeat}
			interactible={true}
		/>

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
