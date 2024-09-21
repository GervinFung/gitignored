import type { EndPointFunc, Response } from '../../cors';
import type { AsyncResult } from '@poolofdeath20/util';

import cors from '../../cors';

type Result<T> = Readonly<
	| {
			status: 'failed';
			reason: string;
	  }
	| {
			status: 'succeed';
			data: T;
	  }
>;

const result = <T>(operation: () => Promise<AsyncResult<T>>) => {
	return async (): Promise<Result<T>> => {
		const result = await operation();

		return result.match({
			failed: (error) => {
				return {
					status: 'failed',
					reason: error.message,
				};
			},
			succeed: (data) => {
				return {
					status: 'succeed',
					data,
				};
			},
		});
	};
};

const procedure = <T>(query: () => Promise<T>) => {
	const handler: EndPointFunc<T> = async (request, response) => {
		await cors<T>()(request, response);

		response.send(
			request.method !== 'GET'
				? 'Non GET request is ignored'
				: ((await query()) as Response<T>)
		);
	};

	return handler;
};

export { result, procedure };
