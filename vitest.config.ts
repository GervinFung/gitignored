import ci from 'ci-info';
import dotenv from 'dotenv';
import { defineConfig } from 'vitest/config';

export default defineConfig(() => {
	const timeOut = 300_000;

	dotenv.config();

	return {
		clearScreen: ci.isCI,
		test: {
			watch: false,
			testTimeout: timeOut,
			hookTimeout: timeOut,
			teardownTimeout: timeOut,
		},
	};
});
