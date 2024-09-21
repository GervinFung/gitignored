import type { DeepReadonly } from '@poolofdeath20/util';
import type { NextApiRequest, NextApiResponse } from 'next';

import Cors from 'cors';

type Response<T> = string | DeepReadonly<T>;

type EndPointFunc<T> = (
	req: NextApiRequest,
	res: NextApiResponse<Response<T>>
) => Promise<void>;

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

export type { EndPointFunc, Response };

export default cors;
