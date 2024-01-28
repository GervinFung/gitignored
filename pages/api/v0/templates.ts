import Routes from '../../../src/api/routes/instance';
import { procedure } from '../../../src/api/routes/external/util';

const templates = procedure(
	Routes.instance().external().template.findAllTemplates
);

export default templates;
