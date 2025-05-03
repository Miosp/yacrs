<script lang="ts">
	import TopBar from './topBar.svelte';
	import '$lib/styles/m3-svelte.css';
	import '$lib/styles/css-reset.css';
	import '$lib/styles/global.css';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<TopBar isLoggedIn={data.user !== undefined} username={data.user?.name || undefined} />

{@render children()}
