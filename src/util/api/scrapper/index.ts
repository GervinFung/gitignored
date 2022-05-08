import axios from 'axios';
import { parseAsReadonlyArray, parseAsString } from 'parse-dont-validate';
import { GitIgnoreSelectedTechs } from '../../../common/type';

//ref: https://docs.github.com/en/rest/git/trees#get-a-tree
const getGitIgnoreNameAndContents =
    async (): Promise<GitIgnoreSelectedTechs> => {
        const { data } = await axios.get(
            'https://api.github.com/repos/github/gitignore/git/trees/main?recursive=1'
        );
        const gitIgnoreNamesAndContents = await parseAsReadonlyArray(
            data.tree,
            (branch) => {
                const path = parseAsString(branch.path).orElseThrowDefault(
                    `path of ${branch.path}`
                );
                return !path.includes('.gitignore') ? [] : [path];
            }
        )
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
            .reduce(
                async (prev, curr) => (await prev).concat(await curr),
                Promise.resolve([] as GitIgnoreSelectedTechs)
            );
        console.log(`scrapped ${gitIgnoreNamesAndContents.length} templates`);
        return gitIgnoreNamesAndContents;
    };

export default getGitIgnoreNameAndContents;
