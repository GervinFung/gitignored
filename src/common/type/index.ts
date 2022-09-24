type DeepReadonly<T> = T extends (infer R)[]
    ? ReadonlyArray<DeepReadonly<R>>
    : T extends Function
    ? T
    : T extends object
    ? DeepReadonlyObject<T>
    : T;

type DeepReadonlyObject<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};

type Strings = ReadonlyArray<string>;
type GitIgnoreTechs = Strings;
type GitIgnoreSelectedIds = Strings;

type GitIgnore = Readonly<{
    name: string;
    content: string;
}>;

type GitIgnoreSelectedTechs = ReadonlyArray<GitIgnore>;

type GitIgnoreNamesAndContents = GitIgnoreSelectedTechs;

type GitIgnoreNamesAndIds = DeepReadonly<
    Array<{
        id: string;
        name: GitIgnore['name'];
    }>
>;

type UpdateTime = Readonly<{
    endedAt: Date;
    startedAt: Date;
    commitedAt: Date;
    bulkUpsertStatus: 'completed' | 'failed';
}>;

export type {
    UpdateTime,
    GitIgnoreTechs,
    GitIgnoreSelectedTechs,
    GitIgnoreNamesAndIds,
    GitIgnoreSelectedIds,
    GitIgnoreNamesAndContents,
    DeepReadonly,
    DeepReadonlyObject,
};
