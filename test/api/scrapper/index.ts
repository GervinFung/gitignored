import testGitIgnoreTemplate from './gitIgnoreTemplate';
import testGitIgnoreRepoLatestCommitTime from './latestCommitTime';
import testCases from 'cases-of-test';

const testScrapper = () =>
    describe('Scrapper', () => {
        testCases({
            tests: [
                [testGitIgnoreTemplate],
                [testGitIgnoreRepoLatestCommitTime],
            ],
        });
    });

export default testScrapper;
