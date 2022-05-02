import promisifiedGitIgnoreNamesAndContents from '../../../../src/util/api/scrapper';

const testScrapper = () =>
    describe('Git Ignore Scrapper', () => {
        it('should scrap the name and the content of techs listed', async () => {
            const gitIgnoreNamesAndContents =
                await promisifiedGitIgnoreNamesAndContents();
            expect(
                gitIgnoreNamesAndContents.length > 200 &&
                    gitIgnoreNamesAndContents.every(
                        ({ name, content }) =>
                            typeof name === 'string' &&
                            typeof content === 'string'
                    )
            );
        });
    });

export default testScrapper;
