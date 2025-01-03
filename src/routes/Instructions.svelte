<script>
	import { onMount } from 'svelte';
	export let state;

	let buttonResolution = null;
	let buttonText = state.buttonText ? state.buttonText : 'Next';

	onMount(
		() =>
			(state.promise = new Promise((resolve, reject) => {
				buttonResolution = resolve;
			}))
	);
</script>

<p>
	{@html state.text}
</p>
<div>
	<button onclick={() => buttonResolution()}> {buttonText} </button>
</div>

<style>
	p {
		text-align: center;
		font-size: 40px;
		margin: 4px;
	}
	div {
		width: 100%;
		margin: auto;
	}
	button {
		padding: 4px 26px;
		margin: 20px auto;
		font-size: 42px;
		border-radius: 10px;
		display: block;
	}
</style>
