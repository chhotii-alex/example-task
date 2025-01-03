<script>
	import { onMount } from 'svelte';
	import { makeTimePromise } from './util.js';
	export let state;

	let startTime = null;

	onMount(() => {
		state.promise = makeTimePromise(1); // TODO: realistically should be long
	});
</script>

<div>
	{state.words[0]}
</div>

<div>+</div>

<div>
	{state.words[1]}
</div>

<style>
	div {
		width: 100%;
		margin: auto;
		text-align: center;
		font-size: 80px;
	}
</style>
