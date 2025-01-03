import { json } from '@sveltejs/kit';
import { readdir } from 'node:fs/promises';
import fs from 'node:fs';
import Path from 'path';
import { error } from '@sveltejs/kit';

export async function GET() {
	let results = [];
	const dirname = Path.resolve('raterdata');
	try {
		const files = await readdir(dirname);
		for (const file of files) {
			if (Path.extname(file) == '.json') {
				results.push(file);
			}
		}
		return json(results);
	} catch (e) {
		console.log(e);
		error(e);
	}
}
