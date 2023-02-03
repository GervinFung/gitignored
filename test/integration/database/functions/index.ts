import { describe } from 'vitest';
import testBulkUpsert from '../functions/mutation/bulk-upsert';
import testUpdateGitIgnore from '../functions/mutation/update-gitignore';
import testUpdateTime from '../functions/mutation/update-time';
import testGetContentAndName from '../functions/query/get-content-and-name';
import testGetLatestCommitTime from '../functions/query/get-latest-commit-time';

const testFunctions = () =>
    describe('should ensure that all database functions can be used properly according to intention', () => {
        testBulkUpsert();
        testUpdateGitIgnore();
        testUpdateTime();
        testGetLatestCommitTime();
        testGetContentAndName();
    });

export default testFunctions;
