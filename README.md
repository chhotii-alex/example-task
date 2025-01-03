# example-task: A prototypical computerized Learning/Memory/Psychology task

Suppose you were to formulate a hypothesis. Imagine that your hypothesis is that viewing cat pictures on the Internet causes greater deleterious interference
effects on learning than exposure to other novel learning material. You'd give your study subjects extremely structured study sessions, extremely structured
exposure to interference stimuli (cat pictures or just more of the same), and test them all the same way. This being the 21st century, it would be desirable for all
the stimuli exposure and testing to be computerized.

This code demonstrates how to create such a very structured computerized task using the JavaScript async/await idiom.

It also demonstrates how your computerized task can automatically decide which intervention to apply (cat pictures or more study) per subject in such a way as to
match the two groups in term of baseline (pre-intervention) performance. It does this by consulting the Prospective Randomizer through its REST-style (http) interface.

# Implementation Technologies

This is implementing using a web programming framework called [SvelteKit](https://svelte.dev/). Browse the lovely
[tutorial here](https://svelte.dev/tutorial/svelte/welcome-to-svelte).
Most of the learning curve for this codebase, though, is just the usual HTML, CSS, and JavaScript.

Svelte brings a lot of power to be able to organize your screen spatially: A UI can be built up from components composed of components composed of components. Through
the template-language-like elements (`{variable}` and `{#if}{/if}` etc.) your data structures can drive the contents of the screen. Svelte also takes a very interesting
approach to having what's shown on-screen react to data changes based on user actions (unlike React, it's actually _reactive_). Svelte doesn't offer any particular
way to structure what happens on screen in _time_. However, the await/async syntax of JavaScript allows you to write a function that acts as a state machine. For
example, in a function such as this:

```JavaScript
async function runTask() {
    await showInstructions();
    for (let trial = 0; trial < numTrials; ++trial) {
	await doOneTrial(trial);
    }
    await showThankYouScreen();
}
```

Unlike in traditional programming, this is not a function that runs to completion as fast as possible once started. When invoked, it sets something up, for example
creating the DOM elements that contain the text of the instructions. Once things are set up, the next step doesn't happen right away, but only after something
happens to _resolve_ a _Promise_. That _something_ can be the timeout of a timer, or the click of a button. A whole series of Promises are created and resolved
(or rejected) to gate the app's progress through the series of steps outlined in `runTask()`. Thus, the `runTask()` function is "in charge"-- it's the function that
you would look to here to see the overall top-level logic of the program-- but really everything is being called from the event loop. Note that this is
_concurrancy, not multi-threading_, even though there's rather these two parallel tracks in the app: the `runTask()` logic running the top-level state, and the
low-level event loop and responses to those events. 

# How to get this running

- Install and run the Spring Boot [Prospective Randomizer)[https://github.com/chhotii-alex/prospective-randomizer?tab=readme-ov-file#compiling-and-running] somewhere.
- Install `npm` on your computer.
- `git clone` this repo.
- `cd` into this repo's root directory on your computer
- enter the `npm install` command
- `npm run build`
- `npm run preview` and enter the Network URL in a browser on a device on the local network to test the task.

# Deployment
- After running `npm run build` there will be a directory named `build`. Copy that to the server.
- Install `npm` on your computer.
- Install `pm2` ( `npm install pm2 -g` )
- invoke `pm2 start build/index.js` to start node process serving task over internet
- invoke `pm2 stop 0` to stop serving task

If any of this doesn't work as advertised, please open an Issue and vent me all the details, thanks!
