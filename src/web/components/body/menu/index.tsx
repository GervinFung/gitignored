import React from 'react';
import styled from 'styled-components';
import { ToastError, ToastInfo, ToastPromise } from '../../toaser/Toaser';
import type { ActionOption, CombinedTechs } from '../Body';
import Download from './Download';
import Preview from './Preview';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import axios from 'axios';
import type {
    GitIgnoreSelectedIds,
    GitIgnoreSelectedTechs,
} from '../../../../common/type';
import { arrayDelimiter } from '../../../../common/const';
import {
    api,
    parseAsGitIgnoreSelectedTechs,
    combineGitIgnoreTemplates,
} from '../../../util';

const Menus = ({
    selectedIds,
    selectedTechs,
    setGitIgnoreTechs,
    setCombinedGitIgnoreTech,
}: Readonly<{
    selectedIds: GitIgnoreSelectedIds;
    selectedTechs: GitIgnoreSelectedTechs;
    setCombinedGitIgnoreTech: (current: CombinedTechs) => void;
    setGitIgnoreTechs: (
        p: Readonly<{
            actionOption: ActionOption;
            selectedTechs: GitIgnoreSelectedTechs;
        }>
    ) => void;
}>) => {
    const options = ['Combined', 'Separated'] as const;

    const getLatestSelectedTechs = () =>
        axios
            .get(
                `${api.generate}?selectedIds=${selectedIds.join(
                    arrayDelimiter
                )}`
            )
            .then(({ data }) =>
                parseAsGitIgnoreSelectedTechs(data.gitIgnoreSelectedTechs)
            );

    const shouldNotTakeAction = () =>
        !selectedIds.length && !selectedTechs.length;

    const setTemplates = ({
        content,
        actionOption,
        gitIgnoreSelectedTechs,
    }: Readonly<{
        actionOption: ActionOption;
        content: string | undefined;
        gitIgnoreSelectedTechs: GitIgnoreSelectedTechs;
    }>) => {
        setCombinedGitIgnoreTech(content);
        setGitIgnoreTechs({
            actionOption,
            selectedTechs: gitIgnoreSelectedTechs,
        });
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
                                    setTemplates({
                                        content: undefined,
                                        actionOption: 'Preview',
                                        gitIgnoreSelectedTechs,
                                    });
                                    break;
                                }
                                case 'Combined': {
                                    setTemplates({
                                        actionOption: 'Preview',
                                        gitIgnoreSelectedTechs: [],
                                        content: !selectedIds.length
                                            ? undefined
                                            : combineGitIgnoreTemplates(
                                                  gitIgnoreSelectedTechs
                                              ),
                                    });
                                    break;
                                }
                                case 'Both': {
                                    setTemplates({
                                        actionOption: 'Preview',
                                        gitIgnoreSelectedTechs,
                                        content: !selectedIds.length
                                            ? undefined
                                            : combineGitIgnoreTemplates(
                                                  gitIgnoreSelectedTechs
                                              ),
                                    });
                                    break;
                                }
                            }
                            res('Generation completed!');
                        } catch (error) {
                            ToastError(error);
                            res('Failed to generate');
                        }
                        return undefined;
                    });
                    ToastPromise({
                        promise,
                        pending: 'Generating template...',
                        success: undefined,
                        error: {
                            render: () => ToastError('Failed to generate'),
                        },
                    });
                    return undefined;
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
                                    setTemplates({
                                        gitIgnoreSelectedTechs,
                                        actionOption: 'Download',
                                        content: !selectedIds.length
                                            ? undefined
                                            : combinedTemplate,
                                    });
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
                                    setTemplates({
                                        content: undefined,
                                        gitIgnoreSelectedTechs,
                                        actionOption: 'Download',
                                    });
                                    const zip = new JSZip();
                                    const zippes = gitIgnoreSelectedTechs.map(
                                        ({ name, content }) =>
                                            zip.file(
                                                `${name}/.gitignore`,
                                                content
                                            )
                                    );
                                    const { length: zippedCount } = zippes;
                                    const { length: parsedCount } =
                                        gitIgnoreSelectedTechs;
                                    if (zippedCount !== parsedCount) {
                                        throw new Error(
                                            `${zippes} has ${zippedCount} files, while parsed has ${parsedCount}`
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
                    return undefined;
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
