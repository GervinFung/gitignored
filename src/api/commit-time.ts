import Database from '../database/mongo';
import { EndPointFunc } from '../util/api/response';

const commitTime: EndPointFunc<{
    latestCommitTime: Date;
}> = async (req, res) => {
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
