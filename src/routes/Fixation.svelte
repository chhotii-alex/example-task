<script>
	import { makeTimePromise } from './util.js';
	import { onMount } from 'svelte';
	export let state;

	onMount(() => (state.promise = makeTimePromise(0.5)));
</script>

<h1>+</h1>

<style>
	h1 {
		text-align: center;
		font-size: 90px;
		height: 100%;
		width: 100%;
		margin: auto;
		align-items: center;
		justify-content: center;
	}
</style>
