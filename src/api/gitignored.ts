import { GatsbyFunctionRequest, GatsbyFunctionResponse } from 'gatsby';
import { GitIgnoreSelectedTechs, GitIgnoreNamesAndIds } from '../common/type';
import mongodb from '../database/mongo';
import { Response } from '../util/api/response';

//ref: https://www.gatsbyjs.com/docs/reference/functions/getting-started/
const gitIgnored = async (
    req: GatsbyFunctionRequest,
    res: GatsbyFunctionResponse<
        Response<
            | {
                  gitIgnoreNamesAndIds: GitIgnoreNamesAndIds;
              }
            | {
                  gitIgnoreSelectedTechs: GitIgnoreSelectedTechs;
              }
        >
    >
) => {
    if (req.method !== 'GET') {
        res.send('Non GET request is ignored');
    } else {
        const mongo = await mongodb;
        await mongo.updateGitIgnoreTemplate();
        res.send({
            gitIgnoreNamesAndIds: await mongo.getAllTechNamesAndIds(),
        });
    }
};

export default gitIgnored;
