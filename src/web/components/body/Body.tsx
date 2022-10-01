import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import IntroText from './IntroText';
import SearchBar from './SearchBar';
import Name from './Name';
import Menu from './menu';
import { ToastPromise } from '../toaser/Toaser';
import { ToastContainer } from 'react-toastify';
import theme from '../../theme/theme';
import Contents from './content';
import Cli from './Cli';
import type {
    GitIgnoreSelectedIds,
    GitIgnoreSelectedTechs,
} from '../../../common/type';
import { api, parseAsGitIgnoreSelectedTechs, title } from '../../util';
import type { ServerProps } from '../../../../pages';
import { parseAsString } from '../../../common/util/parser';
import axios from 'axios';
import { arrayDelimiter } from '../../../common/const';

type Option = 'preview' | 'download';
type CombinedTechs = undefined | GitIgnoreSelectedTechs[0]['content'];

const getLatestSelectedTechs = (selectedIds: GitIgnoreSelectedIds) =>
    axios
        .get(`${api.generate}?selectedIds=${selectedIds.join(arrayDelimiter)}`)
        .then(({ data }) =>
            parseAsGitIgnoreSelectedTechs(data.gitIgnoreSelectedTechs)
        );

const Body = ({
    serverProps,
}: Readonly<{
    serverProps: ServerProps;
}>) => {
    const router = useRouter();
    const namesDelimiter = ',';

    const [state, setState] = React.useState({
        isPush: false as boolean,
        option: undefined as undefined | Option,
        gitIgnore: {
            selectedIds: [] as GitIgnoreSelectedIds,
            combinedTechs: undefined as CombinedTechs,
            selectedTechs: [] as GitIgnoreSelectedTechs,
        },
    } as const);

    const { response } = serverProps;

    const namesAndIds =
        response.status === 'failed' ? [] : response.gitIgnoreNamesAndIds;

    const {
        isPush,
        option,
        gitIgnore: { selectedTechs, combinedTechs, selectedIds },
    } = state;

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
                .flatMap(([key, value]) => (!value ? [] : [`${key}=${value}`]))
                .join('&');
            router.push(!params ? '' : `?${params}`, undefined, {
                shallow: true,
            });
        }
    }, [option, selectedIds.join()]);

    const { query } = router;
    const queryNames = query.names;

    React.useEffect(() => {
        const names = parseAsString(queryNames ?? '').split(namesDelimiter);
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

    React.useEffect(() => {
        const { response } = serverProps;
        const promise = new Promise<any>((resolve, reject) => {
            setTimeout(() => {
                switch (response.status) {
                    case 'failed':
                        return reject(response.error);
                    case 'success':
                        return resolve({});
                }
            }, 700);
        });
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
    }, []);

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
