import cors from '../../src/api/cors';
import Database from '../../src/api/database/mongo';
import type { EndPointFunc } from '../../src/api/util';

type Return = Readonly<{
    latestCommitTime: Date;
}>;

const commitTime: EndPointFunc<Return> = async (request, response) => {
    await cors<Return>()(request, response);
    if (request.method !== 'GET') {
        response.send('Non GET request is ignored');
    } else {
        const database = await Database.instance();
        await database.updateGitIgnoreTemplate();
        response.send({
            latestCommitTime: await database.getLatestCommitTime(),
        });
    }
};

export type { Return };

export default commitTime;
