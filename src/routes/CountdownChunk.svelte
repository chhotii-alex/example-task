<script>
	import Countdown from './Countdown.svelte';
	import { makeTimePromise } from './util.js';
	import { onMount } from 'svelte';
	export let state;

	onMount(() => (state.promise = makeTimePromise(state.duration)));
</script>

<Countdown seconds={state.duration} />
