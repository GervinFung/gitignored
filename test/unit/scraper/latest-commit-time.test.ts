import scrapper from '../../../src/api/scrapper';
import { describe, it, expect } from 'vitest';

describe('Git Ignore Repo Latest Commit Time', () => {
    it('should scrap the latest commit time of github gitignore repo', async () => {
        expect(await scrapper().getLatestTimeCommitted()).toBeInstanceOf(Date);
    });
});
