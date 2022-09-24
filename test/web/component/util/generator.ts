import {
    combineGitIgnoreTemplates,
    generateContrastingColor,
} from '../../../../src/web/util';

const testGenerator = () =>
    describe('Generator', () => {
        describe('Color Contrast Generator', () => {
            it('should generate #FFF when color brightness is low enough', () => {
                expect(generateContrastingColor('#E91E63')).toBe('#FFF');
                expect(generateContrastingColor('#000')).toBe('#FFF');
            });
            it('should generate #000 when color brightness is high enough', () => {
                expect(generateContrastingColor('#FFFF00')).toBe('#000');
                expect(generateContrastingColor('#FFF')).toBe('#000');
            });
            it('should return #000 when input is empty', () => {
                expect(generateContrastingColor('')).toBe('#000');
            });
        });
        describe('Combined Content Generator', () => {
            it('should generate combined content when there is content', () => {
                expect(
                    combineGitIgnoreTemplates([
                        {
                            name: 'Agda',
                            content: 'Agda',
                        },
                        {
                            name: 'Cobol',
                            content: 'Cobol',
                        },
                    ])
                ).toBe(
                    '### The gitignore of AGDA\nAgda\n\n### The gitignore of COBOL\nCobol'
                );
            });

            it('should generate empty content when there is no content', () => {
                expect(combineGitIgnoreTemplates([])).toBe('');
            });
        });
    });

export default testGenerator;
