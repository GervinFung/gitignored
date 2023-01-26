import cors from '../../src/api/cors';
import Database from '../../src/api/database/mongo';
import { formObjectIdsFromString } from '../../src/api/database/mongo/util';
import type { EndPointFunc } from '../../src/api/util';
import type { GitIgnoreSelectedTechs } from '../../src/common/type';

type Return = Readonly<{
    gitIgnoreSelectedTechs: GitIgnoreSelectedTechs;
}>;

const generate: EndPointFunc<Return> = async (request, response) => {
    await cors<Return>()(request, response);
    if (request.method !== 'GET') {
        response.send('Non GET request is ignored');
    } else {
        const database = await Database.instance();
        await database.updateGitIgnoreTemplate();
        const { query } = request;
        const { selectedIds } = query;
        response.send({
            gitIgnoreSelectedTechs:
                typeof selectedIds !== 'string'
                    ? []
                    : await database.getContentAndNameFromSelectedIds(
                          formObjectIdsFromString(selectedIds)
                      ),
        });
    }
};

export type { Return };

export default generate;
