import fs from 'fs';
import { format } from 'sql-formatter';

const getAllFiles = (directory: string): ReadonlyArray<string> => {
	return fs.readdirSync(directory).flatMap((file) => {
		const path = `${directory}/${file}`;

		if (fs.statSync(path).isDirectory()) {
			return getAllFiles(path);
		}

		const sql = path.endsWith('.sql');

		return sql ? [path] : [];
	});
};

const getAllFilesAndCode = (files: ReadonlyArray<string>) => {
	return files.map((file) => {
		return {
			file,
			code: fs.readFileSync(file, { encoding: 'utf8' }),
		};
	});
};

const greify = (word: string) => {
	return `\x1b[90m${word}\x1b[0m`;
};

const main = (directory: string) => {
	const name = {
		start: 'start',
		end: 'end',
	} as const;

	const config = {
		language: 'postgresql',
		indent: '  ',
		uppercase: false,
		linesBetweenQueries: 1,
	} as const;

	getAllFilesAndCode(getAllFiles(directory)).forEach(({ code, file }) => {
		performance.mark(name.start);

		fs.writeFileSync(file, format(code, config));

		performance.mark(name.end);

		const result = performance.measure(name.start, name.end);

		console.log(`${greify(file)} ${(result.duration * 1000).toFixed(0)}ms`);
	});
};

main('supabase/migrations');
