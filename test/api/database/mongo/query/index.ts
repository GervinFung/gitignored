import testGetContentAndName from './getContentAndName';
import testGetLatestCommitTime from './getLatestCommitTime';

const testQuery = () => {
    describe('Query', () => {
        testGetContentAndName();
        testGetLatestCommitTime();
    });
};

export default testQuery;
