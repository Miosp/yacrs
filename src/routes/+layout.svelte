<script lang="ts">
	import TopBar from './topBar.svelte';
	import 'm3-svelte/misc/styles.css';
	// import 'm3-svelte/misc/recommended-styles.css';
	import '$lib/styles/m3-svelte.css';
	import '$lib/styles/css-reset.css';
	import '$lib/styles/global.css';
	import type { LayoutProps } from './$types';

	const { children, data }: LayoutProps = $props();
	const isAdmin = $derived(data.session?.role === 'admin');
</script>

<TopBar isLoggedIn={data.session !== undefined} username={data.session?.name} {isAdmin} />
{@render children()}
