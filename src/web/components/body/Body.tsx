import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import IntroText from './IntroText';
import SearchBar from './SearchBar';
import Name from './Name';
import Menu from './menu';
import { ToastError, ToastPromise } from '../toaser/Toaser';
import { ToastContainer } from 'react-toastify';
import theme from '../../theme/theme';
import Contents from './content';
import Cli from './Cli';
import type {
    GitIgnoreSelectedIds,
    GitIgnoreSelectedTechs,
} from '../../../common/type';
import { api, title } from '../../util';
import { parseAsString } from '../../../common/util/parser';
import axios from 'axios';
import Cache from '../../util/cache';
import type { Return as GitIgnoredReturn } from '../../../../pages/api/gitignored';
import type { Return as GenerateReturn } from '../../../../pages/api/generate';
import type { Return as CommitTimeReturn } from '../../../../pages/api/commit-time';
import { arrayDelimiter } from '../../../common/const';

type Option = 'preview' | 'download';
type CombinedTechs = undefined | GitIgnoreSelectedTechs[0]['content'];

const getLatestSelectedTechs = (selectedIds: GitIgnoreSelectedIds) =>
    axios
        .get(`${api.generate}?selectedIds=${selectedIds.join(arrayDelimiter)}`)
        .then(
            ({ data }) =>
                data.gitIgnoreSelectedTechs as GenerateReturn['gitIgnoreSelectedTechs']
        );

const getLatestGitIgnoreNamesAndIds = () =>
    axios
        .get(`${api.gitIgnored}`)
        .then(
            ({ data }) =>
                ({
                    status: 'succeed',
                    gitIgnoreNamesAndIds:
                        data.gitIgnoreNamesAndIds as GitIgnoredReturn['gitIgnoreNamesAndIds'],
                } as const)
        )
        .catch(
            (error) =>
                ({
                    status: 'failed',
                    error,
                } as const)
        );

const getLatestCommitTime = () =>
    axios
        .get(`${api.commitTime}`)
        .then(
            ({ data }) =>
                ({
                    status: 'succeed',
                    latestCommitTime: data.latestCommitTime as ReturnType<
                        CommitTimeReturn['latestCommitTime']['toISOString']
                    >,
                } as const)
        )
        .catch(
            (error) =>
                ({
                    status: 'failed',
                    error,
                } as const)
        );

