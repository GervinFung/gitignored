type GitIgnoreTechs = ReadonlyArray<string>;
type GitIgnoreSelectedIds = ReadonlyArray<string>;

type GitIgnoreSelectedTechs = ReadonlyArray<
    Readonly<{
        name: string;
        content: string;
    }>
>;

type GitIgnoreNameAndContents = GitIgnoreSelectedTechs;

type GitIgnoreNamesAndIds = ReadonlyArray<
    Readonly<{
        name: GitIgnoreSelectedTechs[0]['name'];
        id: string;
    }>
>;

type TimeStamps = ReadonlyArray<
    Readonly<{
        bulkUpsertStatus: 'completed' | 'failed';
        createdAt: Date;
        updatedAt: Date;
    }>
>;

export type {
    GitIgnoreTechs,
    GitIgnoreSelectedTechs,
    TimeStamps,
    GitIgnoreNamesAndIds,
    GitIgnoreSelectedIds,
    GitIgnoreNameAndContents,
};
