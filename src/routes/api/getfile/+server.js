import Path from 'path';
import fs from 'fs';
import { error } from '@sveltejs/kit';

export async function GET({ url }) {
	try {
		const dirname = Path.resolve('raterdata');
		const filename = url.searchParams.get('file');
		const path = Path.join(dirname, filename);
		console.log(path);
		const blob = fs.readFileSync(path);

		return new Response(blob, {
			status: 200,
			headers: {
				'Content-Disposition': 'attachment; filename=' + filename
			}
		});
	} catch (e) {
		console.log(e);
		error(e);
	}
}
