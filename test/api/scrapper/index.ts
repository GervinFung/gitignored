import testGitIgnoreTemplate from './gitIgnoreTemplate';
import testGitIgnoreRepoLatestCommitTime from './latestCommitTime';
import testCases from 'cases-of-test';
import { describe } from 'vitest';

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
