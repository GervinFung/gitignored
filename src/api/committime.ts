import { GatsbyFunctionRequest, GatsbyFunctionResponse } from 'gatsby';
import mongodb from '../database/mongo';
import { Response } from '../util/api/response';

const commitTime = async (
    req: GatsbyFunctionRequest,
    res: GatsbyFunctionResponse<
        Response<{
            latestCommitTime: Date;
        }>
    >
) => {
    if (req.method !== 'GET') {
        res.send('Non GET request is ignored');
    } else {
        const mongo = await mongodb;
        res.send({
            latestCommitTime: await mongo.getLatestCommitTime(),
        });
    }
};

export default commitTime;
