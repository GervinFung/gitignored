import { ObjectId } from 'mongodb';
import Database from '../../../../../src/api/database/mongo';
import { beforeEach, describe, it, expect } from 'vitest';

const testGetContentAndName = () =>
    describe('Get Content and Name', () => {
        beforeEach(async () => {
            await (await Database.instance()).clearCollections();
        });
        it('should throw error when empty array is passed', async () => {
            const database = await Database.instance();
            expect(
                database.getContentAndNameFromSelectedIds([])
            ).rejects.toThrowError();
        });
        it('should return empty array when there is no match', async () => {
            const database = await Database.instance();
            expect(
                await database.getContentAndNameFromSelectedIds([
                    new ObjectId('507f1f77bcf86cd799439011'),
                ])
            ).toStrictEqual([]);
        });
    });

export default testGetContentAndName;
