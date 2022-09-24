import cors from '../../src/api/cors';
import Database from '../../src/api/database/mongo';
import type { EndPointFunc } from '../../src/api/util';
import type { GitIgnoreNamesAndContents } from '../../src/common/type';

type Return = Readonly<{
    gitIgnoreNamesAndContents: GitIgnoreNamesAndContents;
}>;

const namesAndContents: EndPointFunc<Return> = async (req, res) => {
    await cors<Return>()(req, res);
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
