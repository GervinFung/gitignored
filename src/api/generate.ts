import { GatsbyFunctionRequest, GatsbyFunctionResponse } from 'gatsby';
import { GitIgnoreSelectedTechs } from '../common/type';
import mongodb from '../database/mongo';
import { formObjectIdsFromString } from '../database/mongo/util';
import { Response } from '../util/api/response';

const generate = async (
    req: GatsbyFunctionRequest,
    res: GatsbyFunctionResponse<
        Response<{
            gitIgnoreSelectedTechs: GitIgnoreSelectedTechs;
        }>
    >
) => {
    if (req.method !== 'GET') {
        res.send('Non GET request is ignored');
    } else {
        const mongo = await mongodb;
        await mongo.updateGitIgnoreTemplate();
        const { query } = req;
        const { selectedIds } = query;
        res.send({
            gitIgnoreSelectedTechs: !selectedIds
                ? []
                : await (
                      await mongodb
                  ).getContentAndNameFromSelectedIds(
                      formObjectIdsFromString(selectedIds)
                  ),
        });
    }
};

export default generate;
