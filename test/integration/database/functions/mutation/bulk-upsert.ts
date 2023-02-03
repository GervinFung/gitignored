import Database from '../../../../../src/api/database/mongo';
import { parse } from '../../../../util';
import { describe, it, expect, beforeAll } from 'vitest';

const testBulkUpsert = () =>
    describe('Bulk Upsert', () => {
        beforeAll(async () => {
            await (await Database.instance()).clearCollections();
        });
        it('should throw error when argument is empty array', async () => {
            const database = await Database.instance();
            expect(
                database.bulkUpsertGitIgnoreTemplate([])
            ).rejects.toThrowError();
        });
        const [first, second] = [
            [
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
            ],
            [
                {
                    content: 'Vengeance, Revenge',
                    name: 'Avengers',
                },
            ],
        ] as const;
        it('should upsert when argument is not an empty array', async () => {
            const database = await Database.instance();

            const gitIgnoreTemplates =
                await database.bulkUpsertGitIgnoreTemplate(first);

            const techs = await database.getAllTechNamesAndIds();

            expect(
                techs.filter((tech) =>
                    first
                        .map(({ name }) => name)
                        .find((name) => name === tech.name)
                )
            ).toHaveLength(first.length);

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
                first
                    .filter((_, index, arr) => index !== arr.length - 1)
                    .map(({ name, content }) => ({ name, content }))
            );
        });
        it('should oveerride previous data for upserting', async () => {
            const database = await Database.instance();

            const gitIgnoreTemplates =
                await database.bulkUpsertGitIgnoreTemplate(second);

            const techs = await database.getAllTechNamesAndIds();
            const [, , , avenger] = techs;

            expect(techs).toHaveLength(second.length + first.length);
            expect(avenger?.name).toBe('Avengers');

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
                second.map(({ name, content }) => ({ name, content }))
            );
        });
    });

export default testBulkUpsert;
