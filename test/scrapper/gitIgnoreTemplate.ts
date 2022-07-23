import { GitIgnoreNameAndContents } from '../../src/common/type';
import scrapper from '../../src/scrapper';
import { parse } from '../util';

const testGitIgnoreTemplate = () =>
    describe('Git Ignore Scrapper', () => {
        it('should scrap the name and the content of techs listed', async () => {
            const gitIgnoreNamesAndContents =
                await scrapper.getGitIgnoreNameAndContents();
            expect(
                gitIgnoreNamesAndContents.length > 200 &&
                    gitIgnoreNamesAndContents.every(
                        ({ name, content }) =>
                            typeof name === 'string' &&
                            typeof content === 'string'
                    )
            );
            const isNameSortedAlphabetically = (
                array: GitIgnoreNameAndContents,
                n: number
            ): boolean =>
                (n == 1 || n == 0) ??
                Boolean(
                    array[n - 1]?.name
                        ?.toLowerCase()
                        ?.localeCompare(
                            parse(array[n - 2]?.name?.toLowerCase())
                        ) && isNameSortedAlphabetically(array, n - 1)
                );
            expect(
                isNameSortedAlphabetically(
                    gitIgnoreNamesAndContents,
                    gitIgnoreNamesAndContents.length
                )
            );
        });
    });

export default testGitIgnoreTemplate;
