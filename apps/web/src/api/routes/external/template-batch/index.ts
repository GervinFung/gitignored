import type { Trpc } from '../../instance';

import { Persistence } from '../../../database/persistence';
import { result } from '../util';

const templateBatchRoutes = (trpc: Trpc) => {
	const batch = Persistence.instance().templateBatch();

	return trpc.router({
		latestCommittedTime: trpc.procedure.query(
			result(batch.findLatestCommittedTime)
		),
	});
};

export { templateBatchRoutes };
