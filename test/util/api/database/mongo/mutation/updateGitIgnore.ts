import { ObjectId } from 'mongodb';
import mongodb from '../../../../../../src/util/api/database/mongo';

const testUpdateGitIgnore = () =>
    describe('Update Git Ignore', () => {
        beforeEach(async () => {
            await (await mongodb).clearCollections();
        });
        it('should scrap and update', async () => {
            const mongo = await mongodb;
            await mongo.updateGitIgnoreTemplate();

            const namesAndIds = await mongo.getAllTechNamesAndIds();

            expect(namesAndIds.length > 200);
            expect(
                namesAndIds.every(
                    ({ name, id }) =>
                        typeof name === 'string' && typeof id === 'string'
                )
            );

            expect(
                (
                    await mongo.getContentAndNameFromSelectedIds(
                        namesAndIds.map(({ id }) => new ObjectId(id))
                    )
                ).every(({ name }, index) => name === namesAndIds[index].name)
            );
        });
    });

export default testUpdateGitIgnore;
