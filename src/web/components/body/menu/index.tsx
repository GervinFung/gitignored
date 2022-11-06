import React from 'react';
import styled from 'styled-components';
import { ToastError, ToastPromise } from '../../toaser/Toaser';
import { Option, CombinedTechs, getLatestSelectedTechs } from '../Body';
import Download from './Download';
import Preview from './Preview';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import type {
    GitIgnoreSelectedIds,
    GitIgnoreSelectedTechs,
} from '../../../../common/type';
import { combineGitIgnoreTemplates } from '../../../util';

const Menus = ({
    selectedIds,
    selectedTechs,
    hasCombinedTechs,
    setGitIgnoreTechs,
    namesAndIdsIsEmpty,
    setCombinedGitIgnoreTech,
}: Readonly<{
    hasCombinedTechs: boolean;
    namesAndIdsIsEmpty: boolean;
    selectedIds: GitIgnoreSelectedIds;
    selectedTechs: GitIgnoreSelectedTechs;
    setCombinedGitIgnoreTech: (current: CombinedTechs) => void;
    setGitIgnoreTechs: (
        _: Readonly<{
            option: Option;
            selectedTechs: GitIgnoreSelectedTechs;
        }>
    ) => void;
}>) => {
    const options = ['Combined', 'Separated'] as const;

    const hasNoSelectedIdsAndTechs =
        !selectedIds.length && !selectedTechs.length;

    const setTemplates = ({
        content,
        option,
        gitIgnoreSelectedTechs,
    }: Readonly<{
        option: Option;
        content: string | undefined;
        gitIgnoreSelectedTechs: GitIgnoreSelectedTechs;
    }>) => {
        setCombinedGitIgnoreTech(content);
        setGitIgnoreTechs({
            option,
            selectedTechs: gitIgnoreSelectedTechs,
        });
    };

    return (
        <Container>
            <Preview
                noIdsSelected={hasNoSelectedIdsAndTechs}
                noGitIgnoreNamesAndIds={namesAndIdsIsEmpty}
                options={
                    !(selectedTechs.length || hasCombinedTechs)
                        ? ['Both', ...options]
                        : ['Both', 'Clear', ...options]
                }
                onChange={(option) => {
                    if (hasNoSelectedIdsAndTechs) {
                        throw new Error('You had not chosen any template yet');
                    }
                    switch (option) {
                        case 'Clear': {
                            return setTemplates({
                                content: undefined,
                                option: 'preview',
                                gitIgnoreSelectedTechs: [],
                            });
                        }
                    }
                    const promise = new Promise<string>(
                        async (resolve, reject) => {
                            try {
                                const gitIgnoreSelectedTechs =
                                    await getLatestSelectedTechs(selectedIds);
                                switch (option) {
                                    case 'Separated': {
                                        setTemplates({
                                            content: undefined,
                                            option: 'preview',
                                            gitIgnoreSelectedTechs,
                                        });
                                        break;
                                    }
                                    case 'Combined': {
                                        setTemplates({
                                            option: 'preview',
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
                                            option: 'preview',
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
                                resolve('Generation completed!');
                            } catch (error) {
                                reject('Failed to generate');
                            }
                            return undefined;
                        }
                    );
                    ToastPromise({
                        promise,
                        pending: 'Generating template...',
                        success: undefined,
                        error: {
                            render: ({ data }) => data as any,
                        },
                    });
                    return undefined;
                }}
            />
            <Download
                noIdsSelected={hasNoSelectedIdsAndTechs}
                noGitIgnoreNamesAndIds={namesAndIdsIsEmpty}
                options={options}
                onChange={(option) => {
                    if (hasNoSelectedIdsAndTechs) {
                        throw new Error('You had not chosen any template yet');
                    }
                    const promise = new Promise<string>(
                        async (resolve, reject) => {
                            try {
                                const gitIgnoreSelectedTechs =
                                    await getLatestSelectedTechs(selectedIds);
                                switch (option) {
                                    case 'Combined': {
                                        const combinedTemplate =
                                            combineGitIgnoreTemplates(
                                                gitIgnoreSelectedTechs
                                            );
                                        setTemplates({
                                            gitIgnoreSelectedTechs,
                                            option: 'download',
                                            content: !selectedIds.length
                                                ? undefined
                                                : combinedTemplate,
                                        });
                                        const blob = new Blob(
                                            [combinedTemplate],
                                            {
                                                type: 'text/plain;charset=utf-8',
                                            }
                                        );
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
                                            option: 'download',
                                        });
                                        const zip = new JSZip();
                                        const zippes =
                                            gitIgnoreSelectedTechs.map(
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
                                resolve('Download completed!');
                            } catch (error) {
                                reject('Failed to download template');
                            }
                        }
                    );
                    ToastPromise({
                        promise,
                        pending: 'Downloading template...',
                        success: undefined,
                        error: {
                            render: ({ data }) => data as any,
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
