import type { Trpc } from '../instance';

import { templateRoutes } from './template';
import { templateBatchRoutes } from './template-batch';

const externalAppRoutes = (trpc: Trpc) => {
	return trpc.router({
		template: templateRoutes(trpc),
		templateBatch: templateBatchRoutes(trpc),
	});
};

export { externalAppRoutes };
