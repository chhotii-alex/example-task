<script>
	import { makeTimePromise } from './util.js';
	import { onMount } from 'svelte';
	export let state;

	onMount(() => (state.promise = makeTimePromise(0.5)));
</script>

<h1>+</h1>

<style>
	h1 {
		margin: auto;
		text-align: center;
		font-size: 90px;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
