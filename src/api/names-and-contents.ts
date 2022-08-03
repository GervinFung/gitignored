import { GitIgnoreNamesAndContents } from '../common/type';
import Database from '../database/mongo';
import { EndPointFunc } from '../util/api/response';

const namesAndContents: EndPointFunc<{
    gitIgnoreNamesAndContents: GitIgnoreNamesAndContents;
}> = async (req, res) => {
    if (req.method !== 'GET') {
        res.send('Non GET request is ignored');
    } else {
        const mongo = await Database.mongodb;
        await mongo.updateGitIgnoreTemplate();
        res.send({
            gitIgnoreNamesAndContents: await mongo.getAllTechNamesAndContents(),
        });
    }
};

export default namesAndContents;
