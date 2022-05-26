import mongodb from '../../../../../../src/util/api/database/mongo';

const testTimeStamp = () =>
    describe('Time Stamp', () => {
        beforeEach(async () => {
            await (await mongodb).clearCollections();
        });
        it('should insert time', async () => {
            const mongo = await mongodb;
            const insertedId = await mongo.insertLatestTimestamp({
                createdAt: new Date(),
                bulkUpsertStatus: 'completed',
                updatedAt: new Date(),
            });
            expect(insertedId).toBeTruthy();
        });
        it('should return false for bulk upsert if differences between latest time scrapepd and current time is < 24 hrs', async () => {
            const mongo = await mongodb;
            await mongo.insertLatestTimestamp({
                createdAt: new Date(),
                bulkUpsertStatus: 'completed',
                updatedAt: new Date(
                    new Date(
                        new Date().getTime() - 24 * 60 * 60 * 1000
                    ).getTime() +
                        5 * 1000
                ),
            });
            expect(await mongo.shouldBulkUpsert()).toBe(false);
        });
        it('should return true for bulk upsert if differences between latest time scrapepd and current time is >= 24 hrs', async () => {
            const mongo = await mongodb;
            await mongo.insertLatestTimestamp({
                createdAt: new Date(),
                bulkUpsertStatus: 'completed',
                updatedAt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
            });

            // differences in time is === 24hrs
            expect(await mongo.shouldBulkUpsert()).toBe(true);

            await new Promise((res) =>
                setTimeout(() => res(undefined), 1 * 1000)
            );

            // differences in time is > 24hrs
            expect(await mongo.shouldBulkUpsert()).toBe(true);
        });
    });

export default testTimeStamp;
