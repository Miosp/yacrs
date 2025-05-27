<script>
	import { ButtonLink } from 'm3-svelte';
</script>

<div class="resources-container">
	<h1 class="page-title">Browse Resources</h1>

	<div class="resource-cards">
		<div class="resource-card">
			<h2>Auditoriums</h2>
			<p>Manage your classroom and lecture hall spaces</p>
			<div class="card-action">
				<ButtonLink type="filled" href="/resources/auditoriums">View Auditoriums</ButtonLink>
			</div>
		</div>
		<div class="resource-card">
			<h2>Movies</h2>
			<p>Explore the collection of films</p>
			<div class="card-action">
				<ButtonLink type="filled" href="/resources/movies">View Movies</ButtonLink>
			</div>
		</div>
		<div class="resource-card">
			<h2>Screenings</h2>
			<p>Create and manage movie screenings</p>
			<div class="card-action">
				<ButtonLink type="filled" href="/resources/screenings">View Screenings</ButtonLink>
			</div>
		</div>
		<div class="resource-card">
			<h2>Reservations</h2>
			<p>View and manage all user reservations</p>
			<div class="card-action">
				<ButtonLink type="filled" href="/resources/reservations">View Reservations</ButtonLink>
			</div>
		</div>
	</div>
</div>

<style>
	.resources-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
	}

	.page-title {
		font-size: 2rem;
		margin-bottom: 2rem;
		color: rgb(var(--m3-scheme-primary));
	}

	.resource-cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 2rem;
	}

	.resource-card {
		background-color: rgb(var(--m3-scheme-surface-container));
		padding: 1.5rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		display: flex;
		flex-direction: column;
	}

	.resource-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.resource-card h2 {
		color: rgb(var(--m3-scheme-primary));
		margin-bottom: 0.75rem;
		font-size: 1.5rem;
	}

	.resource-card p {
		margin-bottom: 1.5rem;
		flex-grow: 1;
		color: rgb(var(--m3-scheme-on-surface-variant));
	}

	.card-action {
		margin-top: auto;
	}
</style>
