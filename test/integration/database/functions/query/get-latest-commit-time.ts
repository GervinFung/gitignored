import Database from '../../../../../src/api/database/mongo';
import { beforeEach, describe, it, expect } from 'vitest';

const testGetLatestCommitTime = () =>
    describe('Get Latest Commit Time', () => {
        beforeEach(async () => {
            await (await Database.instance()).clearCollections();
        });
        it('should query latest commit time from github if the collection is empty', async () => {
            const database = await Database.instance();
            expect(await database.getLatestCommitTime()).toBeInstanceOf(Date);
        });
    });

export default testGetLatestCommitTime;
