import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import IntroText from './IntroText';
import SearchBar from './SearchBar';
import Name from './Name';
import Menu from './menu';
import { ToastError, ToastPromise } from '../toaser/Toaser';
import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';
import 'react-toastify/dist/ReactToastify.css';
import theme from '../../theme/theme';
import Contents from './content';
import axios from 'axios';
import Cli from './Cli';
import type {
    GitIgnoreNamesAndIds,
    GitIgnoreSelectedIds,
    GitIgnoreSelectedTechs,
} from '../../../common/type';
import { api, parseAsGitIgnoreTechs, title } from '../../util';

type ActionOption = 'Preview' | 'Download';
type CombinedTechs = undefined | GitIgnoreSelectedTechs[0]['content'];

const Body = () => {
    const [state, setState] = React.useState({
        actionOption: undefined as undefined | ActionOption,
        gitIgnore: {
            namesAndIds: [] as GitIgnoreNamesAndIds,
            selectedIds: [] as GitIgnoreSelectedIds,
            combinedTechs: undefined as CombinedTechs,
            selectedTechs: [] as GitIgnoreSelectedTechs,
        },
    } as const);

    const {
        actionOption,
        gitIgnore: { namesAndIds, selectedTechs, combinedTechs, selectedIds },
    } = state;

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            injectStyle();
        }
        const promise = new Promise<string>((res) =>
            axios
                .get(api.gitIgnored)
                .then(({ data }) => {
                    setState((prev) => ({
                        ...prev,
                        gitIgnore: {
                            ...prev.gitIgnore,
                            namesAndIds: parseAsGitIgnoreTechs(
                                data.gitIgnoreNamesAndIds
                            ),
                        },
                    }));
                    res('Loaded all .gitignore templates');
                })
                .catch(ToastError)
        );
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
                render: () =>
                    ToastError(
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
                namesAndIds={namesAndIds}
                setSelectedIds={(selectedIds) =>
                    setState((prev) => ({
                        ...prev,
                        gitIgnore: {
                            ...prev.gitIgnore,
                            selectedIds,
                        },
                    }))
                }
            />
            <Cli />
            <Menu
                selectedIds={selectedIds}
                selectedTechs={selectedTechs}
                setCombinedGitIgnoreTech={(combinedTechs) => {
                    setState((prev) => ({
                        ...prev,
                        gitIgnore: {
                            ...prev.gitIgnore,
                            combinedTechs,
                        },
                    }));
                }}
                setGitIgnoreTechs={({ actionOption, selectedTechs }) => {
                    setState((prev) => ({
                        ...prev,
                        actionOption,
                        gitIgnore: {
                            ...prev.gitIgnore,
                            selectedTechs,
                        },
                    }));
                }}
            />
            <Contents
                selectedTechs={
                    actionOption !== 'Preview'
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

export type { CombinedTechs, ActionOption };

export default Body;