const Body = () => {
    const router = useRouter();
    const namesDelimiter = ',';

    const cache = Cache.instance();

    const [state, setState] = React.useState({
        isPush: false as boolean,
        option: undefined as undefined | Option,
        response: undefined as
            | undefined
            | Awaited<ReturnType<typeof getLatestGitIgnoreNamesAndIds>>,
        gitIgnore: {
            selectedIds: [] as GitIgnoreSelectedIds,
            combinedTechs: undefined as CombinedTechs,
            selectedTechs: [] as GitIgnoreSelectedTechs,
        },
    } as const);

    const {
        isPush,
        option,
        response,
        gitIgnore: { selectedTechs, combinedTechs, selectedIds },
    } = state;

    const { query } = router;
    const queryNames = query.names;

    const setLatestGitIgnoreNamesAndIdsFromAPI = () =>
        getLatestGitIgnoreNamesAndIds().then((response) => {
            setState((prev) => ({
                ...prev,
                response,
            }));
            switch (response.status) {
                case 'succeed': {
                    cache.updateGitIgnoreNamesAndIds(
                        response.gitIgnoreNamesAndIds
                    );
                }
            }
            return response;
        });

    const toastFeedback = (promise: Promise<Object>) =>
        ToastPromise({
            promise,
            pending: {
                render: () => (
                    <div>
                        Loading all <code>.gitignore</code> templates
                    </div>
                ),
            },
            success: {
                render: () => (
                    <div>
                        Loaded all <code>.gitignore</code> templates 😎
                    </div>
                ),
            },
            error: {
                render: () => (
                    <div>
                        Failed to load all <code>.gitignore</code> templates
                    </div>
                ),
            },
        });

    React.useEffect(() => {
        // TODO: get the time from api, api use redis to cache
        getLatestCommitTime()
            .then((response) => {
                switch (response.status) {
                    case 'failed': {
                        toastFeedback(setLatestGitIgnoreNamesAndIdsFromAPI());
                        break;
                    }
                    case 'succeed': {
                        if (
                            !cache.canGetFromCache(
                                new Date(response.latestCommitTime)
                            )
                        ) {
                            toastFeedback(
                                setLatestGitIgnoreNamesAndIdsFromAPI()
                            );
                        } else {
                            toastFeedback(
                                cache
                                    .getGitIgnoreNamesAndIds()
                                    .then((response) => {
                                        switch (response.status) {
                                            case 'failed': {
                                                return setLatestGitIgnoreNamesAndIdsFromAPI();
                                            }
                                            case 'succeed': {
                                                setState((prev) => ({
                                                    ...prev,
                                                    response,
                                                }));
                                                return response;
                                            }
                                        }
                                    })
                            );
                        }
                    }
                }
            })
            .catch(ToastError);
    }, []);

    const namesAndIds =
        !response || response.status === 'failed'
            ? []
            : response.gitIgnoreNamesAndIds;

    React.useEffect(() => {
        const names = decodeURIComponent(parseAsString(queryNames ?? '')).split(
            namesDelimiter
        );
        if (names.length) {
            setState((prev) => ({
                ...prev,
                option,
                gitIgnore: {
                    ...prev.gitIgnore,
                    selectedIds: namesAndIds.flatMap(({ id, name }) =>
                        !names.includes(name) ? [] : [id]
                    ),
                },
            }));
        }
    }, [queryNames]);

    const names = namesAndIds
        .filter(({ id }) => selectedIds.includes(id))
        .map(({ name }) => name);

    React.useEffect(() => {
        // ref: https://nextjs.org/docs/routing/shallow-routing
        if (isPush) {
            setState((prev) => ({
                ...prev,
                isPush: false,
            }));
            const params = Object.entries({
                names: names.join(namesDelimiter),
            })
                .flatMap(([key, value]) =>
                    // ref: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams#preserving_plus_signs
                    !value ? [] : [`${key}=${encodeURIComponent(value)}`]
                )
                .join('&');
            router.push(!params ? '' : `?${params}`, undefined, {
                shallow: true,
            });
        }
    }, [option, selectedIds.join()]);

    return (
        <Container>
            <ToastContainer
                style={{
                    fontFamily: theme.fontFamily,
                }}
            />
            <Image
                width={150}
                height={88}
                quality={100}
                alt={`Logo of ${title}`}
                src="/images/icons/logo.webp"
            />
            <Name />
            <IntroText />
            <SearchBar
                names={names}
                namesAndIds={namesAndIds}
                onChange={(selectedIds) =>
                    setState((prev) => ({
                        ...prev,
                        isPush: true,
                        gitIgnore: {
                            ...prev.gitIgnore,
                            selectedIds,
                        },
                    }))
                }
            />
            <Cli />
            <Menu
                hasCombinedTechs={Boolean(combinedTechs)}
                selectedIds={selectedIds}
                selectedTechs={selectedTechs}
                namesAndIdsIsEmpty={!namesAndIds.length}
                setCombinedGitIgnoreTech={(combinedTechs) =>
                    setState((prev) => ({
                        ...prev,
                        gitIgnore: {
                            ...prev.gitIgnore,
                            combinedTechs,
                        },
                    }))
                }
                setGitIgnoreTechs={({ option, selectedTechs }) =>
                    setState((prev) => ({
                        ...prev,
                        option,
                        gitIgnore: {
                            ...prev.gitIgnore,
                            selectedTechs,
                        },
                    }))
                }
            />
            <Contents
                selectedTechs={
                    option !== 'preview'
                        ? []
                        : !combinedTechs
                        ? selectedTechs
                        : selectedTechs.concat({
                              name: 'Combined',
                              content: combinedTechs,
                          })
                }
            />
        </Container>
    );
};

const Container = styled.div`
    min-height: 100%;
    width: 100%;
    padding: 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export type { CombinedTechs, Option };

export { getLatestSelectedTechs };

export default Body;
