import axios from 'axios';
import type { GitIgnoreNamesAndContents } from '../../common/type';
import { parseAsArray, parseAsString } from '../../common/util/parser';

const scrapper = () => ({
    getLatestTimeCommitted: async (): Promise<Date> => {
        const { data } = await axios.get(
            'https://api.github.com/repos/github/gitignore/branches/main'
        );
        return new Date(parseAsString(data.commit.commit.author.date));
    },
    //ref: https://docs.github.com/en/rest/git/trees#get-a-tree
    getGitIgnoreNameAndContents:
        async (): Promise<GitIgnoreNamesAndContents> => {
            const { data } = await axios.get(
                'https://api.github.com/repos/github/gitignore/git/trees/main?recursive=1'
            );
            const nameAndContentList = await Promise.all(
                parseAsArray(data.tree, (branch) => {
                    const path = parseAsString(branch.path);
                    return !path.includes('.gitignore') ? [] : [path];
                })
                    .flat()
                    .map(async (path) => ({
                        name: parseAsString(path.split('/').pop()).replace(
                            '.gitignore',
                            ''
                        ),
                        content: parseAsString(
                            (
                                await axios.get(
                                    `https://raw.githubusercontent.com/github/gitignore/main/${path}`
                                )
                            ).data
                        ),
                    }))
            );
            console.log(`scrapped ${nameAndContentList.length} templates`);
            const duplicatedNameList = Array.from(
                new Set(
                    nameAndContentList
                        .map(({ name }) => name)
                        .filter(
                            (name, index, names) =>
                                names.indexOf(name) !== index
                        )
                )
            );
            const finalNameAndContentList = nameAndContentList
                .filter(({ name }) => !duplicatedNameList.includes(name))
                .concat(
                    nameAndContentList
                        .filter(({ name }) => duplicatedNameList.includes(name))
                        .flatMap(({ name }, index, array) =>
                            array[index - 1]?.name === name
                                ? []
                                : [
                                      {
                                          name,
                                          content: Array.from(
                                              new Set(
                                                  array
                                                      .filter(
                                                          (element) =>
                                                              element.name ===
                                                              name
                                                      )
                                                      .map(
                                                          ({ content }) =>
                                                              content
                                                      )
                                                      .join('\n')
                                                      .split('\n')
                                              )
                                          ).join('\n'),
                                      },
                                  ]
                        )
                );
            console.log(
                `after combining duplicates, there are total of ${finalNameAndContentList.length} templates`
            );
            return finalNameAndContentList.sort((a, b) =>
                a.name.localeCompare(b.name, undefined, {
                    ignorePunctuation: true,
                })
            );
        },
});

export default scrapper;
