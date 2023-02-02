import { describe, it, expect } from 'vitest';
import { httpResponseJson } from '../../../util';

const testCommitTime = () =>
    describe('Api commit time', () => {
        it('should return the latest commit time on main/master branch', async () => {
            const response = await httpResponseJson({
                param: 'commit-time',
            });
            expect(new Date(response.latestCommitTime).getTime()).not.toBe(
                'NaN'
            );
        });
    });

export default testCommitTime;
