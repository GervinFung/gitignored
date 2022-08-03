import { GitIgnoreSelectedTechs } from '../common/type';
import Database from '../database/mongo';
import { formObjectIdsFromString } from '../database/mongo/util';
import { EndPointFunc } from '../util/api/response';

const generate: EndPointFunc<{
    gitIgnoreSelectedTechs: GitIgnoreSelectedTechs;
}> = async (req, res) => {
    if (req.method !== 'GET') {
        res.send('Non GET request is ignored');
    } else {
        const mongo = await Database.mongodb;
        await mongo.updateGitIgnoreTemplate();
        const { query } = req;
        const { selectedIds } = query;
        res.send({
            gitIgnoreSelectedTechs: !selectedIds
                ? []
                : await mongo.getContentAndNameFromSelectedIds(
                      formObjectIdsFromString(selectedIds)
                  ),
        });
    }
};

export default generate;
