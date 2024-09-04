import process from 'process';
import eslint from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	includeIgnoreFile(`${process.cwd()}/.gitignore`),
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.strict,
	...tseslint.configs.stylistic,
	{
		files: ['script/mongo-setup/document.js'],
		rules: {
			'no-undef': 'off',
		},
		extends: [tseslint.configs.disableTypeChecked],
	},
	{
		settings: {
			react: {
				version: 'detect',
			},
		},
		linterOptions: {
			reportUnusedDisableDirectives: 'error',
		},
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			'@typescript-eslint/array-type': [
				'error',
				{
					default: 'generic',
				},
			],
			'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					args: 'all',
					argsIgnorePattern: '^_',
					caughtErrors: 'all',
					caughtErrorsIgnorePattern: '^ignore',
					destructuredArrayIgnorePattern: '^_',
					ignoreRestSiblings: true,
				},
			],
			'react/prop-types': 'off',
			'react/jsx-uses-react': 'off',
			'react/react-in-jsx-scope': 'off',
			'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
			'arrow-body-style': ['error', 'always'],
			'no-restricted-syntax': [
				'error',
				{
					selector: 'TSEnumDeclaration',
					message: "Don't declare enums",
				},
			],
		},
	}
);
