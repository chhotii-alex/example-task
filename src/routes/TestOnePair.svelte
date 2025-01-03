<script>
	import { onMount } from 'svelte';
	import { makeTimePromise, onEnter } from './util.js';
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
		let field = document.getElementById('responseText');
		if (field) {
			field.focus();
		}
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
	<p>{state.words[0]}</p>
	<br />
	<input
		type="text"
		bind:value={state.response}
		id="responseText"
		onkeyup={(e) => onEnter(e.key, buttonClick)}
		autocomplete="off"
	/>
	<br />
	<button onclick={buttonClick}> Next </button>
</div>

<style>
	div {
		width: 100%;
		margin: auto;
		text-align: center;
		font-size: 40px;
	}
	p {
		font-size: 40px;
		margin-top: 10px;
		margin-botom: 6px;
		margin-block-end: 6px;
	}
	input {
		font-size: 40px;
	}
	button {
		font-size: 30px;
		margin: 46px;
	}
</style>
