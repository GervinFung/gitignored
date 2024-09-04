import type { Trpc } from '../instance';

import { templateRoutes } from './template';

const internalAppRouter = (trpc: Trpc) => {
	return trpc.router({
		template: templateRoutes(trpc),
	});
};

type AppRouter = ReturnType<typeof internalAppRouter>;

export type { AppRouter };

export { internalAppRouter };
