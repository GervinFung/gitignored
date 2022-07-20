import mongodb from '../../../../src/database/mongo';

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
        it('should return false for bulk upsert if latest time scrapped is larger than or equal to latest commit time ', async () => {
            const mongo = await mongodb;
            const date = new Date();

            expect(mongo.getLatestTimeUpdated()).rejects.toThrowError();

            expect(
                await mongo.insertLatestTimestamp({
                    createdAt: date,
                    bulkUpsertStatus: 'completed',
                    updatedAt: date,
                })
            ).toBeTruthy();

            expect(await mongo.getLatestTimeUpdated()).toStrictEqual(date);
            expect(await mongo.shouldBulkUpsert(async () => date)).toBe(false);
            expect(
                await mongo.shouldBulkUpsert(
                    async () => new Date(date.getTime() - 1)
                )
            ).toBe(false);
        });
        it('should return true for bulk upsert if latest time scrapped is less than latest commit time', async () => {
            const mongo = await mongodb;
            const date = new Date();

            expect(mongo.getLatestTimeUpdated()).rejects.toThrowError();

            expect(
                await mongo.insertLatestTimestamp({
                    createdAt: date,
                    bulkUpsertStatus: 'completed',
                    updatedAt: date,
                })
            ).toBeTruthy();

            expect(await mongo.getLatestTimeUpdated()).toStrictEqual(date);
            expect(
                await mongo.shouldBulkUpsert(
                    async () => new Date(date.getTime() + 1)
                )
            ).toBe(true);
        });
    });

export default testTimeStamp;
