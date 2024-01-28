import { Defined, Optional, isFalse } from '@poolofdeath20/util';

import type { Persistence } from '..';
import { oneWeekComparison } from '../../../logic/util';
import DatabaseOperation from '../util';

class TemplateBatchPersistence {
	constructor(
		private readonly props: Readonly<{
			persistence: Persistence;
		}>
	) {}

	readonly scrapper = this.props.persistence.scrapper;

	readonly template = this.props.persistence.template;

	readonly templateBatch = () => {
		return this.props.persistence.database().from('template_batch');
	};

	readonly insertion = async () => {
		return this.shouldUpdate().then((result) => {
			return result.flatMap(async (shouldUpdate) => {
				if (isFalse(shouldUpdate)) {
					return DatabaseOperation.failed(
						new Error('No need to update')
					);
				}

				const result = await this.scrapper().latestTimeCommitted();

				return result.flatMap(async (latestTimeCommitted) => {
					return this.templateBatch()
						.insert({
							created_at: new Date().toISOString(),
							latest_committed_time:
								latestTimeCommitted.toISOString(),
						})
						.select('id')
						.then((result) => {
							if (result.error) {
								return DatabaseOperation.failed(result.error);
							}

							return DatabaseOperation.succeed(
								Defined.parse(result.data.at(0)).orThrow(
									new Error(
										'id must be returned after insertion'
									)
								)
							);
						});
				});
			});
		});
	};

	readonly shouldUpdate = async () => {
		return this.findLatestTimeCommitted()
			.then((result) => {
				return result.match({
					none: () => {
						return true;
					},
					some: (time) => {
						return (
							oneWeekComparison(time).status === 'larget-or-equal'
						);
					},
				});
			})
			.then(DatabaseOperation.succeed);
	};

	private readonly findLatestTimeCommitted = async () => {
		return this.templateBatch()
			.select('latest_committed_time')
			.order('id', {
				ascending: false,
			})
			.limit(1)
			.then((result) => {
				return Optional.from(result.data?.at(0)).map((result) => {
					return new Date(result.latest_committed_time);
				});
			});
	};

	readonly findLatestCommittedTime = async () => {
		return this.findLatestTimeCommitted().then(async (time) => {
			const latestCommittedTime = await time.match({
				some: (time) => {
					return time;
				},
				none: async () => {
					return await this.insertion()
						.then((result) => {
							return result.flatMap((batch) => {
								return this.template().insertion({
									batch,
								});
							});
						})
						.then(this.findLatestTimeCommitted)
						.then((time) => {
							return time.unwrapOrThrow(
								new Error(
									'time must be defined after insertion'
								)
							);
						});
				},
			});

			return DatabaseOperation.succeed({ latestCommittedTime });
		});
	};

	readonly findLatestOne = async () => {
		return this.templateBatch()
			.select('id')
			.order('id', {
				ascending: false,
			})
			.limit(1)
			.then((result) => {
				if (result.error) {
					return DatabaseOperation.failed(result.error);
				}

				return DatabaseOperation.succeed(
					Optional.from(result.data.at(0))
				);
			});
	};
}

export { TemplateBatchPersistence };
