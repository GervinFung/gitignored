import {
    parseAsReadonlyArray,
    parseAsReadonlyObject,
    parseAsString,
} from 'parse-dont-validate';
import {
    GitIgnoreNamesAndIds,
    GitIgnoreSelectedTechs,
} from '../../common/type';

const parseAsGitIgnoreTechs = (gitIgnoreTechs: unknown): GitIgnoreNamesAndIds =>
    parseAsReadonlyArray(gitIgnoreTechs, (tech) =>
        parseAsReadonlyObject(tech, (tech) => ({
            name: parseAsString(tech.name).orElseThrowDefault('name'),
            id: parseAsString(tech.id).orElseThrowDefault('id'),
        })).orElseThrowDefault(tech)
    ).orElseGetReadonlyEmptyArray();

const parseAsGitIgnoreSelectedTechs = (
    selectedTechs: unknown
): GitIgnoreSelectedTechs =>
    parseAsReadonlyArray(selectedTechs, (tech) =>
        parseAsReadonlyObject(tech, (tech) => ({
            name: parseAsString(tech.name).orElseThrowDefault('name'),
            content: parseAsString(tech.content).orElseThrowDefault('content'),
        })).orElseThrowDefault(tech)
    ).orElseGetReadonlyEmptyArray();

export { parseAsGitIgnoreTechs, parseAsGitIgnoreSelectedTechs };
