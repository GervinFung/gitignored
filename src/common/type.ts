type Strings = ReadonlyArray<string>;
type GitIgnoreTechs = Strings;
type GitIgnoreSelectedIds = Strings;

type GitIgnore = Readonly<{
    name: string;
    content: string;
}>;

type GitIgnoreSelectedTechs = ReadonlyArray<GitIgnore>;

type GitIgnoreNamesAndContents = GitIgnoreSelectedTechs;

type GitIgnoreNamesAndIds = ReadonlyArray<
    Readonly<{
        name: GitIgnore['name'];
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
    GitIgnoreNamesAndContents,
};
