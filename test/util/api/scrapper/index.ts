import { GitIgnoreNameAndContents } from '../../../../src/common/type';
import getGitIgnoreNameAndContents from '../../../../src/util/api/scrapper';

const testScrapper = () =>
    describe('Git Ignore Scrapper', () => {
        it('should scrap the name and the content of techs listed', async () => {
            const gitIgnoreNamesAndContents =
                await getGitIgnoreNameAndContents();
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
            ): boolean => {
                if (n == 1 || n == 0) {
                    return true;
                }
                return (
                    array[n - 1]?.name
                        ?.toLowerCase()
                        ?.localeCompare(array[n - 2]?.name?.toLowerCase()) &&
                    isNameSortedAlphabetically(array, n - 1)
                );
            };
            expect(
                isNameSortedAlphabetically(
                    gitIgnoreNamesAndContents,
                    gitIgnoreNamesAndContents.length
                )
            );
        });
    });

export default testScrapper;
