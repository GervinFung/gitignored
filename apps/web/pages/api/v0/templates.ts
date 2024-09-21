import { procedure } from '../../../src/api/routes/external/util';
import Routes from '../../../src/api/routes/instance';

const templates = procedure(
	Routes.instance().external().template.findAllTemplates
);

export default templates;
