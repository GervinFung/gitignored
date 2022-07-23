import testGitIgnoreTemplate from './gitIgnoreTemplate';
import testGitIgnoreRepoLatestCommitTime from './latestCommitTime';

const testScrapper = () =>
    describe('Scrapper', () => {
        testGitIgnoreTemplate();
        testGitIgnoreRepoLatestCommitTime();
    });

export default testScrapper;
