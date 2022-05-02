import * as React from 'react';
import styled from 'styled-components';
import IntroText from './IntroText';
import SearchBar from './SearchBar';
import { StaticImage } from 'gatsby-plugin-image';
import Name from './Name';
import { title } from '../../pages';
import {
    GitIgnoreNamesAndIds,
    GitIgnoreSelectedIds,
    GitIgnoreSelectedTechs,
} from '../../common/type';
import Menu from './menu';
import { ToastError, ToastPromise } from '../toaser/Toaser';
import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';
import 'react-toastify/dist/ReactToastify.css';
import theme from '../../theme/theme';
import Contents from './content';
import { parseAsGitIgnoreTechs } from '../../util/component-logic/parser';
import { gitIgnoredApi } from '../../util/component-logic/const';

if (typeof window !== 'undefined') {
    injectStyle();
}

type CombinedTechs = undefined | GitIgnoreSelectedTechs[0]['content'];

const Body = () => {
    const [state, setState] = React.useState({
        gitIgnore: {
            namesAndIds: [] as GitIgnoreNamesAndIds,
            selectedTechs: [] as GitIgnoreSelectedTechs,
            combinedTechs: undefined as CombinedTechs,
            selectedIds: [] as GitIgnoreSelectedIds,
        },
    } as const);

    const {
        gitIgnore: { namesAndIds, selectedTechs, combinedTechs, selectedIds },
    } = state;

    React.useEffect(() => {
        const promise = new Promise<string>((res) =>
            fetch(gitIgnoredApi)
                .then((res) => res.json())
                .then(({ gitIgnoreNamesAndIds }) => {
                    setState((prev) => ({
                        ...prev,
                        gitIgnore: {
                            ...prev.gitIgnore,
                            namesAndIds:
                                parseAsGitIgnoreTechs(gitIgnoreNamesAndIds),
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
            <StaticImage
                src="../../../static/images/git-ignored-logo.webp"
                alt={`Logo of ${title}`}
                width={150}
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
            <Menu
                selectedIds={selectedIds}
                selectedTechs={selectedTechs}
                setCombinedGitIgnoreTech={(combinedTechs) =>
                    setState((prev) => ({
                        ...prev,
                        gitIgnore: {
                            ...prev.gitIgnore,
                            combinedTechs,
                        },
                    }))
                }
                setGitIgnoreTechs={(selectedTechs) =>
                    setState((prev) => ({
                        ...prev,
                        gitIgnore: {
                            ...prev.gitIgnore,
                            selectedTechs,
                        },
                    }))
                }
            />
            <Contents
                selectedTechs={
                    !combinedTechs
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

export type { CombinedTechs };

export default Body;
