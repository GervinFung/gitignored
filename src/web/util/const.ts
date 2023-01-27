const api = {
    gitIgnored: '/api/gitignored',
    generate: '/api/generate',
    commitTime: '/api/commit-time',
} as const;

const constants = {
    repo: 'https://github.com/Gitignored-App/web',
    cargo: 'https://crates.io/crates/gitignored-cli',
} as const;

const title = 'GIT-IGNORED';

export { api, constants, title };
