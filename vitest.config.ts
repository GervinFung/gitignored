import fs from 'fs';
import { defineConfig } from 'vitest/config';

export default defineConfig(() => {
    const env = fs
        .readFileSync('.env.test', {
            encoding: 'utf-8',
        })
        .split('\n')
        .filter(Boolean)
        .reduce((prev, keyValuePair) => {
            const [key, value] = keyValuePair.split('=');
            return {
                ...prev,
                [key]: value,
            };
        }, {});

    return {
        test: {
            watch: false,
            testTimeout: 43200,
            include: ['test/index.ts'],
            env: Object.entries(env).reduce(
                (config, [key, value]) => ({
                    ...config,
                    [key]: value,
                }),
                {}
            ),
        },
    };
});
