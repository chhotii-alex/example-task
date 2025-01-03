<script>
	import { onMount } from 'svelte';
	import { makeTimePromise } from './util.js';
	export let state;

	let startTime = null;

	onMount(() => {
		state.promise = makeTimePromise(1); // TODO: realistically should be long
	});
</script>

<div class="contdainer">
	<div class="word">
		{state.words[0]}
	</div>

	<div class="word">+</div>

	<div class="word">
		{state.words[1]}
	</div>
</div>

<style>
	div.word {
		width: 100%;
		margin: auto;
		text-align: center;
		font-size: 80px;
	}
	.container {
		position: relative;
		left: 50%;
		transform: translate(-25%, 0px);
		border-style: solid;
	}
</style>
