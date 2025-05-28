<script lang="ts">
	import MovieCard from '$lib/components/MovieCard.svelte';
	import { format } from 'date-fns';
	import { Button, Card } from 'm3-svelte';
	import { superForm } from 'sveltekit-superforms';

	const { data } = $props();

	const {
		form: purchaseForm,
		errors: purchaseErrors,
		message: purchaseMessage,
		enhance: purchaseEnhance
	} = superForm(data.purchaseForm);

	const {
		form: reserveForm,
		errors: reserveErrors,
		message: reserveMessage,
		enhance: reserveEnhance
	} = superForm(data.reservationForm);

	function injectSeats() {
		const seatIds = data.seats.map((seat) => seat.id);
		if (seatIds.length > 0) {
			$purchaseForm.seats = seatIds as [number, ...number[]];
			$reserveForm.seats = seatIds as [number, ...number[]];
		}
	}
</script>

<main>
	<Card type="elevated">
		<h1>Finalize Reservation</h1>
		<MovieCard
			title={data.screening.movie.title}
			posterUrl={data.screening.movie.posterPath}
			duration={data.screening.movie.duration}
			description={data.screening.movie.description}
			screenings={[]}
		/>
	</Card>
	<Card type="elevated">
		<h2>Reservation Details</h2>
		<p><strong>Time:</strong> {format(data.screening.startTime, 'PPPPpp')}</p>

		<h3>Seats:</h3>
		<ul>
			{#each data.seats as seat}
				<li>Row {seat.row}, Seat {seat.seatNumber}</li>
			{/each}
		</ul>

		<p>
			<strong>Total Price:</strong>
			{data.screening.auditorium.seatPrice.toNumber() * data.seats.length} PLN
		</p>

		{#if purchaseMessage}
			<h3>{$purchaseMessage}</h3>
		{/if}
		{#if reserveMessage}
			<h3>{$reserveMessage}</h3>
		{/if}
		<form action="?/complete" method="POST" use:purchaseEnhance onsubmit={injectSeats}>
			{#if $purchaseErrors.seats}
				<span class="invalid">{$purchaseErrors.seats}</span>
			{/if}
			{#if $purchaseErrors.screeningId}
				<span class="invalid">{$purchaseErrors.screeningId}</span>
			{/if}
			<input type="hidden" name="screeningId" bind:value={$purchaseForm.screeningId} />
			{#each $purchaseForm.seats as seat}
				<input type="hidden" name="seats" value={seat} />
			{/each}
			<Button type="tonal" extraOptions={{ type: 'submit' }}>Pay Now</Button>
		</form>
		<p>or</p>
		<form action="?/reserve" method="POST" use:reserveEnhance onsubmit={injectSeats}>
			{#if $reserveErrors.seats}
				<span class="invalid">{$reserveErrors.seats}</span>
			{/if}
			{#if $reserveErrors.screeningId}
				<span class="invalid">{$reserveErrors.screeningId}</span>
			{/if}
			<input type="hidden" name="screeningId" bind:value={$reserveForm.screeningId} />
			{#each $reserveForm.seats as seat}
				<input type="hidden" name="seats" value={seat} />
			{/each}
			<Button type="outlined" extraOptions={{ type: 'submit' }}>Just Reserve</Button>
		</form>
	</Card>
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	h1,
	h2 {
		text-align: center;
	}
</style>
