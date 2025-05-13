<script lang="ts">
	import TextField from '$lib/components/TextField.svelte';

	let niec = $state('nice');
</script>

<h1>Welcome to The Cinema</h1>
<TextField label="Nice" loading={false} bind:value={niec} />
