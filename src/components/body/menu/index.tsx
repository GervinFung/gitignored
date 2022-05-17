import * as React from 'react';
import styled from 'styled-components';
import { arrayDelimiter } from '../../../common/const';
import {
    GitIgnoreSelectedIds,
    GitIgnoreSelectedTechs,
} from '../../../common/type';
import { combineGitIgnoreTemplates } from '../../../util/component-logic/generator';
import { parseAsGitIgnoreSelectedTechs } from '../../../util/component-logic/parser';
import { ToastError, ToastInfo, ToastPromise } from '../../toaser/Toaser';
import { CombinedTechs } from '../Body';
import Download from './Download';
import Preview from './Preview';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { generateApi } from '../../../util/component-logic/const';
import axios from 'axios';

const Menus = ({
    selectedIds,
    selectedTechs,
    setGitIgnoreTechs,
    setCombinedGitIgnoreTech,
}: Readonly<{
    selectedIds: GitIgnoreSelectedIds;
    selectedTechs: GitIgnoreSelectedTechs;
    setGitIgnoreTechs: (selectedTechs: GitIgnoreSelectedTechs) => void;
    setCombinedGitIgnoreTech: (current: CombinedTechs) => void;
}>) => {
    const options = ['Combined', 'Separated'] as const;

    const getLatestSelectedTechs = () =>
        axios
            .get(
                `${generateApi}?selectedIds=${selectedIds.join(arrayDelimiter)}`
            )
            .then(({ data }) =>
                parseAsGitIgnoreSelectedTechs(data.gitIgnoreSelectedTechs)
            );

    const shouldNotTakeAction = () =>
        !selectedIds.length && !selectedTechs.length;

    const setTemplates = (
        gitIgnoreSelectedTechs: GitIgnoreSelectedTechs,
        content: string | undefined
    ) => {
        setGitIgnoreTechs(gitIgnoreSelectedTechs);
        setCombinedGitIgnoreTech(content);
    };

    return (
        <Container>
            <Preview
                options={['Both', ...options]}
                onChange={(option) => {
                    if (shouldNotTakeAction()) {
                        return ToastInfo('You had not chosen any template yet');
                    }
                    const promise = new Promise<string>(async (res) => {
                        try {
                            const gitIgnoreSelectedTechs =
                                await getLatestSelectedTechs();
                            switch (option) {
                                case 'Separated': {
                                    setTemplates(
                                        gitIgnoreSelectedTechs,
                                        undefined
                                    );
                                    break;
                                }
                                case 'Combined': {
                                    setTemplates(
                                        [],
                                        !selectedIds.length
                                            ? undefined
                                            : combineGitIgnoreTemplates(
                                                  gitIgnoreSelectedTechs
                                              )
                                    );
                                    break;
                                }
                                case 'Both': {
                                    setTemplates(
                                        gitIgnoreSelectedTechs,
                                        !selectedIds.length
                                            ? undefined
                                            : combineGitIgnoreTemplates(
                                                  gitIgnoreSelectedTechs
                                              )
                                    );
                                    break;
                                }
                            }
                            res('Generation completed!');
                        } catch (error) {
                            ToastError(error);
                            res('Failed to generate');
                        }
                    });
                    ToastPromise({
                        promise,
                        pending: 'Generating template...',
                        success: undefined,
                        error: {
                            render: () => ToastError('Failed to generate'),
                        },
                    });
                }}
            />
            <Download
                options={options}
                onChange={(option) => {
                    if (shouldNotTakeAction()) {
                        return ToastInfo('You had not chosen any template yet');
                    }
                    const promise = new Promise<string>(async (res) => {
                        try {
                            const gitIgnoreSelectedTechs =
                                await getLatestSelectedTechs();
                            switch (option) {
                                case 'Combined': {
                                    const combinedTemplate =
                                        combineGitIgnoreTemplates(
                                            gitIgnoreSelectedTechs
                                        );
                                    setTemplates(
                                        gitIgnoreSelectedTechs,
                                        !selectedIds.length
                                            ? undefined
                                            : combinedTemplate
                                    );
                                    const blob = new Blob([combinedTemplate], {
                                        type: 'text/plain;charset=utf-8',
                                    });
                                    saveAs(
                                        blob,
                                        'gitignored-combined.gitignore'
                                    );
                                    break;
                                }
                                case 'Separated': {
                                    setTemplates(
                                        gitIgnoreSelectedTechs,
                                        undefined
                                    );
                                    const zip = new JSZip();
                                    const zippes = gitIgnoreSelectedTechs.map(
                                        ({ name, content }) =>
                                            zip.file(
                                                `${name}/.gitignore`,
                                                content
                                            )
                                    );
                                    const { length: zipped } = zippes;
                                    const { length: parsed } =
                                        gitIgnoreSelectedTechs;
                                    if (zipped !== parsed) {
                                        throw new Error(
                                            `${zippes} has ${zipped} files, while parsed has ${parsed}`
                                        );
                                    }
                                    zip.generateAsync({
                                        type: 'blob',
                                    })
                                        .then((value) =>
                                            saveAs(
                                                value,
                                                'gitignored-separated.zip'
                                            )
                                        )
                                        .catch(ToastError);
                                    break;
                                }
                            }
                            res('Download completed!');
                        } catch (error) {
                            ToastError(error);
                            res('Failed to download template');
                        }
                    });
                    ToastPromise({
                        promise,
                        pending: 'Downloading template...',
                        success: undefined,
                        error: {
                            render: () =>
                                ToastError('Failed to download template'),
                        },
                    });
                }}
            />
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    align-items: center;
    justfy-content: center;
    margin: 0 0 16px 0;
`;

export default Menus;
