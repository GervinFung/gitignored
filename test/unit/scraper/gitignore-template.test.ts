import scrapper from '../../../src/api/scrapper';
import { parse } from '../../util';
import { describe, it, expect } from 'vitest';

describe('Git Ignore Scrapper', () => {
    const gitIgnoreNamesAndContentsPromise =
        scrapper().getGitIgnoreNameAndContents();
    it('should scrap the name and the content of techs listed', async () => {
        const gitIgnoreNamesAndContents =
            await gitIgnoreNamesAndContentsPromise;
        expect(
            gitIgnoreNamesAndContents.length ===
                new Set(gitIgnoreNamesAndContents.map(({ name }) => name))
                    .size &&
                gitIgnoreNamesAndContents.every(
                    ({ name, content }) =>
                        typeof name === 'string' && typeof content === 'string'
                )
        ).toBe(true);
    });
    it('should return sorted list according to name in ascending order', async () => {
        const gitIgnoreNamesAndContents =
            await gitIgnoreNamesAndContentsPromise;
        expect(
            gitIgnoreNamesAndContents.length &&
                gitIgnoreNamesAndContents.every(({ name }, index) =>
                    !index
                        ? true
                        : name.toUpperCase() >
                          parse(
                              gitIgnoreNamesAndContents[
                                  index - 1
                              ]?.name?.toUpperCase()
                          )
                )
        ).toBe(true);
    });
});
