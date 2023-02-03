import { ObjectId } from 'mongodb';
import { describe, it, expect } from 'vitest';
import {
    parseAsGitIgnoreSelectedTechs,
    parseAsGitIgnoreTechs,
} from '../../../../src/web/util';
import { httpResponseJson } from '../../../util';

const testGitignoredAndGenerate = () =>
    describe('Api gitignored & generate test', () => {
        it('should return an array of id and their tech name', async () => {
            const gitignored = parseAsGitIgnoreTechs(
                (
                    await httpResponseJson({
                        param: 'gitignored',
                    })
                ).gitIgnoreNamesAndIds
            );
            expect(
                gitignored.length &&
                    gitignored.every(
                        ({ id, name }) =>
                            ObjectId.isValid(id) && typeof name === 'string'
                    )
            ).toBe(true);

            const generate = parseAsGitIgnoreSelectedTechs(
                (
                    await httpResponseJson({
                        param: `generate?selectedIds=${gitignored[0]?.id}`,
                    })
                ).gitIgnoreNamesAndIds
            );

            expect(
                generate.every(
                    ({ name, content }) =>
                        typeof name === 'string' && typeof content === 'string'
                )
            ).toBe(true);
        });
    });

export default testGitignoredAndGenerate;
