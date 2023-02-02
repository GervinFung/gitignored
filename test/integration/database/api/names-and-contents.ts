import { describe, it, expect } from 'vitest';
import { parseAsGitIgnoreSelectedTechs } from '../../../../src/web/util';
import { httpResponseJson } from '../../../util';

const testNamesAndContents = () =>
    describe('Api get tech name and content', () => {
        it('should return an array of templates and their tech name', async () => {
            const namesAndContents = parseAsGitIgnoreSelectedTechs(
                await httpResponseJson({
                    param: 'names-and-contents',
                })
            );
            expect(
                namesAndContents.every(
                    ({ name, content }) =>
                        typeof name === 'string' && typeof content === 'string'
                )
            ).toBe(true);
        });
    });

export default testNamesAndContents;
