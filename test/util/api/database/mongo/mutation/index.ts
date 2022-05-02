import testBulkUpsert from './bulkUpsert';
import testTimeStamp from './timeStamp';
import testUpdateGitIgnore from './updateGitIgnore';

const testMutation = () => {
    testTimeStamp();
    testBulkUpsert();
    testUpdateGitIgnore();
};

export default testMutation;
