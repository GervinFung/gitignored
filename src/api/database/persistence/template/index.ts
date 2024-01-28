import { type DeepReadonly } from '@poolofdeath20/util';

import type { Persistence } from '..';
import type { AsyncTemplates } from '../../../scrapper';
import DatabaseOperation from '../util';

type Templates = DeepReadonly<
	{
		content: string;
		name: string;
	}[]
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

	readonly internalFindMany = async (): Promise<AsyncTemplates> => {
		return this.templateBatch()
			.findLatestOne()
			.then((result) => {
				return result.flatMap((batch) => {
					return batch.match({
						some: (batch) => {
							return this.findManyIn({ batch });
						},
						none: async () => {
							const result =
								await this.templateBatch().insertion();

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
						},
					});
				});
			});
	};

	readonly externalFindMany = async () => {
		return this.internalFindMany().then((result) => {
			return result.map(async (templates) => {
				return {
					templates,
				};
			});
		});
	};
}

export type { Templates };

export { TemplatePersistence };
