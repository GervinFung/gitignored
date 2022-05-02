import {
    parseAsGitIgnoreTechs,
    parseAsGitIgnoreSelectedTechs,
} from '../../../src/util/component-logic/parser';

const testParser = () =>
    describe('Parser', () => {
        describe('Git Ignore Techs Parser', () => {
            it('should return empty array as argument is not an array', () => {
                expect(parseAsGitIgnoreTechs('empty')).toStrictEqual([]);
            });
            it('should fail to parse as element in array is not object', () => {
                expect(() => parseAsGitIgnoreTechs(['string'])).toThrowError();
            });
            it('should fail to parse due to missing name', () => {
                expect(() =>
                    parseAsGitIgnoreTechs([
                        {
                            name: 'Java',
                            id: '123',
                        },
                        {
                            id: 'Coroutine',
                        },
                    ])
                ).toThrowError();
            });
            it('should fail to parse due to missing id', () => {
                expect(() =>
                    parseAsGitIgnoreTechs([
                        {
                            name: 'Java',
                        },
                        {
                            name: 'Kotlin',
                            id: '123',
                        },
                    ])
                ).toThrowError();
            });
            it('should parse successfully', () => {
                const techs = [
                    {
                        name: 'Java',
                        id: '123',
                    },
                    {
                        name: 'Kotlin',
                        id: '124',
                    },
                ] as const;
                expect(parseAsGitIgnoreTechs(techs)).toStrictEqual(techs);
            });
        });
        describe('Git Ignore Seleced Techs Parser', () => {
            it('should return empty array as argument is not an array', () => {
                expect(parseAsGitIgnoreSelectedTechs(1)).toStrictEqual([]);
            });
            it('should fail to parse as element in array is not object', () => {
                expect(() =>
                    parseAsGitIgnoreSelectedTechs(['string'])
                ).toThrowError();
            });
            it('should fail to parse due to missing name', () => {
                expect(() =>
                    parseAsGitIgnoreSelectedTechs([
                        {
                            name: 'Java',
                            content: 'Stream API',
                        },
                        {
                            content: 'Coroutine',
                        },
                    ])
                ).toThrowError();
            });
            it('should fail to parse due to missing content', () => {
                expect(() =>
                    parseAsGitIgnoreSelectedTechs([
                        {
                            name: 'Java',
                        },
                        {
                            name: 'Kotlin',
                            content: 'Coroutine',
                        },
                    ])
                ).toThrowError();
            });
            it('should parse successfully', () => {
                const selectedTechs = [
                    {
                        name: 'Java',
                        content: 'Stream API',
                    },
                    {
                        name: 'Kotlin',
                        content: 'Coroutine',
                    },
                ] as const;
                expect(
                    parseAsGitIgnoreSelectedTechs(selectedTechs)
                ).toStrictEqual(selectedTechs);
            });
        });
    });

export default testParser;
