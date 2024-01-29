import { templateRoutes } from './template';
import type { Trpc } from '../instance';
import { templateBatchRoutes } from './template-batch';

const internalAppRouter = (trpc: Trpc) => {
	return trpc.router({
		template: templateRoutes(trpc),
		templateBatch: templateBatchRoutes(trpc),
	});
};

type AppRouter = ReturnType<typeof internalAppRouter>;

export type { AppRouter };

export { internalAppRouter };
