import type {
    GitIgnoreNamesAndIds,
    GitIgnoreSelectedTechs,
} from '../../common/type';
import { parseAsArray, parseAsString } from '../../common/util/parser';

const parseAsGitIgnoreTechs = (gitIgnoreTechs: unknown): GitIgnoreNamesAndIds =>
    parseAsArray(gitIgnoreTechs, (tech) => ({
        name: parseAsString(tech.name),
        id: parseAsString(tech.id),
    }));

const parseAsGitIgnoreSelectedTechs = (
    selectedTechs: unknown
): GitIgnoreSelectedTechs =>
    parseAsArray(selectedTechs, (tech) => ({
        name: parseAsString(tech.name),
        content: parseAsString(tech.content),
    }));

export { parseAsGitIgnoreTechs, parseAsGitIgnoreSelectedTechs };
