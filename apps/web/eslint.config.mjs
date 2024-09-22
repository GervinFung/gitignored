import process from 'process';

// eslint-disable-next-line import/no-extraneous-dependencies
import { includeIgnoreFile } from '@eslint/compat';
// eslint-disable-next-line import/no-extraneous-dependencies
import eslint from '@eslint/js';
import { node, next } from '@poolofdeath20/eslint-config';
import tseslint from 'typescript-eslint';

const allowedFor = ['SyntaxHighlighter', 'Image'];

export default tseslint.config(
	// @ts-expect-error: type mismatch between eslint and eslint-compat
	includeIgnoreFile(`${process.cwd()}/.gitignore`),
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.strict,
	...tseslint.configs.stylistic,
	node,
	{
		...next,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		rules: {
			...next.rules,
			'react/jsx-child-element-spacing': 'off',
			'react/forbid-component-props': [
				'error',
				{
					forbid: [
						{
							propName: 'style',
							allowedFor,
							message: `Props "style" is forbidden for all components except ${allowedFor
								.map((component) => {
									return `"${component}"`;
								})
								.join(', ')}`,
						},
					],
				},
			],
		},
	}
);
