import { describe, it, expect } from 'vitest';

import { Scrapper } from '../../../src/api/scrapper';

describe('Git Ignore Scrapper', () => {
	const scrapper = Scrapper.create();

	it('should scrap the name and the content of techs listed in ascending order', async () => {
		const templates = await scrapper.templates();

		const allDataValid = templates.match({
			failed: (error) => {
				return error;
			},
			succeed: (templates) => {
				return (
					templates.length ===
						new Set(
							templates.map(({ name }) => {
								return name;
							})
						).size &&
					templates.every(({ name, content }) => {
						return (
							typeof name === 'string' &&
							typeof content === 'string'
						);
					})
				);
			},
		});

		expect(allDataValid).toBe(true);

		const inAscendingOrder = templates.match({
			failed: (error) => {
				return error;
			},
			succeed: (templates) => {
				return Boolean(
					templates.length &&
						templates.every(({ name }, index) => {
							return !index
								? true
								: name.toUpperCase() >
										(templates[
											index - 1
										]?.name?.toUpperCase() ?? '');
						})
				);
			},
		});

		expect(inAscendingOrder).toBe(true);
	});

	it('should scrap the latest commit time of github gitignore repo', async () => {
		const time = await scrapper.latestTimeCommitted().then((value) => {
			return value.match({
				succeed: (value) => {
					return value;
				},
				failed: (error) => {
					return error;
				},
			});
		});

		expect(time).toStrictEqual(expect.any(Date));
	});
});
