import { GatsbyFunctionRequest, GatsbyFunctionResponse } from 'gatsby';
import { GitIgnoreSelectedTechs, GitIgnoreNamesAndIds } from '../common/type';
import { arrayDelimiter } from '../common/const';
import { ObjectId } from 'mongodb';
import mongodb from '../util/api/database/mongo';

//ref: https://www.gatsbyjs.com/docs/reference/functions/getting-started/
const tech = async (
    req: GatsbyFunctionRequest,
    res: GatsbyFunctionResponse<
        | string
        | Readonly<{
              gitIgnoreNamesAndIds: GitIgnoreNamesAndIds;
          }>
        | Readonly<{
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
        if (!selectedIds) {
            res.send({
                gitIgnoreNamesAndIds: await mongo.getAllTechNamesAndIds(),
            });
        } else {
            res.send({
                gitIgnoreSelectedTechs: await (
                    await mongodb
                ).getContentAndNameFromSelectedIds(
                    selectedIds
                        .split(arrayDelimiter)
                        .map((id) => new ObjectId(id))
                ),
            });
        }
    }
};

export default tech;
