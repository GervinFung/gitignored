import Routes from '../../../src/api/routes/instance';
import { procedure } from '../../../src/api/routes/external/util';

const templatesName = procedure(
	Routes.instance().external().template.findAllTemplatesName
);

export default templatesName;
