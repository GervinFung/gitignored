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

type UpdateTime = Readonly<{
    bulkUpsertStatus: 'completed' | 'failed';
    commitedAt: Date;
    startedAt: Date;
    endedAt: Date;
}>;

export type {
    UpdateTime,
    GitIgnoreTechs,
    GitIgnoreSelectedTechs,
    GitIgnoreNamesAndIds,
    GitIgnoreSelectedIds,
    GitIgnoreNameAndContents,
};
