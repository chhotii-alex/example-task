<script>
	import { makeTimePromise } from './util.js';
	import { onMount } from 'svelte';
	export let state;

	onMount(() => (state.promise = makeTimePromise(20)));
</script>

<img src={state.picture} width="500" />

<style>
</style>
