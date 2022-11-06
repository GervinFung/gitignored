import { ObjectId } from 'mongodb';
import Database from '../../../../../src/api/database/mongo';
import { beforeEach, describe, it, expect } from 'vitest';

const testUpdateGitIgnore = () =>
    describe('Update Git Ignore', () => {
        beforeEach(async () => {
            await (await Database.instance()).clearCollections();
        });
        it('should scrap and update', async () => {
            const database = await Database.instance();
            await database.updateGitIgnoreTemplate();

            const namesAndIds = await database.getAllTechNamesAndIds();

            expect(namesAndIds.length > 200);
            expect(
                namesAndIds.every(
                    ({ name, id }) =>
                        typeof name === 'string' && typeof id === 'string'
                )
            ).toBe(true);

            expect(
                (
                    await database.getContentAndNameFromSelectedIds(
                        namesAndIds.map(({ id }) => new ObjectId(id))
                    )
                ).every(({ name }, index) => name === namesAndIds[index]?.name)
            ).toBe(true);

            expect(
                (await database.getAllTechNamesAndContents()).every(
                    ({ name, content }, index) =>
                        name === namesAndIds[index]?.name &&
                        typeof content === 'string'
                )
            ).toBe(true);
        });
    });

export default testUpdateGitIgnore;
