import { ObjectId } from 'mongodb';
import Database from '../../../../../src/api/database/mongo';

const testUpdateGitIgnore = () =>
    describe('Update Git Ignore', () => {
        beforeEach(async () => {
            await (await Database.mongodb).clearCollections();
        });
        it('should scrap and update', async () => {
            const mongo = await Database.mongodb;
            await mongo.updateGitIgnoreTemplate();

            const namesAndIds = await mongo.getAllTechNamesAndIds();

            expect(namesAndIds.length > 200);
            expect(
                namesAndIds.every(
                    ({ name, id }) =>
                        typeof name === 'string' && typeof id === 'string'
                )
            ).toBe(true);

            expect(
                (
                    await mongo.getContentAndNameFromSelectedIds(
                        namesAndIds.map(({ id }) => new ObjectId(id))
                    )
                ).every(({ name }, index) => name === namesAndIds[index]?.name)
            ).toBe(true);

            expect(
                (await mongo.getAllTechNamesAndContents()).every(
                    ({ name, content }, index) =>
                        name === namesAndIds[index]?.name &&
                        typeof content === 'string'
                )
            ).toBe(true);
        });
    });

export default testUpdateGitIgnore;
