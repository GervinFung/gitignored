import cors from '../../src/api/cors';
import Database from '../../src/api/database/mongo';
import type { EndPointFunc } from '../../src/api/util';
import type { GitIgnoreNamesAndIds } from '../../src/common/type';

type Return = Readonly<{
    gitIgnoreNamesAndIds: GitIgnoreNamesAndIds;
}>;

const gitIgnored: EndPointFunc<Return> = async (req, res) => {
    await cors<Return>()(req, res);
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
