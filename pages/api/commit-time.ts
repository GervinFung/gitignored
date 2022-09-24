import cors from '../../src/api/cors';
import Database from '../../src/api/database/mongo';
import type { EndPointFunc } from '../../src/api/util';

type Return = Readonly<{
    latestCommitTime: Date;
}>;

const commitTime: EndPointFunc<Return> = async (req, res) => {
    await cors<Return>()(req, res);
    if (req.method !== 'GET') {
        res.send('Non GET request is ignored');
    } else {
        const mongo = await Database.mongodb;
        res.send({
            latestCommitTime: await mongo.getLatestCommitTime(),
        });
    }
};

export default commitTime;
