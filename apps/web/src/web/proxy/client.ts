import { createTRPCProxyClient, httpLink } from '@trpc/client';

import superjson from 'superjson';

import { Defined, isBrowser } from '@poolofdeath20/util';

import type { AppRouter } from '../../api/routes/internal/_app';

const getBaseUrl = () => {
	if (!isBrowser()) {
		return '';
	}

	return Defined.parse(process.env['VERCEL_URL'])
		.map((vercelUrl) => {
			// reference for vercel.com
			return `https://${vercelUrl}`;
		})
		.orGet(process.env.NEXT_PUBLIC_ORIGIN);
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
