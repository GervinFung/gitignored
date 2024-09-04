import type { Persistence } from '..';

import { Defined, Optional, isFalse } from '@poolofdeath20/util';

import { isMoreThanOrEqualOneWeek, isTimeEqual } from '../../../logic/util';
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
		const result = await this.scrapper().latestTimeCommitted();

		return result.flatMap(async (latestTimeCommitted) => {
			return this.templateBatch()
				.insert({
					created_at: new Date().toISOString(),
					latest_committed_time: latestTimeCommitted.toISOString(),
				})
				.select('id')
				.then((result) => {
					if (result.error) {
						return DatabaseOperation.failed(result.error);
					}

					return DatabaseOperation.succeed(
						Defined.parse(result.data.at(0)).orThrow(
							new Error('id must be returned after insertion')
						)
					);
				});
		});
	};

	readonly shouldUpdate = async () => {
		return this.findLastUpdatedTime()
			.then((result) => {
				return result.match({
					none: () => {
						return true;
					},
					some: async (lastUpdatedTime) => {
						if (!isMoreThanOrEqualOneWeek(lastUpdatedTime)) {
							return false;
						}

						const result =
							await this.scrapper().latestTimeCommitted();

						const failed = () => {
							return false;
						};

						return result.match({
							failed,
							succeed: async (latestTimeCommitted) => {
								return this.findLatestTimeCommitted().then(
									(result) => {
										return result.match({
											failed,
											succeed: (latestTime) => {
												return !isTimeEqual(
													latestTimeCommitted,
													latestTime.latestCommittedTime
												);
											},
										});
									}
								);
							},
						});
					},
				});
			})
			.then(DatabaseOperation.succeed);
	};

	private readonly findLastUpdatedTime = async () => {
		return this.templateBatch()
			.select('created_at')
			.order('id', {
				ascending: false,
			})
			.limit(1)
			.then((result) => {
				return Optional.from(result.data?.at(0)).map((result) => {
					return new Date(result.created_at);
				});
			});
	};

	private readonly findLatestTimeCommitted = async () => {
		return this.templateBatch()
			.select('latest_committed_time')
			.order('id', {
				ascending: false,
			})
			.limit(1)
			.then((result) => {
				const latestCommittedTime = Defined.parse(result.data?.at(0))
					.map((result) => {
						return new Date(result.latest_committed_time);
					})
					.orThrow(new Error('latestTimeCommitted must be defined'));

				return DatabaseOperation.succeed({ latestCommittedTime });
			});
	};

	readonly findLatestCommittedTime = async () => {
		return this.shouldUpdate().then((result) => {
			return result.flatMap(async (shouldUpdate) => {
				if (isFalse(shouldUpdate)) {
					return this.findLatestTimeCommitted();
				}

				return await this.insertion()
					.then((result) => {
						return result.flatMap((batch) => {
							return this.template().insertion({
								batch,
							});
						});
					})
					.then(this.findLatestTimeCommitted);
			});
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
