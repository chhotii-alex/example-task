<script>
	import { makeTimePromise } from './util.js';
	import { onMount } from 'svelte';
	export let state;

	onMount(() => (state.promise = makeTimePromise(7)));
</script>

<div>
	<h1>Loading...</h1>
</div>

<style>
	h1,
	p {
		text-align: center;
	}
	div {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
