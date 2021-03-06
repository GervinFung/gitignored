import { GitIgnoreNamesAndIds } from '../common/type';
import Database from '../database/mongo';
import { EndPointFunc } from '../util/api/response';

//ref: https://www.gatsbyjs.com/docs/reference/functions/getting-started/
const gitIgnored: EndPointFunc<{
    gitIgnoreNamesAndIds: GitIgnoreNamesAndIds;
}> = async (req, res) => {
    if (req.method !== 'GET') {
        res.send('Non GET request is ignored');
    } else {
        const mongo = await Database.mongodb;
        await mongo.updateGitIgnoreTemplate();
        res.send({
            gitIgnoreNamesAndIds: await mongo.getAllTechNamesAndIds(),
        });
    }
};

export default gitIgnored;
