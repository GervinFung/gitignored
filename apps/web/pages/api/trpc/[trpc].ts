import { createNextApiHandler } from '@trpc/server/adapters/next';

import Routes, { createContext } from '../../../src/api/routes/instance';

// export API handler
// @see https://trpc.io/docs/server/adapters
const context = createNextApiHandler({
	createContext,
	router: Routes.instance().internal(),
	responseMeta: (options) => {
		if (options.errors.length) {
			return {};
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

export { createContext };
export default context;
