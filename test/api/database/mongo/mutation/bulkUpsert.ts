import Database from '../../../../../src/api/database/mongo';
import { parse } from '../../../../util';
import { describe, it, expect } from 'vitest';

const testBulkUpsert = () =>
    describe('Bulk Upsert', () => {
        it('should throw error when argument is empty array', async () => {
            const database = await Database.instance();
            expect(
                database.bulkUpsertGitIgnoreTemplate([])
            ).rejects.toThrowError();
        });
        it('should upsert when argument is not an empty array', async () => {
            const database = await Database.instance();

            const namesAndContents = [
                {
                    content: 'Ts API',
                    name: 'TypeScript',
                },
                {
                    content: 'Java API',
                    name: 'Java',
                },
                {
                    content: 'Js API',
                    name: 'JavaScript',
                },
            ] as const;

            const gitIgnoreTemplates =
                await database.bulkUpsertGitIgnoreTemplate(namesAndContents);

            const techs = await database.getAllTechNamesAndIds();
            const [ts, java, js] = techs;

            expect(techs.length === 3).toBe(true);
            expect(ts?.name === 'TypeScript').toBe(true);
            expect(java?.name === 'Java').toBe(true);
            expect(js?.name === 'JavaScript').toBe(true);

            expect(
                await database.getContentAndNameFromSelectedIds(
                    Array.from(
                        {
                            length:
                                Object.entries(gitIgnoreTemplates).length - 1,
                        },
                        (_, index) => parse(gitIgnoreTemplates[index])
                    )
                )
            ).toStrictEqual(
                namesAndContents
                    .filter((_, index, arr) => index !== arr.length - 1)
                    .map(({ name, content }) => ({ name, content }))
            );
        });
        it('should oveerride previous data for upserting', async () => {
            const database = await Database.instance();
            const namesAndContents = [
                {
                    content: 'Vengeance, Revenge',
                    name: 'Avengers',
                },
            ] as const;

            const gitIgnoreTemplates =
                await database.bulkUpsertGitIgnoreTemplate(namesAndContents);

            const techs = await database.getAllTechNamesAndIds();
            const [avenger] = techs;

            expect(techs.length === 1).toBe(true);
            expect(avenger?.name === 'Avengers').toBe(true);

            expect(
                await database.getContentAndNameFromSelectedIds(
                    Array.from(
                        {
                            length: Object.entries(gitIgnoreTemplates).length,
                        },
                        (_, index) => parse(gitIgnoreTemplates[index])
                    )
                )
            ).toStrictEqual(
                namesAndContents.map(({ name, content }) => ({ name, content }))
            );
        });
    });

export default testBulkUpsert;
