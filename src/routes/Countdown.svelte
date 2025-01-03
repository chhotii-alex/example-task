<script>
	import { onMount } from 'svelte';

	export let dynamic = true;
	export let seconds = 15;
	let timerColor = 'green';

	function updateColor() {
		if (seconds >= 60) {
			timerColor = 'green';
		} else if (seconds >= 10) {
			timerColor = 'orange';
		} else {
			timerColor = 'red';
		}
	}

	function formatTime(seconds) {
		let minutes = Math.floor(seconds / 60);
		seconds = seconds % 60;
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	}

	onMount(() => {
		if (dynamic) {
			const timer = setInterval(() => {
				if (seconds >= 0) {
					seconds--;
					updateColor();
				} else {
					clearInterval(timer);
				}
			}, 1000);

			return () => clearInterval(timer);
		}
	});
</script>

<div style="font-size: 40px; font-weight: bold; color: {timerColor};">
	{#if seconds >= 0}
		{formatTime(seconds)}
	{/if}
</div>

<style>
	div {
		text-align: center;
		height: 50px;
	}
</style>
