import testGetContentAndName from './getContentAndName';
import testGetLatestCommitTime from './getLatestCommitTime';
import testCases from 'cases-of-test';
import { describe } from 'vitest';

const testQuery = () => {
    describe('Query', () => {
        testCases({
            tests: [[testGetContentAndName], [testGetLatestCommitTime]],
        });
    });
};

export default testQuery;
