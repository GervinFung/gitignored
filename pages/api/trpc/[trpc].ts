import { createNextApiHandler } from '@trpc/server/adapters/next';

import Routes, { createContext } from '../../../src/api/routes/instance';

// export API handler
// @see https://trpc.io/docs/server/adapters
const context = createNextApiHandler({
	createContext,
	router: Routes.instance().internal(),
});

export { createContext };
export default context;
