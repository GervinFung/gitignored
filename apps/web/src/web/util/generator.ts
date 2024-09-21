import type Templates from '../../../pages/templates';

import hexRgb from 'hex-rgb';

//ref: https://www.w3.org/TR/AERT/#color-contrast
const generateContrastingColor = (hex: string) => {
	if (!hex) {
		return '#000';
	}

	const { red, green, blue } = hexRgb(hex);

	const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

	return brightness >= 220 ? '#000' : '#FFF';
};

const combineTemplates = (templates: Templates) => {
	return templates
		.map((template) => {
			return `### The gitignore of ${template.name.toUpperCase()}\n${
				template.content
			}`;
		})
		.join('\n\n');
};

export { generateContrastingColor, combineTemplates };
