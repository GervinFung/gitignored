import hexRgb from 'hex-rgb';
import type { GitIgnoreSelectedTechs } from '../../common/type';

//ref: https://www.w3.org/TR/AERT/#color-contrast
const generateContrastingColor = (hex: string) => {
    if (!hex) {
        return '#000';
    }
    const { red, green, blue } = hexRgb(hex);
    const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
    return brightness >= 220 ? '#000' : '#FFF';
};

const combineGitIgnoreTemplates = (selectedTechs: GitIgnoreSelectedTechs) =>
    selectedTechs
        .map(
            ({ name, content }) =>
                `### The gitignore of ${name.toUpperCase()}\n${content}`
        )
        .join('\n\n');

export { generateContrastingColor, combineGitIgnoreTemplates };
