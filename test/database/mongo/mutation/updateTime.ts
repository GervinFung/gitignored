import mongodb from '../../../../src/database/mongo';

const testUpdateTime = () =>
    describe('UpdateTime Time', () => {
        beforeEach(async () => {
            await (await mongodb).clearCollections();
        });
        it('should return false for bulk upsert if the latest commit time < previous commit time', async () => {
            const mongo = await mongodb;
            const commitedAt = new Date();

            expect(
                await mongo.insertLatestTimeUpdated({
                    commitedAt,
                    startedAt: new Date(),
                    endedAt: () => new Date(),
                    bulkUpsertStatus: 'completed',
                })
            ).toBeTruthy();

            expect(await mongo.getLatestCommitTime()).toStrictEqual(commitedAt);
            expect(await mongo.shouldBulkUpsert(async () => commitedAt)).toBe(
                false
            );
            expect(
                await mongo.shouldBulkUpsert(
                    async () => new Date(commitedAt.getTime() - 1)
                )
            ).toBe(false);
        });
        it('should return false for bulk upsert if the latest commit time = previous commit time', async () => {
            const mongo = await mongodb;
            const commitedAt = new Date();

            expect(
                await mongo.insertLatestTimeUpdated({
                    commitedAt,
                    startedAt: new Date(),
                    endedAt: () => new Date(),
                    bulkUpsertStatus: 'completed',
                })
            ).toBeTruthy();

            expect(await mongo.getLatestCommitTime()).toStrictEqual(commitedAt);
            expect(await mongo.shouldBulkUpsert(async () => commitedAt)).toBe(
                false
            );
        });
        it('should return true for bulk upsert if the latest commit time > previous commit time', async () => {
            const mongo = await mongodb;
            const commitedAt = new Date();

            expect(
                await mongo.insertLatestTimeUpdated({
                    commitedAt,
                    startedAt: new Date(),
                    endedAt: () => new Date(),
                    bulkUpsertStatus: 'completed',
                })
            ).toBeTruthy();

            expect(await mongo.getLatestCommitTime()).toStrictEqual(commitedAt);
            expect(
                await mongo.shouldBulkUpsert(
                    async () => new Date(commitedAt.getTime() - 1)
                )
            ).toBe(false);
        });
    });

export default testUpdateTime;
