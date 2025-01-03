class Randomizer {
	constructor() {
		this.url = 'http://localhost:8080/';
		this.protocolName = 'my_study';
		this.protocol = {
			groupNames: ['interference', 'distraction'],
			variableSpec: { score: null },
			allowRevision: true,
			algorithm: 'Balanced'
		};
	}

	async initiateProtocol() {
		let url = `${this.url}${this.protocolName}/start`;
		let s = JSON.stringify(this.protocol);
		const response = await fetch(url, {
			method: 'POST',
			body: s,
			headers: {
				'content-type': 'application/json'
			}
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
	}

	async getRandomizationGroup(subjectId, score) {
		let url = `${this.url}${this.protocolName}/subject/${subjectId}/group`;
		let body = { score: score };
		let s = JSON.stringify(body);
		const response = await fetch(url, {
			method: 'POST',
			body: s,
			headers: {
				'content-type': 'application/json'
			}
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const answer = await response.text();
		return answer;
	}

	async doesSubjectExist(subjectId) {
		let url = `${this.url}${this.protocolName}/subject/${subjectId}`;
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});
		if (response.status == 404) {
			return false;
		} else if (response.status == 200) {
			return true;
		} else {
			throw new Error('Unexpected response status:' + response.status);
		}
	}
}

async function makeRandomizerConnection() {
	let r = new Randomizer();
	await r.initiateProtocol();
	return r;
}

export default makeRandomizerConnection;
