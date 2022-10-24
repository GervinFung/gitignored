import Database from '../../../../src/api/database/mongo';
import testMutation from './mutation';
import testQuery from './query';
import testUtil from './util';
import testCases from 'cases-of-test';
import { afterAll, describe } from 'vitest';

const testMongo = () =>
    describe('MongoDB', () => {
        testCases({
            tests: [[testUtil], [testMutation], [testQuery]],
        });
        afterAll(async () => {
            const mongo = await Database.mongodb;
            await mongo.close();
        });
    });

export default testMongo;
