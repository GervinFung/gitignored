import { GitIgnoreNames } from '../common/type';
import Database from '../database/mongo';
import { EndPointFunc } from '../util/api/response';

const names: EndPointFunc<{
    gitIgnoreNames: GitIgnoreNames;
}> = async (req, res) => {
    if (req.method !== 'GET') {
        res.send('Non GET request is ignored');
    } else {
        const mongo = await Database.mongodb;
        await mongo.updateGitIgnoreTemplate();
        res.send({
            gitIgnoreNames: await mongo.getAllTechNames(),
        });
    }
};

export default names;
