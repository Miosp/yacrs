<script lang="ts">
	import { signOut } from '@auth/sveltekit/client';
	import { Button, ButtonLink } from 'm3-svelte';

	let { isLoggedIn, username }: { isLoggedIn: boolean; username: string | undefined } = $props();
</script>

<header>
	<div class="right">
		<ButtonLink type="filled" href="/">Home</ButtonLink>
	</div>
	<div class="left">
		<Button type="outlined" on:click={() => signOut()}>Logout</Button>
		{#if isLoggedIn}
			<span class="user">{username}</span>
		{:else}
			<span class="user">Guest</span>
			<ButtonLink type="filled" href="/signin">Login</ButtonLink>
		{/if}
	</div>
</header>

<style>
	header {
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		width: 100%;
		background-color: rgb(var(--m3-scheme-surface-container-lowest));
	}

	.left,
	.right {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}
</style>
