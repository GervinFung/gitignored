import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        watch: false,
        testTimeout: 43200,
        include: ['test/index.ts'],
    },
});
