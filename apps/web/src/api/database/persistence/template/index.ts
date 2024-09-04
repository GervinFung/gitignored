import type { Persistence } from '..';
import type {DeepReadonly} from '@poolofdeath20/util';

import { isFalse  } from '@poolofdeath20/util';

import DatabaseOperation from '../util';

type Templates = DeepReadonly<
	Array<{
		content: string;
		name: string;
	}>
>;

class TemplatePersistence {
	constructor(
		private readonly props: Readonly<{
			persistence: Persistence;
		}>
	) {}

	readonly templateBatch = this.props.persistence.templateBatch;

	readonly scrapper = this.props.persistence.scrapper;

	readonly template = () => {
		return this.props.persistence.database().from('template');
	};

	readonly insertion = async (
		props: DeepReadonly<{
			batch: {
				id: number;
			};
		}>
	) => {
		return this.scrapper()
			.templates()
			.then((result) => {
				return result.flatMap(async (templates) => {
					return this.template()
						.insert(
							templates.map((template) => {
								return {
									...template,
									batch_id: props.batch.id,
									created_at: new Date().toISOString(),
								};
							})
						)
						.select('id')
						.then((result) => {
							if (result.error) {
								return DatabaseOperation.failed(result.error);
							}

							return DatabaseOperation.succeed(result.data);
						});
				});
			});
	};

	private readonly insertionsThenFindMany = async () => {
		return this.templateBatch()
			.insertion()
			.then((result) => {
				return result.flatMap(async (batch) => {
					return this.insertion({
						batch,
					}).then((result) => {
						return result.flatMap(() => {
							return this.findManyIn({
								batch,
							});
						});
					});
				});
			});
	};

	private readonly findManyIn = async (
		props: DeepReadonly<{
			batch: {
				id: number;
			};
		}>
	) => {
		return this.template()
			.select('name, content')
			.eq('batch_id', props.batch.id)
			.order('name', { ascending: true })
			.then((results) => {
				if (results.error) {
					return DatabaseOperation.failed(results.error);
				}

				return DatabaseOperation.succeed(results.data);
			});
	};

	private readonly findMany = async () => {
		return this.templateBatch()
			.findLatestOne()
			.then((result) => {
				return result.flatMap((batch) => {
					return batch.match({
						none: this.insertionsThenFindMany,
						some: (batch) => {
							return this.findManyIn({ batch });
						},
					});
				});
			});
	};

	readonly findAll = async () => {
		return this.templateBatch()
			.shouldUpdate()
			.then((result) => {
				return result.flatMap(async (shouldUpdate) => {
					if (isFalse(shouldUpdate)) {
						return this.findMany();
					}

					return this.insertionsThenFindMany();
				});
			});
	};

	readonly externalFindMany = async () => {
		return this.findMany().then((result) => {
			return result.map((templates) => {
				return Promise.resolve({
					templates,
				});
			});
		});
	};
}

export type { Templates };

export { TemplatePersistence };
