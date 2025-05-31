<script lang="ts">
	import { numberProxy, superForm } from 'sveltekit-superforms';
	import type { PageProps } from './$types';
	import { Button, Card } from 'm3-svelte';
	import SuperFormTextField from '$lib/components/base/textInput/SuperFormTextField.svelte';
	import TextField from '$lib/components/base/textInput/TextField.svelte';
	import Auditorium from '$lib/components/Auditorium.svelte';
	import { SeatState, type EmptySeat, type Seat } from '$lib/data/Seat';

	let { data }: PageProps = $props();
	const { form, errors, constraints, message, enhance } = superForm(data.form, {
		dataType: 'json'
	});
	let rowNumber: number = $state(NaN);
	let seatsNumber: number = $state(NaN);
	let seats = $state<Seat[]>([]);
	let seatExistenceMap = $state<Map<string, boolean>>(new Map());
	$effect(() => {
		if (!isNaN(rowNumber) && !isNaN(seatsNumber)) {
			const newSeats: Seat[] = [];
			let seatId = 1;

			for (let row = 1; row <= rowNumber; row++) {
				for (let number = 1; number <= seatsNumber; number++) {
					const positionKey = `${row}-${number}`;
					const shouldExist = seatExistenceMap.get(positionKey) ?? true;

					if (shouldExist) {
						newSeats.push({
							id: seatId++,
							exists: true,
							row: row,
							number: number,
							state: SeatState.AVAILABLE
						});
					}
				}
			}

			seats = newSeats;
		} else {
			seats = [];
		}
	});

	const seatPriceProxy = numberProxy(form, 'seatPrice');
	function seatClickHandler(seat: Seat | EmptySeat) {
		const positionKey = `${seat.row}-${seat.number}`;

		if (!seat.exists) {
			seatExistenceMap.set(positionKey, true);
		} else {
			seatExistenceMap.set(positionKey, false);
		}

		seatExistenceMap = new Map(seatExistenceMap);
	}

	function submitHandler() {
		if (isNaN(rowNumber) || isNaN(seatsNumber)) {
			return;
		}

		$form.seats = seats.map((seat) => {
			return {
				row: seat.row,
				seatNumber: seat.number
			};
		});
		$form.rows = rowNumber;
		$form.seatsPerRow = seatsNumber;
	}
</script>

<main>
	<Card type="elevated">
		<h1>Add a new Auditorium</h1>
		<form method="POST" onsubmit={submitHandler} use:enhance>
			{#if message}
				<h3>{$message}</h3>
			{/if}

			<div>
				<SuperFormTextField
					label="Auditorium Name"
					name="name"
					errors={$errors.name}
					constraints={$constraints.name}
					bind:value={$form.name}
				/>
			</div>

			<div>
				<SuperFormTextField
					label="Seat Price"
					name="seatPrice"
					type="number"
					errors={$errors.seatPrice}
					constraints={$constraints.seatPrice}
					bind:value={$seatPriceProxy}
				/>
			</div>
			<div>
				<TextField
					label="Number of Rows"
					type="number"
					name="rows"
					onchange={(e: Event) => {
						rowNumber = parseInt((e.target as HTMLInputElement).value);
					}}
					min="1"
				/>
			</div>
			<div>
				<TextField
					label="Seats per Row"
					type="number"
					name="seats"
					onchange={(e: Event) => {
						seatsNumber = parseInt((e.target as HTMLInputElement).value);
					}}
					min="1"
				/>
			</div>

			<Button type="elevated" extraOptions={{ type: 'submit' }}>Add</Button>
		</form>
		{#if !isNaN(rowNumber) && !isNaN(seatsNumber)}
			<Auditorium
				{seats}
				onSeatClick={seatClickHandler}
				roomRows={rowNumber}
				roomColumns={seatsNumber}
			/>
		{/if}
	</Card>
</main>

<style>
	main {
		max-width: 1200px;
		margin: 0 auto;
	}

	h1 {
		text-align: center;
	}

	form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}
</style>
