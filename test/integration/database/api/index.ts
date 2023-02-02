import { beforeAll, afterAll, describe } from 'vitest';
import { Server } from '../../../util';
import testCommitTime from './commit-time';
import testGitignoredAndGenerate from './gitignored';
import testNamesAndContents from './names-and-contents';

const testApi = () => {
    const server = Server.create();
    beforeAll(async () => {
        await server.start();
    });
    describe('Api Test', () => {
        testCommitTime();
        testGitignoredAndGenerate();
        testNamesAndContents();
    });
    afterAll(() => {
        server.kill();
    });
};

export default testApi;
