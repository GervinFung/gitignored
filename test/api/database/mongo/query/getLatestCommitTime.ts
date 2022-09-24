import Database from '../../../../../src/api/database/mongo';

const testGetLatestCommitTime = () =>
    describe('Get Latest Commit Time', () => {
        beforeEach(async () => {
            await (await Database.mongodb).clearCollections();
        });
        it('should query latest commit time from github if the collection is empty', async () => {
            const mongo = await Database.mongodb;
            expect(await mongo.getLatestCommitTime()).toBeInstanceOf(Date);
        });
    });

export default testGetLatestCommitTime;
