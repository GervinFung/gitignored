import cors from '../../src/api/cors';
import Database from '../../src/api/database/mongo';
import type { EndPointFunc } from '../../src/api/util';
import type { GitIgnoreNamesAndIds } from '../../src/common/type';

type Return = Readonly<{
    gitIgnoreNamesAndIds: GitIgnoreNamesAndIds;
}>;

const gitIgnored: EndPointFunc<Return> = async (request, response) => {
    await cors<Return>()(request, response);
    if (request.method !== 'GET') {
        response.send('Non GET request is ignored');
    } else {
        const database = await Database.instance();
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await database.updateGitIgnoreTemplate();
        response.send({
            gitIgnoreNamesAndIds: await database.getAllTechNamesAndIds(),
        });
    }
};

export type { Return };

export default gitIgnored;
