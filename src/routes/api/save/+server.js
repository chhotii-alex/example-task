import { json } from '@sveltejs/kit';
import fs from 'node:fs';
import Path from 'path';
import { appendFile } from 'node:fs/promises';

export async function POST({ request }) {
	try {
		const data = await request.json();
		// make directory for data if needed
		const dirname = Path.resolve('data');
		const doesExist = fs.existsSync(dirname);
		if (!doesExist) {
			fs.mkdirSync(dirname);
		}
		// relative path
		const filename = `${dirname}/taskdata_${data.subjectID}.json`;
		const resolvedPath = Path.resolve(filename);
		let fileExists = fs.existsSync(resolvedPath);
		let s = '';
		if (fileExists) {
			s += ', ';
		} else {
			s += '[ ';
		}
		s += JSON.stringify(data);
		if (data.end) {
			s += ' ]';
		}
		await appendFile(resolvedPath, s, { flush: true });
		return json(true);
	} catch (e) {
		console.log(e);
		console.log('Did not save data');
		return json(false);
	}
}
