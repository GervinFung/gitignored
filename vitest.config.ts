import ci from 'ci-info';
import fs from 'fs';
import { defineConfig } from 'vitest/config';

export default defineConfig(() => {
    const timeOut = 300_000;

    return {
        clearScreen: ci.isCI,
        test: {
            watch: false,
            testTimeout: timeOut,
            hookTimeout: timeOut,
            teardownTimeout: timeOut,
            env: ci.isCI
                ? undefined
                : fs
                      .readFileSync('.env.testing', {
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
                      }, {}),
        },
    };
});
