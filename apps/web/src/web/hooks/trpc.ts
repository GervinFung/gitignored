import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';

import superjson from 'superjson';

import type { AppRouter } from '../../api/routes/internal/_app';

import { getBaseUrl } from '../proxy/client';

const trpc = createTRPCNext<AppRouter>({
	config: () => {
		return {
			transformer: superjson,
			links: [
				httpBatchLink({
					/**
					 * If you want to use SSR, you need to use the server's full URL
					 * @link https://trpc.io/docs/ssr
					 **/
					url: `${getBaseUrl()}/api/trpc`,

					// You can pass any HTTP headers you wish here
					headers: async () => {
						return {
							// authorization: getAuthCookie(),
						};
					},
				}),
			],
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 **/
	ssr: false,
});

export default trpc;
