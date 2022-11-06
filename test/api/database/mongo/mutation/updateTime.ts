import Database from '../../../../../src/api/database/mongo';
import { beforeEach, describe, it, expect } from 'vitest';

const testUpdateTime = () =>
    describe('UpdateTime Time', () => {
        beforeEach(async () => {
            await (await Database.instance()).clearCollections();
        });
        it('should return false for bulk upsert if the latest commit time < previous commit time', async () => {
            const database = await Database.instance();

            const commitedAt = new Date();

            expect(
                await database.insertLatestTimeUpdated({
                    commitedAt,
                    startedAt: new Date(),
                    endedAt: () => new Date(),
                    bulkUpsertStatus: 'completed',
                })
            ).toBeTruthy();

            expect(await database.getLatestCommitTime()).toStrictEqual(
                commitedAt
            );
            expect(
                await database.shouldBulkUpsert(async () => commitedAt)
            ).toBe(false);
            expect(
                await database.shouldBulkUpsert(
                    async () => new Date(commitedAt.getTime() - 1)
                )
            ).toBe(false);
        });
        it('should return false for bulk upsert if the latest commit time = previous commit time', async () => {
            const database = await Database.instance();
            const commitedAt = new Date();

            expect(
                await database.insertLatestTimeUpdated({
                    commitedAt,
                    startedAt: new Date(),
                    endedAt: () => new Date(),
                    bulkUpsertStatus: 'completed',
                })
            ).toBeTruthy();

            expect(await database.getLatestCommitTime()).toStrictEqual(
                commitedAt
            );
            expect(
                await database.shouldBulkUpsert(async () => commitedAt)
            ).toBe(false);
        });
        it('should return true for bulk upsert if the latest commit time > previous commit time', async () => {
            const database = await Database.instance();
            const commitedAt = new Date();

            expect(
                await database.insertLatestTimeUpdated({
                    commitedAt,
                    startedAt: new Date(),
                    endedAt: () => new Date(),
                    bulkUpsertStatus: 'completed',
                })
            ).toBeTruthy();

            expect(await database.getLatestCommitTime()).toStrictEqual(
                commitedAt
            );
            expect(
                await database.shouldBulkUpsert(
                    async () => new Date(commitedAt.getTime() - 1)
                )
            ).toBe(false);
        });
    });

export default testUpdateTime;
