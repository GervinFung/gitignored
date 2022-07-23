import mongodb from '../../../../src/database/mongo';

const testGetLatestCommitTime = () =>
    describe('Get Latest Commit Time', () => {
        beforeEach(async () => {
            await (await mongodb).clearCollections();
        });
        it('should query latest commit time from github if the collection is empty', async () => {
            const mongo = await mongodb;
            expect(await mongo.getLatestCommitTime()).toBeInstanceOf(Date);
        });
    });

export default testGetLatestCommitTime;
