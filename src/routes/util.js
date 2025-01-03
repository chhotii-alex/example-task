function makeTimePromise(seconds) {
	let p = new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve('timeout');
		}, seconds * 1000);
	});
	return p;
}

function makeEternalPromise() {
	let p = new Promise((resolve, reject) => {
		// do nothing ever
	});
	return p;
}

/* Fischer-Yates ftw */
function shuffle(a) {
	var j, x, i;
	for (i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
	return a;
}

export { makeTimePromise, makeEternalPromise, shuffle };
