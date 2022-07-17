import axios from 'axios';
import { parseAsReadonlyArray, parseAsString } from 'parse-dont-validate';
import { GitIgnoreNameAndContents } from '../common/type';

const scrapper = {
    getLatestTimeCommitted: async (): Promise<Date> => {
        const { data } = await axios.get(
            'https://api.github.com/repos/github/gitignore/branches/main'
        );
        return new Date(
            parseAsString(data.commit.commit.author.date).orElseThrowDefault(
                'date'
            )
        );
    },
    //ref: https://docs.github.com/en/rest/git/trees#get-a-tree
    getGitIgnoreNameAndContents:
        async (): Promise<GitIgnoreNameAndContents> => {
            const { data } = await axios.get(
                'https://api.github.com/repos/github/gitignore/git/trees/main?recursive=1'
            );
            const gitIgnoreNamesAndContents = await Promise.all(
                parseAsReadonlyArray(data.tree, (branch) => {
                    const path = parseAsString(branch.path).orElseThrowDefault(
                        `path of ${branch.path}`
                    );
                    return !path.includes('.gitignore') ? [] : [path];
                })
                    .orElseGetReadonlyEmptyArray()
                    .flat()
                    .map(async (path) => ({
                        name: parseAsString(path.split('/').pop())
                            .orElseThrowDefault(path)
                            .replace('.gitignore', ''),
                        content: parseAsString(
                            (
                                await axios.get(
                                    `https://raw.githubusercontent.com/github/gitignore/main/${path}`
                                )
                            ).data
                        ).orElseThrowDefault(`data for ${path}`),
                    }))
            );
            console.log(
                `scrapped ${gitIgnoreNamesAndContents.length} templates`
            );
            return gitIgnoreNamesAndContents.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
        },
};

export default scrapper;
