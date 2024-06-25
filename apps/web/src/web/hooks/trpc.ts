import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';

import superjson from 'superjson';

import type { AppRouter } from '../../api/routes/internal/_app';

import { getBaseUrl } from '../proxy/client';
import { isBrowser } from '@poolofdeath20/util';

const trpc = createTRPCNext<AppRouter>({
	/**
	 * @link https://trpc.io/docs/ssr
	 **/
	ssr: true,
	config: ({ ctx }) => {
		if (!isBrowser()) {
			return {
				transformer: superjson,
				links: [
					httpBatchLink({
						url: '/api/trpc',
					}),
				],
			};
		}

		return {
			transformer: superjson,
			links: [
				httpBatchLink({
					url: `${getBaseUrl()}/api/trpc`,
					headers() {
						if (!ctx?.req?.headers) {
							return {};
						}

						return {
							cookie: ctx.req.headers.cookie,
						};
					},
				}),
			],
		};
	},
	responseMeta: (options) => {
		if (options.clientErrors.length) {
			// propagate http first error from API calls
			return {
				status: options.clientErrors.at(0)?.data?.httpStatus ?? 500,
			};
		}

		const oneDay = 60 * 60 * 24;
		const oneHour = 60 * 60;

		return {
			headers: {
				'cache-control': `s-maxage=${oneDay}, stale-while-revalidate=${oneHour}`,
			},
		};
	},
});

export default trpc;
