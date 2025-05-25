<script lang="ts">
</script>

<main>
	<h1>Your Profile</h1>
	<a href="/profile/reservations">
		<article>
			<h2>Reservations</h2>
			<p>View your upcoming reservations</p>
		</article>
	</a>
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
	}

	h1,
	h2 {
		color: rgb(var(--m3-scheme-on-surface));
		text-align: center;
	}

	article {
		background: rgb(var(--m3-scheme-surface-container));
		border-radius: 12px;
		padding: 2rem;
		box-shadow:
			0 4px 6px rgba(0, 0, 0, 0.05),
			0 1px 3px rgba(0, 0, 0, 0.1);
	}

	a {
		display: block;
		text-decoration: none;
		color: inherit;

		&:hover {
			background: rgba(var(--m3-scheme-primary), 0.1);
			box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
			transform: translateY(-2px);
			transition:
				transform 0.2s,
				box-shadow 0.2s;
		}
	}
</style>
