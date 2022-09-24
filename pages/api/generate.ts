import cors from '../../src/api/cors';
import Database from '../../src/api/database/mongo';
import { formObjectIdsFromString } from '../../src/api/database/mongo/util';
import type { EndPointFunc } from '../../src/api/util';
import type { GitIgnoreSelectedTechs } from '../../src/common/type';

type Return = Readonly<{
    gitIgnoreSelectedTechs: GitIgnoreSelectedTechs;
}>;

const generate: EndPointFunc<Return> = async (req, res) => {
    await cors<Return>()(req, res);
    if (req.method !== 'GET') {
        res.send('Non GET request is ignored');
    } else {
        const mongo = await Database.mongodb;
        await mongo.updateGitIgnoreTemplate();
        const { query } = req;
        const { selectedIds } = query;
        res.send({
            gitIgnoreSelectedTechs:
                typeof selectedIds !== 'string'
                    ? []
                    : await mongo.getContentAndNameFromSelectedIds(
                          formObjectIdsFromString(selectedIds)
                      ),
        });
    }
};

export default generate;
