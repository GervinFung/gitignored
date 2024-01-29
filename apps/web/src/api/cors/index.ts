import type { NextApiRequest, NextApiResponse } from 'next';

import Cors from 'cors';

import type { DeepReadonly } from '@poolofdeath20/util';

type Response<T> = string | DeepReadonly<T>;

type EndPointFunc<T> = (
	req: NextApiRequest,
	res: NextApiResponse<Response<T>>
) => Promise<void>;

export type { EndPointFunc, Response };

const initMiddleware = <T>(
	middleware: (
		request: NextApiRequest,
		response: NextApiResponse<T>,
		callback: (result: unknown) => void
	) => void
) => {
	return (request: NextApiRequest, response: NextApiResponse<T>) => {
		return new Promise((resolve, reject) => {
			middleware(request, response, (result: unknown) => {
				return result instanceof Error
					? reject(result)
					: resolve(result);
			});
		});
	};
};

const cors = <T>() => {
	return initMiddleware<Response<T>>(
		Cors({
			credentials: true,
			origin: process.env.NEXT_PUBLIC_ORIGIN,
		})
	);
};

export default cors;
