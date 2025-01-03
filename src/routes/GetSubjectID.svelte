<script>
	import { onMount } from 'svelte';
	export let state;

	let buttonResolution = null;
	let complaint = '';

	onMount(() => {
		state.promise = new Promise((resolve, reject) => {
			buttonResolution = resolve;
		});
		let field = document.getElementById('responseText');
		if (field) {
			field.focus();
		}
	});

	function isNameOk(name) {
		if (!name || name.length < 1) {
			complaint = 'Please enter a valid subject ID';
			return false;
		}
		state.complaint = null;
		complaint = '';
		return true;
	}
	function onEnter(key, action) {
		if (key === 'Enter') {
			action();
		}
	}
	function buttonClick() {
		if (isNameOk(state.subjectID)) {
			buttonResolution();
		}
	}
</script>

<label for="responseText"> Subject ID: </label>
<input
	type="text"
	bind:value={state.subjectID}
	name="responseText"
	id="responseText"
	onkeyup={(e) => onEnter(e.key, buttonClick)}
/>
<br />
<div class="below">
	{#if isNameOk(state.subjectID)}
		<button onclick={buttonClick}> Click here when ready to begin! </button>
	{/if}
	{complaint}
	{state.complaint}
</div>

<style>
	.below {
		margin: 10px;
		padding: 4px;
		border-width: 2px;
		height: 100px;
	}
	* {
		font-size: 24px;
	}
	label {
		margin: 6px;
	}
	button {
		padding: 4px 12px;
		margin: 2px auto;
		border-radius: 10px;
		display: block;
	}
</style>
