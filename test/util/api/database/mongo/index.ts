import mongodb from '../../../../../src/util/api/database/mongo';
import testMutation from './mutation';
import testQuery from './query';
import testUtil from './util';

const testMongo = () =>
    describe('MongoDB', () => {
        testUtil();
        testMutation();
        testQuery();
        afterAll(async () => {
            const mongo = await mongodb;
            await mongo.close();
        });
    });

export default testMongo;
