import { procedure } from '../../../src/api/routes/external/util';
import Routes from '../../../src/api/routes/instance';

const time = procedure(
	Routes.instance().external().templateBatch.latestCommittedTime
);

export default time;
