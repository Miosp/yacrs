<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { signOut } from '$lib/services/clientAuth';
	import { Button, ButtonLink } from 'm3-svelte';

	const { isLoggedIn, username, isAdmin }: { isLoggedIn: boolean; username: string | undefined; isAdmin: boolean } = $props();

	async function handleSignOut() {
		await signOut();
		await invalidate('app:auth');
	}
</script>

<header>
	<div class="right">
		<ButtonLink type="filled" href="/">Home</ButtonLink>
	</div>
	<div class="left">
		{#if isLoggedIn}
			<span class="user">{username || 'He, who shall not be named'}</span>
			<Button type="outlined" on:click={handleSignOut}>Logout</Button>
			{#if isAdmin}
				<ButtonLink type="filled" href="/resources">Resources</ButtonLink>
			{/if}
		{:else}
			<ButtonLink type="filled" href="/signin">Sign In</ButtonLink>
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
