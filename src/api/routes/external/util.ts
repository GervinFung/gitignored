import type { AsyncResult } from '@poolofdeath20/util';
import type { EndPointFunc, Response } from '../../cors';
import cors from '../../cors';

const result = <T>(operation: () => Promise<AsyncResult<T>>) => {
	return async () => {
		const result = await operation();

		return result.match({
			onFailed: (error) => {
				return error.message;
			},
			onSucceed: (data) => {
				return data;
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

export { procedure };
export { result };
