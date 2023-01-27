import localForage from 'localforage';
import type { GitIgnoreNamesAndIds } from '../../common/type';
import { parseAsGitIgnoreTechs } from './parser';

export default class Cache {
    private constructor(
        private readonly keys: Readonly<{
            gitIgnoreNamesAndIds: string;
        }>
    ) {}

    private static cache: Cache | undefined = undefined;

    static readonly instance = () => {
        const { cache } = this;
        switch (typeof cache) {
            case 'undefined': {
                return (this.cache = new Cache({
                    gitIgnoreNamesAndIds: 'gitIgnoreNamesAndIds',
                }));
            }
        }
        return cache;
    };

    updateGitIgnoreNamesAndIds = (gitIgnoreNamesAndIds: GitIgnoreNamesAndIds) =>
        localForage
            .setItem(this.keys.gitIgnoreNamesAndIds, gitIgnoreNamesAndIds)
            .then(
                (result) =>
                    ({
                        type: 'succeed',
                        result,
                    } as const)
            )
            .catch(
                (error) =>
                    ({
                        type: 'failed',
                        error,
                    } as const)
            );

    getGitIgnoreNamesAndIds = () =>
        localForage
            .getItem(this.keys.gitIgnoreNamesAndIds)
            .then(
                (item) =>
                    ({
                        status: 'succeed',
                        gitIgnoreNamesAndIds: parseAsGitIgnoreTechs(item),
                    } as const)
            )
            .catch(
                (error) =>
                    ({
                        status: 'failed',
                        error,
                    } as const)
            );

    canGetFromCache = (latestCommitTime: Date) =>
        new Date().getMilliseconds() >= latestCommitTime.getMilliseconds();
}
