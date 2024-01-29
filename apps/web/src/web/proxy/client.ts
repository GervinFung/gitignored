import { createTRPCProxyClient, httpLink } from '@trpc/client';

import superjson from 'superjson';

import { isBrowser } from '@poolofdeath20/util';

import type { AppRouter } from '../../api/routes/internal/_app';

const getBaseUrl = () => {
	if (!isBrowser()) {
		return '';
	}

	if (process.env.VERCEL_URL) {
		// reference for vercel.com
		return `https://${process.env.VERCEL_URL}`;
	}

	// assume localhost
	return process.env.NEXT_PUBLIC_ORIGIN;
};

const trpcClient = createTRPCProxyClient<AppRouter>({
	transformer: superjson,
	links: [
		httpLink({
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
});

export { getBaseUrl };
export default trpcClient;
