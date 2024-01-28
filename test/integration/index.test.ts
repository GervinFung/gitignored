import child from 'child_process';

import { beforeEach, describe } from 'vitest';

import templateTest_1 from './template/test_1';

const testIntegration = () => {
	// beforeEach(() => {
	// 	child.execSync('make reset-database', { stdio: [] });
	// });

	describe('Integration Test', () => {
		const testCases: ReadonlyArray<readonly [() => void, 'only'?]> = [
			[templateTest_1],
		];

		const selectedTestCases = testCases.filter(([, only]) => {
			return only === 'only';
		});

		(selectedTestCases.length ? selectedTestCases : testCases).forEach(
			([testCase]) => {
				testCase();
			}
		);
	});
};

testIntegration();
