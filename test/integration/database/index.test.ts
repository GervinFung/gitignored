import { afterAll, beforeAll, describe } from 'vitest';
import Database from '../../../src/api/database/mongo';
import testFunctions from './functions';
import testApis from './api';

const testIntegration = () => {
    beforeAll(async () => {
        await (await Database.instance()).clearCollections();
    });
    describe('Integration Test', () => {
        testFunctions();
        testApis();
    });
    afterAll(async () => {
        await (await Database.instance()).close();
    });
};

testIntegration();
