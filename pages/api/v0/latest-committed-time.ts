import Routes from '../../../src/api/routes/instance';
import { procedure } from '../../../src/api/routes/external/util';

const time = procedure(
	Routes.instance().external().templateBatch.latestCommittedTime
);

export default time;
