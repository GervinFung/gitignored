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
            await (await Database.instance()).close();
        });
    });

export default testMongo;
