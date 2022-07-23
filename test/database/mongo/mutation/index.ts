import testBulkUpsert from './bulkUpsert';
import testUpdateGitIgnore from './updateGitIgnore';
import testUpdateTime from './updateTime';

const testMutation = () => {
    describe('Mutation', () => {
        testBulkUpsert();
        testUpdateGitIgnore();
        testUpdateTime();
    });
};

export default testMutation;
