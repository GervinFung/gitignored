import cors from '../../src/api/cors';
import Database from '../../src/api/database/mongo';
import type { EndPointFunc } from '../../src/api/util';
import type { GitIgnoreNamesAndContents } from '../../src/common/type';

type Return = Readonly<{
    gitIgnoreNamesAndContents: GitIgnoreNamesAndContents;
}>;

const namesAndContents: EndPointFunc<Return> = async (request, response) => {
    await cors<Return>()(request, response);
    if (request.method !== 'GET') {
        response.send('Non GET request is ignored');
    } else {
        const database = await Database.instance();
        await database.updateGitIgnoreTemplate();
        response.send({
            gitIgnoreNamesAndContents:
                await database.getAllTechNamesAndContents(),
        });
    }
};

export type { Return };

export default namesAndContents;
