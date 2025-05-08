<script lang="ts">
	import TopBar from './topBar.svelte';
	import '$lib/styles/m3-svelte.css';
	import '$lib/styles/css-reset.css';
	import '$lib/styles/global.css';
	import type { LayoutProps } from './$types';

	const { children, data }: LayoutProps = $props();
	const isAdmin = $derived(data.session?.role === 'admin')
</script>

<TopBar isLoggedIn={data.session !== undefined} username={data.session?.name} isAdmin={isAdmin} />
{@render children()}
