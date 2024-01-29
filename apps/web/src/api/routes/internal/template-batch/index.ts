import { Persistence } from '../../../database/persistence';
import type { Trpc } from '../../instance';
import { result } from '../util';

const templateBatchRoutes = (trpc: Trpc) => {
	const batch = Persistence.instance().templateBatch();

	return trpc.router({
		shouldUpdate: trpc.procedure.query(result(batch.shouldUpdate)),
	});
};

export { templateBatchRoutes };
