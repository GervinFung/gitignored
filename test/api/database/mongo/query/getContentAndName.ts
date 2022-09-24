import { ObjectId } from 'mongodb';
import Database from '../../../../../src/api/database/mongo';

const testGetContentAndName = () =>
    describe('Get Content and Name', () => {
        beforeEach(async () => {
            await (await Database.mongodb).clearCollections();
        });
        it('should throw error when empty array is passed', async () => {
            const mongo = await Database.mongodb;
            expect(
                mongo.getContentAndNameFromSelectedIds([])
            ).rejects.toThrowError();
        });
        it('should return empty array when there is no match', async () => {
            const mongo = await Database.mongodb;
            expect(
                await mongo.getContentAndNameFromSelectedIds([
                    new ObjectId('507f1f77bcf86cd799439011'),
                ])
            ).toStrictEqual([]);
        });
    });

export default testGetContentAndName;
