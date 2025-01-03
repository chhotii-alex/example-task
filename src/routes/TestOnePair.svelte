<script>
	import { onMount } from 'svelte';
	import { makeTimePromise } from './util.js';
	export let state;

	let buttonResolution = null;
	let startTime = null;

	onMount(() => {
		let timePromise = makeTimePromise(60); // TODO: realistically should be long
		let buttonPromise = new Promise((resolve, reject) => {
			buttonResolution = resolve;
		});
		state.promise = Promise.race([timePromise, buttonPromise]);
		state.endTrialHow = 'timeout';
		startTime = new Date();
	});

	function buttonClick() {
		state.endTrialHow = 'click';
		let now = new Date();
		state.reactionTime = now - startTime;
		buttonResolution();
	}

	$: state.wasCorrect = state.words[1] == state.response;
</script>

<div>
	{state.words[0]}
</div>

<div>
	<input type="text" bind:value={state.response} />
</div>

<button onclick={buttonClick}> Next </button>

<style>
	div {
		width: 100%;
		margin: auto;
		text-align: center;
		font-size: 40px;
	}
</style>
