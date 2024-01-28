import { Persistence } from '../../../database/persistence';
import type { Trpc } from '../../instance';
import { result } from '../util';

const templateRoutes = (trpc: Trpc) => {
	const template = Persistence.instance().template();

	return trpc.router({
		findAllTemplates: trpc.procedure.query(
			result(template.internalFindMany)
		),
	});
};

export { templateRoutes };
