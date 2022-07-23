import scrapper from '../../src/scrapper';

const testGitIgnoreRepoLatestCommitTime = () =>
    describe('Git Ignore Repo Latest Commit Time', () => {
        it('should scrap the latest commit time of github gitignore repo', async () => {
            expect(await scrapper.getLatestTimeCommitted()).toBeInstanceOf(
                Date
            );
        });
    });

export default testGitIgnoreRepoLatestCommitTime;
