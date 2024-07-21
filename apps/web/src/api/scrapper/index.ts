import { AsyncOperation, Defined } from '@poolofdeath20/util';

import axios from 'axios';

import { parse, object, array, string, transform, pipe } from 'valibot';
import { singleFlowParser } from '../../common/parser';

const schemas = {
	latestTimeCommitted: pipe(
		string(),
		transform((value) => {
			return new Date(value);
		})
	),
	template: {
		properties: {
			content: string(),
		},
		list: array(
			pipe(
				object({
					path: string(),
				}),
				transform(({ path }) => {
					return path;
				})
			)
		),
	},
} as const;

class Scrapper {
	private constructor() {}

	static readonly create = () => {
		return new this();
	};

	readonly latestTimeCommitted = async () => {
		return axios
			.get('https://api.github.com/repos/github/gitignore/branches/main')
			.then(({ data }) => {
				return data.commit.commit.author.date;
			})
			.then(singleFlowParser(schemas.latestTimeCommitted))
			.then(AsyncOperation.succeed)
			.catch(AsyncOperation.failed);
	};

	readonly templates = async () => {
		const result = await axios
			.get(
				'https://api.github.com/repos/github/gitignore/git/trees/main?recursive=1'
			)
			.then(({ data }) => {
				return data.tree;
			})
			.then(singleFlowParser(schemas.template.list))
			.then((path) => {
				return path.filter((path) => {
					return path.includes('.gitignore');
				});
			})
			.then((path) => {
				return Promise.all(
					path.map(async (path) => {
						const content = await axios.get(
							`https://raw.githubusercontent.com/github/gitignore/main/${path}`
						);

						return {
							content: parse(
								schemas.template.properties.content,
								content.data
							),
							name: Defined.parse(path.split('/').at(-1))
								.orThrow(
									new Error(
										`There should be an element after splitting by '/'`
									)
								)
								.replace('.gitignore', ''),
						};
					})
				);
			})
			.then(AsyncOperation.succeed)
			.catch(AsyncOperation.failed);

		return result.map(async (list) => {
			const duplicates = Array.from(
				new Set(
					list
						.map(({ name }) => {
							return name;
						})
						.filter((name, index, names) => {
							return names.indexOf(name) !== index;
						})
				)
			);

			const templates = list
				.filter(({ name }) => {
					return !duplicates.includes(name);
				})
				.concat(
					list
						.filter(({ name }) => {
							return duplicates.includes(name);
						})
						.flatMap(({ name }, index, array) => {
							if (array[index - 1]?.name === name) {
								return [];
							}

							return [
								{
									name,
									content: Array.from(
										new Set(
											array
												.filter((element) => {
													return (
														element.name === name
													);
												})
												.map(({ content }) => {
													return content;
												})
												.join('\n')
												.split('\n')
										)
									).join('\n'),
								},
							];
						})
				)
				.map((template, _, templates) => {
					const linesOfContent = template.content.split('\n');

					const file = Defined.parse(linesOfContent.at(0)).orThrow(
						new Error('Content should have at least a line')
					);

					const isReferToOtherTemplate =
						linesOfContent.length === 1 &&
						file.includes('.gitignore');

					if (!isReferToOtherTemplate) {
						return template;
					}

					const templateNameReferred = file.replace('.gitignore', '');

					return {
						...template,
						content: Defined.parse(
							templates.find(({ name }) => {
								return name === templateNameReferred;
							})
						).orThrow(
							new Error(
								`There is no template referred by ${template.name}`
							)
						).content,
					};
				});

			return templates.toSorted((a, b) => {
				return a.name.localeCompare(b.name, undefined, {
					ignorePunctuation: true,
				});
			});
		});
	};
}

export { Scrapper };
