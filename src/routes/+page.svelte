<script>
	import makeRandomizerConnection from './randomizer.js';
	import { onMount, tick } from 'svelte';
	import { words1, words2, pictures } from './data.js';
	import { shuffle } from './util.js';
	import Instructions from './Instructions.svelte';
	import WordPairSlide from './WordPairSlide.svelte';
	import Fixation from './Fixation.svelte';
	import Loading from './Loading.svelte';
	import GetSubjectID from './GetSubjectID.svelte';
	import TestOnePair from './TestOnePair.svelte';
	import CountdownChunk from './CountdownChunk.svelte';
	import PictureSlide from './PictureSlide.svelte';

	let prosRand;

	let tryFullScreen = false;
	let isBrowser = typeof window !== 'undefined';
	let errorMsg = null;

	// These control what's currently on-screen.
	let Chunk = null;
	let state = {};

	// per-task data to save:
	let subjectID = '';
	let taskStartTime = null;
	let dataRecords = null;

	async function saveData(dataToSave) {
		console.log(dataToSave);
		let s = JSON.stringify(dataToSave);
		const response = await fetch(`/api/save`, {
			method: 'POST',
			body: s,
			headers: {
				'content-type': 'application/json'
			}
		});
		let success = await response.json();
		if (!success) {
			throw new Error('Could not save response data!');
		}
	}

	async function runChunk(componentClass, vars) {
		Object.assign(state, vars);
		Chunk = componentClass;
		await tick();
		let result = await state.promise;
		state.promise = null;
		Chunk = null;
		return result;
	}

	async function runTask() {
		try {
			prosRand = await makeRandomizerConnection();
			await runTaskImpl();
		} catch (e) {
			errorMsg = e.message;
		}
	}

	async function runWordPairSlideshow(pairsList) {
		// TODO: REMOVE THIS .slice
		pairsList = pairsList.slice(2, 5);
		for (let index = 0; index < pairsList.length; ++index) {
			await runChunk(Fixation, {});
			let trialEndHow = await runChunk(WordPairSlide, {
				words: pairsList[index]
			});
		}
	}

	async function doQuiz(pairsList) {
		let totalCorrect = 0;
		// trim off ends, to avoid primacy/recency effects:
		pairsList = pairsList.slice(2, -2);
		// TODO: REMOVE THIS .slice
		pairsList = pairsList.slice(0, 4);
		shuffle(pairsList);
		for (let index = 0; index < pairsList.length; ++index) {
			await runChunk(Fixation, {});
			await runChunk(TestOnePair, {
				words: pairsList[index],
				response: ''
			});
			let { iteration, response, reactionTime, endTrialHow, wasCorrect } = state;
			saveData({ subjectID, iteration, index, response, reactionTime, endTrialHow, wasCorrect });
			if (wasCorrect) {
				totalCorrect++;
			}
		}
		return totalCorrect;
	}

	async function viewCatPictures() {
		shuffle(pictures);
		for (let index = 0; index < pictures.length; ++index) {
			await runChunk(Fixation, {});
			let filename = pictures[index];
			let path = `images/${filename}`;
			await runChunk(PictureSlide, { picture: path });
		}
	}

	async function runTaskImpl() {
		while (true) {
			await runChunk(GetSubjectID, { subjectID: '' });
			let alreadyExisting = await prosRand.doesSubjectExist(state.subjectID);
			if (alreadyExisting) {
				state.complaint = 'subject already exists';
				continue;
			}
			subjectID = state.subjectID;

			dataRecords = [];

			taskStartTime = new Date();
			await goFullScreen();
			if (tryFullScreen) {
				await runChunk(Loading, {});
			}

			await runChunk(Instructions, {
				text: `<br/><br/>You will see ${words1.length} pairs of words.<br/>
				Please pay attention and try to remember these pairs of
				words for later.<br/>
				Try to remember which word is paired with each other word.
				<br/><br/>
				Click the button when ready to begin.`,
				buttonText: 'Begin!'
			});
			await runWordPairSlideshow(words1);

			await runChunk(Instructions, {
				text: `Now you will be quizzed.<br/>
				When you see each word presented,<br/>
				type in the word it was paired with.<br/>
				You will have up to 60 seconds to respond.
				<br/><br/>
				Click the button when ready to begin.`,
				buttonText: 'Begin!'
			});
			state['iteration'] = 1;
			let quizScore = await doQuiz(words1);

			let studyArm = await prosRand.getRandomizationGroup(subjectID, quizScore);

			if (studyArm == 'distraction') {
				await runChunk(Instructions, {
					text: `Enjoy the cat pictures!`,
					buttonText: 'Begin'
				});
				await viewCatPictures();
			} else if (studyArm == 'interference') {
				await runChunk(Instructions, {
					text: `You will now see ${words2.length} additional pairs of words.<br/>
				Again, please pay attention and try to remember these pairs of
				words for later, and
				try to remember which word is paired with each other word.
				<br/><br/>
				Click the button when ready to begin.`,
					buttonText: 'Begin!'
				});
				await runWordPairSlideshow(words2);
			} else {
				throw new Error('Unknown study condition:' + studyArm);
			}

			await runChunk(Instructions, {
				text: `You will now have a few minute to relax.`,
				buttonText: 'OK',
				timeout: 60
			});
			await runChunk(CountdownChunk, { duration: 35 });

			await runChunk(Instructions, {
				text: `Now you will be quizzed on the words again.<br/>
				When you see each word presented,<br/>
				type in the word it was paired with.<br/>
				You will have up to 60 seconds to respond.
				<br/><br/>
				Click the button when ready to begin.`,
				buttonText: 'Begin!'
			});
			state['iteration'] = 2;
			await doQuiz(words1);

			saveData({ subjectID: subjectID, end: true });
			await runChunk(Instructions, {
				text: `<strong>Done!</strong><br/>
				   Thank you!`,
				buttonText: 'Restart!'
			});

			await cancelFullScreen();
		}
	}

	onMount(() => {
		runTask();
	});

	async function goFullScreen() {
		if (!tryFullScreen) return;
		try {
			let elem = document.getElementById('taskfullscreen');
			await elem.requestFullscreen();
		} catch (e) {}
	}

	async function cancelFullScreen() {
		try {
			await document.exitFullscreen();
		} catch (e) {}
	}
</script>

{#if errorMsg}
	<p class="errorStyle">
		{errorMsg}
	</p>
{/if}

<div id="taskfullscreen">
	<div class="center">
		{#if Chunk}
			<Chunk {state} />
		{/if}
	</div>
</div>

<style>
	.errorStyle {
		color: red;
		font-style: italic;
		font-size: 60px;
	}
	.center {
		margin: 0;
		position: absolute;
		top: 50%;
		left: 50%;
		-ms-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}
</style>
